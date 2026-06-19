import axios from '../../../api/axios'

const bautizoService = {

    async getAll() {

        const res = await axios.get('/bautizos/')

        return res.data
    },

    async create(data) {

        const res = await axios.post(
            '/bautizos/crear/',
            data
        )

        return res.data
    },

    async update(id, data) {

        const res = await axios.put(
            `/bautizos/${id}/`,
            data
        )

        return res.data
    },

    async changeStatus(id, estado) {

        const res = await axios.patch(
            `/bautizos/${id}/estado/`,
            {
                estado_sac: estado
            }
        )

        return res.data
    },

    async getCentros() {

        const res = await axios.get('/centros/')

        return res.data
    },

    async getUsuarios() {

        const res = await axios.get(
            '/usuarios/'
        )

        return res.data
    },

    getCertificateUrl(id) {

        return `http://127.0.0.1:8000/api/bautizos/${id}/certificado/`
    }

}



export default bautizoService
