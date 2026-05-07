import { useEffect, useState } from 'react'

import bautizoService from '../services/bautizoService'

export default function useBautizos() {

    const [bautizos, setBautizos] = useState([])

    const [loading, setLoading] = useState(true)

    const [showModal, setShowModal] = useState(false)

    const [selectedBautizo, setSelectedBautizo] = useState(null)

    const [searchQuery, setSearchQuery] = useState('')

    const [perPage, setPerPage] = useState(10)

    const [overlay, setOverlay] = useState({
        show: false,
        type: 'success'
    })

    const [topAlert, setTopAlert] = useState({
        show: false,
        type: 'success',
        message: ''
    })

    const [showCreateModal, setShowCreateModal] = useState(false)

    const [saving, setSaving] = useState(false)

    const abrirCreateModal = () => {

        setShowCreateModal(true)
    }

    const cerrarCreateModal = () => {

        setShowCreateModal(false)
    }

    const createBautizo = async (formData) => {

    try {

        setSaving(true)

        setOverlay({
            show: true,
            type: 'loading'
        })

        await bautizoService.create(formData)

        await cargarBautizos()

        cerrarCreateModal()

        setOverlay({
            show: true,
            type: 'success'
        })

    } catch (error) {

        console.error(error)

        setOverlay({
            show: true,
            type: 'error'
        })

    } finally {

        setSaving(false)

        setTimeout(() => {

            setOverlay({
                show: false,
                type: 'success'
            })

        }, 1500)
    }
}
const [showEditModal, setShowEditModal] =
    useState(false)

const [editingBautizo, setEditingBautizo] =
    useState(null)
    
    const openEdit = (bautizo) => {

    setEditingBautizo(bautizo)

    setShowEditModal(true)
}

const closeEdit = () => {

    setEditingBautizo(null)

    setShowEditModal(false)
}

const updateBautizo = async (formData) => {

    try {

        setSaving(true)

        setOverlay({
            show: true,
            type: 'loading'
        })

        await bautizoService.update(

            editingBautizo.id_sac,
            formData

        )

        await cargarBautizos()

        closeEdit()

        setOverlay({
            show: true,
            type: 'success'
        })

    } catch (error) {

        console.error(error)

        setOverlay({
            show: true,
            type: 'error'
        })

    } finally {

        setSaving(false)

        setTimeout(() => {

            setOverlay({
                show: false,
                type: 'success'
            })

        }, 1500)
    }
}

    // =========================
    // CARGAR
    // =========================

    const cargarBautizos = async () => {

        try {

            setLoading(true)

            // =========================
            // BAUTIZOS
            // =========================

            const bautizosData =
                await bautizoService.getAll()

            setBautizos(bautizosData)

            // =========================
            // CENTROS
            // =========================

            setCentros([
    {
                    id_cen: 1,
                    nom_cen: 'Centro Principal'
                }
            ])

            // =========================
            // USUARIOS
            // =========================

            try {

                const usuariosResponse =
                    await bautizoService.getUsuarios()

                setUsuarios(usuariosResponse)

            } catch (error) {

                console.log(
                    'Usuarios no disponibles'
                )
            }

        } catch (error) {

            console.error(error)

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {

        cargarBautizos()

    }, [])

    // =========================
    // MODAL
    // =========================

    const abrirModal = () => {

        setShowModal(true)
    }

    const cerrarModal = () => {

        setShowModal(false)
    }

    const [centros, setCentros] = useState([])

    const [usuarios, setUsuarios] = useState([])

    // =========================
    // VER
    // =========================

    const openView = (bautizo) => {

        setSelectedBautizo(bautizo)

        setShowModal(true)
    }

    // =========================
    // CAMBIAR ESTADO
    // =========================

    const toggleStatus = async (bautizo) => {

        try {

            const nuevoEstado =

                bautizo.estado_sac === 'ACTIVO'
                    ? 'ANULADO'
                    : 'ACTIVO'

            setOverlay({
                show: true,
                type: 'loading'
            })

            await bautizoService.changeStatus(
                bautizo.id_sac,
                nuevoEstado
            )

            await cargarBautizos()

            setOverlay({
                show: true,
                type: 'success'
            })

            setTimeout(() => {

                setOverlay({
                    show: false,
                    type: 'success'
                })

            }, 1500)

        } catch (error) {

            console.error(error)

            setOverlay({
                show: true,
                type: 'error'
            })
        }
    }

    return {

        bautizos,
        loading,

        showModal,
        abrirModal,
        cerrarModal,

        overlay,
        topAlert,

        searchQuery,
        setSearchQuery,

        perPage,
        setPerPage,

        toggleStatus,

        openView,
        selectedBautizo,

        showCreateModal,
        abrirCreateModal,
        cerrarCreateModal,

        createBautizo,

        saving,

        showEditModal,
    editingBautizo,

        centros,
        usuarios,

        openEdit,
        closeEdit,

        updateBautizo,
    }
}