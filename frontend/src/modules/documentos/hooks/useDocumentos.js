import { useEffect, useState } from 'react'
import documentoService from '../services/documentoService'

export default function useDocumentos() {

    // ── Datos ───────────────────────────────────────────────────────────────
    const [documentos,   setDocumentos]   = useState([])
    const [sacramentos,  setSacramentos]  = useState([])
    const [loading,      setLoading]      = useState(true)
    const [saving,       setSaving]       = useState(false)

    // ── Búsqueda / paginación ───────────────────────────────────────────────
    const [searchQuery,  setSearchQuery]  = useState('')
    const [perPage,      setPerPage]      = useState(10)

    // ── Overlay y alerta (igual que bautizos) ───────────────────────────────
    const [overlay, setOverlay] = useState({ show: false, type: 'creado' })
    const [topAlert, setTopAlert] = useState({ show: false, type: 'creado', message: '' })

    const showOverlay = (type) => setOverlay({ show: true, type })
    const hideOverlay = () => setTimeout(() => setOverlay({ show: false, type: 'creado' }), 1500)
    const showTopAlert = (type, message) => {
        setTopAlert({ show: true, type, message })
        setTimeout(() => setTopAlert({ show: false, type, message: '' }), 3000)
    }

    // ── Modales ─────────────────────────────────────────────────────────────
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal,   setShowEditModal]   = useState(false)
    const [showViewModal,   setShowViewModal]   = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showEstadoModal, setShowEstadoModal] = useState(false)

    const [editingDoc,    setEditingDoc]    = useState(null)
    const [viewingDoc,    setViewingDoc]    = useState(null)
    const [deletingDocId, setDeletingDocId] = useState(null)
    const [estadoDoc,     setEstadoDoc]     = useState(null)

    // ── Abrir / cerrar ──────────────────────────────────────────────────────
    const abrirCreateModal = () => setShowCreateModal(true)
    const cerrarCreateModal = () => setShowCreateModal(false)

    const openEdit = (doc) => { setEditingDoc(doc); setShowEditModal(true) }
    const closeEdit = () => { setEditingDoc(null); setShowEditModal(false) }

    const openView = (doc) => { setViewingDoc(doc); setShowViewModal(true) }
    const cerrarView = () => { setViewingDoc(null); setShowViewModal(false) }

    const confirmarEliminar = (id) => { setDeletingDocId(id); setShowDeleteConfirm(true) }
    const cerrarConfirmar = () => { setDeletingDocId(null); setShowDeleteConfirm(false) }

    const openEstado = (doc) => { setEstadoDoc(doc); setShowEstadoModal(true) }
    const closeEstado = () => { setEstadoDoc(null); setShowEstadoModal(false) }

    // ── Carga inicial ───────────────────────────────────────────────────────
    const cargarDatos = async () => {
        try {
            setLoading(true)
            const docs = await documentoService.getAll()
            setDocumentos(docs)
            try {
                const sacs = await documentoService.getSacramentos()
                setSacramentos(Array.isArray(sacs) ? sacs : [])
            } catch {
                setSacramentos([])
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { cargarDatos() }, [])

    // ── Crear ───────────────────────────────────────────────────────────────
    const createDocumento = async (formData) => {
        try {
            setSaving(true)
            showOverlay('creado')
            await documentoService.upload(formData)
            await cargarDatos()
            cerrarCreateModal()
            showTopAlert('creado', 'Documento subido correctamente')
        } catch (err) {
            console.error(err)
            showOverlay('error')
            showTopAlert('error', 'Error al subir el documento')
        } finally {
            setSaving(false)
            hideOverlay()
        }
    }

    // ── Editar ──────────────────────────────────────────────────────────────
    const updateDocumento = async (formData) => {
        try {
            setSaving(true)
            showOverlay('editado')
            await documentoService.update(editingDoc.id_doc, formData)
            await cargarDatos()
            closeEdit()
            showTopAlert('editado', 'Documento actualizado')
        } catch (err) {
            console.error(err)
            showOverlay('error')
            showTopAlert('error', 'Error al editar el documento')
        } finally {
            setSaving(false)
            hideOverlay()
        }
    }

    // ── Cambiar estado ──────────────────────────────────────────────────────
    const cambiarEstado = async (doc, nuevoEstado, observacion = '') => {
        try {
            showOverlay(nuevoEstado === 'aprobado' ? 'activo' : nuevoEstado === 'rechazado' ? 'error' : 'editado')
            await documentoService.changeStatus(doc.id_doc, nuevoEstado, observacion)
            await cargarDatos()
            closeEstado()
            showTopAlert('editado', `Estado cambiado a: ${nuevoEstado}`)
        } catch (err) {
            console.error(err)
            showTopAlert('error', 'Error al cambiar el estado')
        } finally {
            hideOverlay()
        }
    }

    // ── Eliminar ────────────────────────────────────────────────────────────
    const eliminarDocumento = async () => {
        try {
            showOverlay('eliminado')
            await documentoService.delete(deletingDocId)
            await cargarDatos()
            cerrarConfirmar()
            showTopAlert('warning', 'Documento eliminado')
        } catch (err) {
            console.error(err)
            showTopAlert('error', 'Error al eliminar')
        } finally {
            hideOverlay()
        }
    }

    // ── Filtro local ────────────────────────────────────────────────────────
    const documentosFiltrados = documentos
        .filter(d => {
            const q = searchQuery.toLowerCase()
            return (
                d.nom_doc?.toLowerCase().includes(q) ||
                d.tipo_doc?.toLowerCase().includes(q) ||
                (d.codigo_doc ?? '').toLowerCase().includes(q) ||
                (d.sacramento_tipo ?? '').toLowerCase().includes(q)
            )
        })
        .slice(0, perPage)

    return {
        // datos
        documentos: documentosFiltrados,
        sacramentos,
        loading,
        saving,
        // búsqueda
        searchQuery, setSearchQuery,
        perPage, setPerPage,
        // feedback
        overlay, topAlert,
        // modales
        showCreateModal, abrirCreateModal, cerrarCreateModal,
        showEditModal, editingDoc, openEdit, closeEdit,
        showViewModal, viewingDoc, openView, cerrarView,
        showDeleteConfirm, confirmarEliminar, cerrarConfirmar,
        showEstadoModal, estadoDoc, openEstado, closeEstado,
        // acciones
        createDocumento, updateDocumento, cambiarEstado, eliminarDocumento,
    }
}
