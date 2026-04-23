import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { getCentros, getEventosById, saveEvento, updateEvento } from "api.js"; // Asegúrate de tener estas funciones en api.js

export default function EventosForm() {
  const { id } = useParams();
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const fechaQuery = query.get("fecha");

  const [centros, setCentros] = useState([]);
  const [formData, setFormData] = useState({
    tipo_eve: "",
    fecha_eve: fechaQuery || "",
    hora_eve: "08:00",
    estado_eve: "activo",
    detalle_eve: "",
    id_cen_3: "",
    id_com_1: null, // Como pediste, nulo por defecto
  });

  useEffect(() => {
    // Cargar centros para el select
    getCentros().then(setCentros);

    if (id) {
      getEventosById(id).then((data) => setFormData(data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateEvento(id, formData);
      } else {
        await saveEvento(formData);
      }
      history.push("/admin/calendario");
    } catch (error) {
      alert("Error al guardar el evento");
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">
            {id ? "Editar Evento" : "Nuevo Evento"}
          </h6>
          <button
            className="bg-blueGray-700 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            onClick={() => history.push("/admin/calendario")}
          >
            Volver
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Información del Evento
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Tipo de Evento
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                value={formData.tipo_eve}
                onChange={(e) => setFormData({...formData, tipo_eve: e.target.value})}
                required
              />
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Centro Parroquial
              </label>
              <select
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                value={formData.id_cen_3}
                onChange={(e) => setFormData({...formData, id_cen_3: e.target.value})}
                required
              >
                <option value="">Seleccione un centro</option>
                {centros.map((c) => (
                  <option key={c.id_cen} value={c.id_cen}>{c.nom_cen}</option>
                ))}
              </select>
            </div>
            <div className="w-full lg:w-4/12 px-4 mt-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Fecha
              </label>
              <input
                type="date"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                value={formData.fecha_eve}
                onChange={(e) => setFormData({...formData, fecha_eve: e.target.value})}
                required
              />
            </div>
            <div className="w-full lg:w-4/12 px-4 mt-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Hora
              </label>
              <input
                type="time"
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                value={formData.hora_eve}
                onChange={(e) => setFormData({...formData, hora_eve: e.target.value})}
                required
              />
            </div>
            <div className="w-full lg:w-4/12 px-4 mt-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Estado
              </label>
              <select
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                value={formData.estado_eve}
                onChange={(e) => setFormData({...formData, estado_eve: e.target.value})}
              >
                <option value="activo">Activo</option>
                <option value="cancelado">Cancelado</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
            <div className="w-full px-4 mt-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                Detalles / Observaciones
              </label>
              <textarea
                className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                rows="4"
                value={formData.detalle_eve}
                onChange={(e) => setFormData({...formData, detalle_eve: e.target.value})}
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mt-6 ml-4"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}