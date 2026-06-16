import { useState, useEffect, useCallback } from 'react'
import documentoService from '../services/documentoService'

/**
 * Hook centralizado para el módulo de Documentos.
 * Maneja carga, subida, cambio de estado y eliminación.
 */
export function useDocumentos() {
    const [documentos, setDocumentos] = useState([])
    const [loading, setLoading]       = useState(false)
    const [uploading, setUploading]   = useState(false)
    const [error, setError]           = useState(null)
    const [success, setSuccess]       = useState(null)

    // Filtro por sacramento (null = todos)
    const [sacFiltro, setSacFiltro]   = useState(null)

    const clearMessages = () => {
        setError(null)
        setSuccess(null)
    }

    // ── Cargar listado ──────────────────────────────────────────────────
    const fetchDocumentos = useCallback(async (sacId = sacFiltro) => {
        setLoading(true)
        clearMessages()
        try {
            const data = await documentoService.getAll(sacId)
            setDocumentos(data)
        } catch (err) {
            setError(err?.response?.data?.detail || 'Error al cargar documentos')
        } finally {
            setLoading(false)
        }
    }, [sacFiltro])

    useEffect(() => {
        fetchDocumentos()
    }, [fetchDocumentos])

    // ── Subir ───────────────────────────────────────────────────────────
    const subirDocumento = async (formData) => {
        setUploading(true)
        clearMessages()
        try {
            const res = await documentoService.upload(formData)
            setSuccess(`Documento subido correctamente. Código: ${res.codigo}`)
            await fetchDocumentos()
            return res
        } catch (err) {
            const msg = err?.response?.data
            if (typeof msg === 'object') {
                // Muestra el primer error de validación
                const primer = Object.values(msg)[0]
                setError(Array.isArray(primer) ? primer[0] : String(primer))
            } else {
                setError('Error al subir el documento')
            }
            throw err
        } finally {
            setUploading(false)
        }
    }

    // ── Cambiar estado ──────────────────────────────────────────────────
    const cambiarEstado = async (id, estado, observacion = '') => {
        clearMessages()
        try {
            await documentoService.changeStatus(id, estado, observacion)
            setSuccess('Estado actualizado correctamente')
            await fetchDocumentos()
        } catch {
            setError('Error al cambiar el estado')
        }
    }

    // ── Eliminar ────────────────────────────────────────────────────────
    const eliminarDocumento = async (id) => {
        clearMessages()
        try {
            await documentoService.delete(id)
            setSuccess('Documento eliminado')
            setDocumentos(prev => prev.filter(d => d.id_doc !== id))
        } catch {
            setError('Error al eliminar el documento')
        }
    }

    return {
        documentos,
        loading,
        uploading,
        error,
        success,
        sacFiltro,
        setSacFiltro,
        fetchDocumentos,
        subirDocumento,
        cambiarEstado,
        eliminarDocumento,
        clearMessages,
    }
}
