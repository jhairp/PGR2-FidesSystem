import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UsuariosList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            // Asegúrate de que esta URL sea la de tu Django
            const response = await axios.get('http://localhost:8000/api/lista-usuarios/');
            setUsuarios(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setLoading(false);
        }
    };

    const toggleEstado = async (id) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/usuarios/${id}/cambiar-estado/`);
            setUsuarios(usuarios.map(u => 
                u.id_usu === id ? { ...u, estado_usu: response.data.nuevo_estado } : u
            ));
        } catch (error) {
            alert("No se pudo cambiar el estado");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blueGray-700"></div>
        </div>
    );

    return (
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
                    {/* Header de la Tabla */}
                    <div className="rounded-t mb-0 px-4 py-3 border-0">
                        <div className="flex flex-wrap items-center">
                            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                <h3 className="font-semibold text-lg text-blueGray-700">
                                    Personal Registrado
                                </h3>
                            </div>
                            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                                <Link
                                    to="/admin/usuarios/nuevo"
                                    className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                >
                                    Registrar Trabajador
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="block w-full overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                                        Nombre Completo
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                                        Correo
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                                        Cargo/Rol
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                                        Estado
                                    </th>
                                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blueGray-100">
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id_usu}>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-blueGray-600">
                                                    {usuario.persona?.nom_per} {usuario.persona?.ap_pat_per}
                                                </span>
                                                <span className="text-blueGray-400">
                                                    C.I.: {usuario.persona?.carnet_per}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {usuario.correo_usu}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            {usuario.nombre_rol || 'N/A'}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            <button
                                                onClick={() => toggleEstado(usuario.id_usu)}
                                                className={`text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150 ${
                                                    usuario.estado_usu === 'activo' 
                                                    ? 'bg-emerald-100 text-emerald-600' 
                                                    : 'bg-red-100 text-red-600'
                                                }`}
                                            >
                                                {usuario.estado_usu}
                                            </button>
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                            <Link to={`/admin/usuarios/editar/${usuario.id_usu}`}>
                                                <i className="fas fa-edit text-blueGray-400 hover:text-lightBlue-500 text-base"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsuariosList;