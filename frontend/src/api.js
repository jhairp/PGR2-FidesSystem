// src/api.js
import axios from 'axios';

// La URL de tu servidor Django (asegúrate de que Django esté corriendo en el puerto 8000)
const API_URL = 'http://127.0.0.1:8000/api';

const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCentros = async () => {
    const response = await fetch(`${API_URL}/centros/`); // Asegúrate que esta sea tu ruta en Django
    if (!response.ok) throw new Error("Error al obtener centros");
    return await response.json();
};

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

export const getCentroById = async (id) => {
    const res = await fetch(`${API_URL}/centros/${id}/`);
    return await res.json();
};

export const saveCentro = async (data) => {
    const res = await fetch(`${API_URL}/centros/`, { // <-- Nota la /
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
};

export const updateCentro = async (id, data) => {
    const res = await fetch(`${API_URL}/centros/${id}/`, { // <-- Nota la /
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
};

export const getParroquias = async () => {
    try {
        const response = await fetch(`${API_URL}/parroquias`);
        
        // Si el servidor responde pero con error (404, 500, etc)
        if (!response.ok) {
            const errorText = await response.text(); // Leemos el error de Django
            console.error("Error del servidor Django:", errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Datos de parroquias recibidos:", data); // Verificamos el formato
        return data;
    } catch (error) {
        console.error("Fallo total en getParroquias:", error);
        throw error;
    }
};

export const getEventos = async () => {
    const response = await fetch(`${API_URL}/eventos/`); // Ajusta según tu urls.py
    if (!response.ok) throw new Error("Error al obtener eventos");
    return await response.json();
};

export const saveEvento = async (data) => {
    try {
        const res = await fetch(`${API_URL}/eventos/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const errorData = await res.json();
            console.error("Error de Django:", errorData);
            throw errorData;
        }
        return await res.json();
    } catch (error) {
        console.error("Error en saveEvento:", error);
        throw error;
    }
};

export const updateEvento = async (id, data) => {
    try {
        const res = await fetch(`${API_URL}/eventos/${id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const errorData = await res.json();
            console.error("Error de Django:", errorData);
            throw errorData;
        }
        return await res.json();
    } catch (error) {
        console.error("Error en updateEvento:", error);
        throw error;
    }
};

export const getEventosById = (id) => 
    fetch(`${API_URL}/eventos/${id}/`).then(res => res.json());

export default apiService;