import { useEffect, useMemo, useState } from 'react'

import {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarEstadoUsuario,
} from '../services/usuarioService'

import { useAuth } from '@/modules/auth/hooks/useAuth'
import { rolesAsignables, ROLES } from '@/modules/auth/roles'

const FORM_VACIO = {
    nom_per: '',
    ap_pat_per: '',
    carnet_per: '',
    correo_usu: '',
    cel_per: '',
    id_rol_1: '',
}

export default function useUsuarios() {

    const { user } = useAuth()

    const roles = useMemo(() => rolesAsignables(user), [user])

    const [usuarios, setUsuarios] = useState([])

    const [loading, setLoading] = useState(true)

    const [showModal, setShowModal] = useState(false)

    // 'view' | 'create' | 'edit'
    const [modalMode, setModalMode] = useState('view')

    const [searchQuery, setSearchQuery] = useState('')

    const [perPage, setPerPage] = useState(10)

    const [currentPage, setCurrentPage] = useState(1)

    const [overlay, setOverlay] = useState({
        show: false,
        type: 'activo',
    })

    const [topAlert, setTopAlert] = useState({
        show: false,
        type: 'creado',
        message: '',
    })

    const [formData, setFormData] = useState(FORM_VACIO)

    const [errors, setErrors] = useState({})

    const [processing, setProcessing] = useState(false)

    const [selectedUser, setSelectedUser] = useState(null)

    const cargarUsuarios = async () => {

        try {

            const data = await obtenerUsuarios()

            setUsuarios(data)

        } catch (error) {

            console.log(error)

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {
        cargarUsuarios()
    }, [])

    const filteredUsers = useMemo(() => {

        return usuarios.filter((u) => {

            const search = searchQuery.toLowerCase()

            return (
                (u.persona?.nom_per ?? '')
                    .toLowerCase()
                    .includes(search)

                ||

                (u.persona?.ap_pat_per ?? '')
                    .toLowerCase()
                    .includes(search)

                ||

                (u.correo_usu ?? '')
                    .toLowerCase()
                    .includes(search)
            )
        })

    }, [usuarios, searchQuery])

    const paginatedUsers = useMemo(() => {

        const start = (currentPage - 1) * perPage

        return filteredUsers.slice(
            start,
            start + perPage
        )

    }, [filteredUsers, currentPage, perPage])

    // El carnet llama onChange(name, value), no un evento.
    const setData = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const cerrarModal = () => {
        setShowModal(false)
    }

    const abrirCrear = () => {

        // Sacerdote solo crea Secretario → rol fijo por defecto.
        const rolDefault =
            user?.id_rol_1 === ROLES.SACERDOTE ? ROLES.SECRETARIO : ''

        setFormData({ ...FORM_VACIO, id_rol_1: rolDefault })
        setErrors({})
        setSelectedUser(null)
        setModalMode('create')
        setShowModal(true)
    }

    const abrirEditar = (u) => {

        setFormData({
            nom_per: u.persona?.nom_per ?? '',
            ap_pat_per: u.persona?.ap_pat_per ?? '',
            carnet_per: u.persona?.carnet_per ?? '',
            correo_usu: u.correo_usu ?? '',
            cel_per: u.persona?.cel_per ?? '',
            id_rol_1: u.id_rol_1 ?? '',
            id_usu: u.id_usu,
            foto_usu: u.foto_usu,
        })
        setErrors({})
        setSelectedUser(u)
        setModalMode('edit')
        setShowModal(true)
    }

    const openView = (u) => {
        setSelectedUser(u)
        setModalMode('view')
        setShowModal(true)
    }

    const triggerNotify = (type, message) => {

        setOverlay({ show: true, type })

        setTopAlert({ show: true, type, message })

        setTimeout(() => {
            setOverlay((prev) => ({ ...prev, show: false }))
        }, 1200)

        setTimeout(() => {
            setTopAlert((prev) => ({ ...prev, show: false }))
        }, 3000)
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        setProcessing(true)
        setErrors({})

        try {

            if (modalMode === 'edit') {

                await actualizarUsuario(selectedUser.id_usu, formData)
                triggerNotify('creado', 'Usuario actualizado correctamente')

            } else {

                const res = await crearUsuario(formData)
                triggerNotify(
                    'creado',
                    res?.email_enviado === false
                        ? 'Usuario creado, pero no se pudo enviar el correo'
                        : 'Usuario creado, se envió la contraseña al correo'
                )
            }

            await cargarUsuarios()
            cerrarModal()

        } catch (error) {

            console.log(error)

            if (error.response?.status === 400 && error.response.data) {
                setErrors(error.response.data)
            }

            triggerNotify(
                'error',
                modalMode === 'edit'
                    ? 'Error al actualizar usuario'
                    : 'Error al crear usuario'
            )

        } finally {
            setProcessing(false)
        }
    }

    const toggleStatus = async (u) => {

        try {

            await cambiarEstadoUsuario(u.id_usu)

            await cargarUsuarios()

            const nuevoEstado =
                u.estado_usu === 'activo' ? 'inactivo' : 'activo'

            triggerNotify(nuevoEstado, `Usuario ${nuevoEstado}`)

        } catch (error) {

            console.log(error)

            triggerNotify('error', 'No se pudo cambiar el estado')
        }
    }

    return {

        usuarios: paginatedUsers,

        loading,

        showModal,
        modalMode,
        cerrarModal,

        abrirCrear,
        abrirEditar,
        openView,

        searchQuery,
        setSearchQuery,

        perPage,
        setPerPage,

        currentPage,
        setCurrentPage,

        roles,
        formData,
        setData,
        errors,
        processing,
        handleSubmit,

        overlay,
        topAlert,

        toggleStatus,

        selectedUser,
    }
}
