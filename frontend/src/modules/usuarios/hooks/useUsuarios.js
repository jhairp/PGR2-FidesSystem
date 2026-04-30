import { useEffect, useMemo, useState } from 'react'

import {
    obtenerUsuarios,
    crearUsuario,
    cambiarEstadoUsuario,
} from '../services/usuarioService'

export default function useUsuarios() {

    const [usuarios, setUsuarios] = useState([])

    const [loading, setLoading] = useState(true)

    const [showModal, setShowModal] = useState(false)

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

    const [formData, setFormData] = useState({
        nom_per: '',
        ap_pat_per: '',
        ap_mat_per: '',
        carnet_per: '',
        correo_usu: '',
        cel_per: '',
        id_rol_1: '',
        id_per_rol_1: 1,
    })

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

    const abrirModal = () => {
        setShowModal(true)
    }

    const cerrarModal = () => {
        setShowModal(false)
    }

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const triggerNotify = (type, message) => {

        setOverlay({
            show: true,
            type,
        })

        setTopAlert({
            show: true,
            type,
            message,
        })

        setTimeout(() => {

            setOverlay((prev) => ({
                ...prev,
                show: false,
            }))

        }, 1200)

        setTimeout(() => {

            setTopAlert((prev) => ({
                ...prev,
                show: false,
            }))

        }, 3000)
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            await crearUsuario(formData)

            await cargarUsuarios()

            cerrarModal()

            triggerNotify(
                'creado',
                'Usuario creado correctamente'
            )

        } catch (error) {

            console.log(error)

            triggerNotify(
                'error',
                'Error al crear usuario'
            )
        }
    }

    const toggleStatus = async (user) => {

        try {

            await cambiarEstadoUsuario(user.id_usu)

            await cargarUsuarios()

            const nuevoEstado =
                user.estado_usu === 'activo'
                    ? 'inactivo'
                    : 'activo'

            triggerNotify(
                nuevoEstado,
                `Usuario ${nuevoEstado}`
            )

        } catch (error) {

            console.log(error)

            triggerNotify(
                'error',
                'No se pudo cambiar el estado'
            )
        }
    }

    const [selectedUser, setSelectedUser] = useState(null)
    
    const openView = (user) => {

        setSelectedUser(user)

        setShowModal(true)
    }

    return {

        usuarios: paginatedUsers,

        loading,

        showModal,
        abrirModal,
        cerrarModal,

        searchQuery,
        setSearchQuery,

        perPage,
        setPerPage,

        currentPage,
        setCurrentPage,

        formData,
        handleChange,
        handleSubmit,

        overlay,
        topAlert,

        toggleStatus,

        selectedUser,
        openView,
    }
}