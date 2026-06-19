import api from '../../../api/axios'

const documentoService = {

    async getAll(sacId = null) {
        const params = sacId ? { sac: sacId } : {}
        const res = await api.get('/documentos/', { params })
        return res.data
    },

    async upload(formData) {
        const res = await api.post('/documentos/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data
    },

    async update(id, formData) {
        const res = await api.put(`/documentos/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data
    },

    async getById(id) {
        const res = await api.get(`/documentos/${id}/`)
        return res.data
    },

    async changeStatus(id, estado, observacion = '') {
        const res = await api.patch(`/documentos/${id}/estado/`, {
            estado_doc: estado,
            observacion_doc: observacion,
        })
        return res.data
    },

    async delete(id) {
        await api.delete(`/documentos/${id}/`)
    },

    // Trae todos los sacramentos para el selector
    async getSacramentos() {
        const res = await api.get('/sacramentos/')
        return res.data
    },

    getFileUrl(urlDoc) {
        return `http://127.0.0.1:8000${urlDoc}`
    },

    getPreviewUrl(id) {
        return `http://127.0.0.1:8000/api/documentos/${id}/archivo/`
    },
}

export default documentoService
