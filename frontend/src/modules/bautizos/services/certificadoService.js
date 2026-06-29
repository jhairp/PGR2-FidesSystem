import api from '../../../api/axios'

const API_ORIGIN = 'http://127.0.0.1:8000'

const certificadoService = {

    async getTemplate() {
        const res = await api.get('/bautizos/certificado/template/')
        return res.data
    },

    async saveTemplate(template) {
        const res = await api.put('/bautizos/certificado/template/', template)
        return res.data
    },

    async uploadImage(file) {
        const formData = new FormData()
        formData.append('image', file)

        const res = await api.post('/bautizos/certificado/assets/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })

        return res.data
    },

    getAssetUrl(url) {
        if (!url) return ''
        if (url.startsWith('http')) return url
        return `${API_ORIGIN}${url}`
    },
}

export default certificadoService
