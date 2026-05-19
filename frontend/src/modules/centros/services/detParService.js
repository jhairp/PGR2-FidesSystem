import api from "../../../api/axios";

const endpoint = "/det-pars/";

const detParService = {

    getByCentro: async (centroId) => {

        const response =
            await api.get(
                `${endpoint}centro/${centroId}/`
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

    delete: async (id) => {

        const response =
            await api.delete(
                `${endpoint}${id}/`
            );

        return response.data;
    },
};

export default detParService;