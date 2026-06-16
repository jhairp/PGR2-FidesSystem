import api from '../../../api/axios'

/**
 * Servicio para el módulo de Documentos.
 * Todas las peticiones van a /api/documentos/
 */
const documentoService = {

    /** Lista todos los documentos. Si se pasa sacId, filtra por sacramento. */
    async getAll(sacId = null) {
        const params = sacId ? { sac: sacId } : {}
        const res = await api.get('/documentos/', { params })
        return res.data
    },

    /**
     * Sube un documento.
     * @param {FormData} formData  — debe incluir: archivo, nom_doc, tipo_doc, desc_doc?, id_sac_5?
     */
    async upload(formData) {
        const res = await api.post('/documentos/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data
    },

    /** Obtiene el detalle de un documento por id. */
    async getById(id) {
        const res = await api.get(`/documentos/${id}/`)
        return res.data
    },

    /** Cambia el estado de un documento. */
    async changeStatus(id, estado, observacion = '') {
        const res = await api.patch(`/documentos/${id}/estado/`, {
            estado_doc: estado,
            observacion_doc: observacion,
        })
        return res.data
    },

    /** Elimina un documento y su archivo en disco. */
    async delete(id) {
        const res = await api.delete(`/documentos/${id}/`)
        return res.data
    },

    /** Devuelve la URL pública de descarga de un documento. */
    getFileUrl(urlDoc) {
        return `http://127.0.0.1:8000${urlDoc}`
    },
}

export default documentoService
