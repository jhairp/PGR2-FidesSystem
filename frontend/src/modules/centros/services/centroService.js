import api
from "../../../api/axios";

const endpoint = "/centros/";

const centroService = {

    getAll: async () => {

        const response =
            await api.get(endpoint);

        return response.data;
    },

    getById: async (id) => {

        const response =
            await api.get(
                `${endpoint}${id}/`
            );

        return response.data;
    },

    create: async (data) => {

        const response =
            await api.post(
                endpoint,
                data
            );

        return response.data;
    },

    update: async (id, data) => {

        const response =
            await api.put(
                `${endpoint}${id}/`,
                data
            );

        return response.data;
    },

    toggleStatus: async (id) => {

        const response =
            await api.patch(
                `${endpoint}${id}/cambiar-estado/`
            );

        return response.data;
    },
};

export default centroService;