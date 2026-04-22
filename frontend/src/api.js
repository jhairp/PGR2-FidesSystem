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
    // ASEGÚRATE de que esta URL sea la que definiste en urls.py de Django
    const response = await fetch('http://localhost:8000/api/centros/'); 
    return await response.json();
};

// Agrega estas funciones a tu api.js
export const getCentros = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/centros/'); // Cambia por tu URL real
        if (!response.ok) throw new Error('Error al obtener centros');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getParroquias = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/parroquias/'); // Cambia por tu URL real
        if (!response.ok) throw new Error('Error al obtener parroquias');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export default apiService;