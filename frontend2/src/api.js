import axios from 'axios';

// La URL de tu servidor Django
const API_URL = 'http://127.0.0.1:8000/api/';

export const getSaludo = async () => {
    try {
        const response = await axios.get(`${API_URL}saludo/`);
        return response.data;
    } catch (error) {
        console.error("Error conectando con Django:", error);
        return { mensaje: "Error de conexión" };
    }
};