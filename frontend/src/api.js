// src/api.js
import axios from 'axios';

// La URL de tu servidor Django (asegúrate de que Django esté corriendo en el puerto 8000)
const API_URL = 'http://127.0.0.1:8000/api/';

const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSaludo = async () => {
    try {
        const response = await apiService.get('saludo/');
        return response.data;
    } catch (error) {
        console.error("Error conectando con Django:", error);
        return { mensaje: "Error de conexión con el backend" };
    }
};

export const getCapillas = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/capillas/');
        return response.data;
    } catch (error) {
        console.error("Error cargando capillas:", error);
        return [];
    }
};

export default apiService;