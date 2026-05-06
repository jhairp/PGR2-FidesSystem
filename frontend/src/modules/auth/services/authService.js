import api from '@/api/axios'

export const loginRequest = async (
    data
) => {

    const response = await api.post(
        '/login/',
        {
            correo_usu: data.correo_usu,
            password: data.password,
        }
    )

    return response.data
}

export const googleLoginRequest =
    async (token) => {

        const response =
            await api.post(
                '/auth/google/',
                {
                    token,
                }
            )

        return response.data
    }

export const registerRequest =
    async (data) => {

        const response =
            await api.post(
                '/register/',
                data
            )

        return response.data
    }