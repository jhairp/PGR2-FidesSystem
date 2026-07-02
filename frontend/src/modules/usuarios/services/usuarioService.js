import api from '../../../api/axios'

export const obtenerUsuarios = async () => {
    const response = await api.get('/usuarios/')
    return response.data
}

export const crearUsuario = async (data) => {
    const response = await api.post('/usuarios/crear/', data)
    return response.data
}

export const actualizarUsuario = async (id, data) => {
    const response = await api.patch(`/usuarios/${id}/`, data)
    return response.data
}

export const cambiarEstadoUsuario = async (id) => {
    const response = await api.patch(`/usuarios/${id}/estado/`)
    return response.data
}