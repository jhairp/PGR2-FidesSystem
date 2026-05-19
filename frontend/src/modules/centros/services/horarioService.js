import api from "../../../api/axios";

const endpoint = "/horarios/";

const horarioService = {

    getByCentro: async (
        centroId
    ) => {

        const response =
            await api.get(
                `${endpoint}?id_cen_4=${centroId}`
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

    update: async (
        id,
        data
    ) => {

        const response =
            await api.put(
                `${endpoint}${id}/`,
                data
            );

        return response.data;
    },

    remove: async (id) => {

        const response =
            await api.delete(
                `${endpoint}${id}/`
            );

        return response.data;
    },

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

    saveSchedule: async (data) => {

        const response =
            await api.post(
                "/horarios/guardar-horarios/",
                data
            );

        return response.data;
    },
};

export default horarioService;