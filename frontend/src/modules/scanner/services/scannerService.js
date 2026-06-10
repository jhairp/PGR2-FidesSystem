import axios from '../../../api/axios'

const scannerService = {

    async detectar(imagen) {

        console.log("Enviando imagen al backend")

        const formData = new FormData()

        formData.append(
            'imagen',
            imagen
        )

        const response = await axios.post(
            '/scanner/detectar/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        console.log("Respuesta backend:")
        console.log(response)

        return response.data
    }
}

export default scannerService