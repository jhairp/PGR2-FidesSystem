import api from "../../../api/axios";

const endpoint = "/eventos/";

const eventoService = {

    create: async (data) => {

        const response =
            await api.post(
                endpoint,
                data
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

    getByCentro: async (
        centroId
    ) => {

        const response =
            await api.get(

                `${endpoint}?id_cen_3=${centroId}`
            );

        return response.data;
    },
};

export default eventoService;