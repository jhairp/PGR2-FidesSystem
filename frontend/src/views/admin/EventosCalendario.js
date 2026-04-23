import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { getEventos } from "api.js";

const EventosCalendario = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      setLoading(true);
      const data = await getEventos();
      
      // Validación: Si data no es un array, evitar error de .map
      if (!Array.isArray(data)) {
        console.error("Los datos recibidos no son un array:", data);
        return;
      }

      const eventosFormateados = data.map((e) => ({
        id: String(e.id_eve), // FullCalendar prefiere IDs como strings
        title: `${e.tipo_eve || "Evento"}`,
        // Aseguramos formato ISO8601. Si hora_eve viene como "08:00", lo acepta bien.
        start: `${e.fecha_eve}T${e.hora_eve}`, 
        extendedProps: {
          centro: e.nombre_centro || "Sin centro",
          estado: e.estado_eve,
          detalle: e.detalle_eve
        },
        // Colores consistentes con Tailwind
        backgroundColor: e.estado_eve === 'activo' ? '#0284c7' : '#e11d48', 
        borderColor: 'transparent',
      }));

      setEventos(eventosFormateados);
    } catch (error) {
      console.error("Error cargando eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info) => {
    // Redirigir usando el ID del evento
    history.push(`/admin/eventos/editar/${info.event.id}`);
  };

  const handleDateClick = (arg) => {
    // Redirigir a nuevo pasando la fecha seleccionada
    history.push(`/admin/eventos/nuevo?fecha=${arg.dateStr}`);
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white border-0">
        <div className="rounded-t mb-0 px-6 py-6 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-xl text-blueGray-700">
                <i className="fas fa-calendar-alt mr-2 text-blueGray-400"></i>
                Agenda Parroquial
              </h3>
              <p className="text-sm text-blueGray-400 mt-1">
                Haz clic en una fecha para programar o en un evento para gestionar.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-auto p-4 md:p-6 bg-blueGray-50">
          {loading ? (
            <div className="text-center py-20">
              <i className="fas fa-circle-notch animate-spin text-4xl text-lightBlue-500"></i>
              <p className="mt-2 text-blueGray-500">Cargando agenda...</p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={eventos}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                
                height="auto" // Cambiado a auto para que se ajuste mejor al contenido
                minHeight="650px"
                selectable={true}
                dayMaxEvents={3} // Limita a 3 eventos por día antes de mostrar "+ más"
                
                // Estilización de botones para que parezcan de Tailwind/Notus
                buttonText={{
                  today: 'Hoy',
                  month: 'Mes',
                  week: 'Semana',
                  day: 'Día'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS adicionales para arreglar la estética de FullCalendar con Tailwind */}
      <style>{`
        .fc .fc-button-primary {
          background-color: #475569; /* blueGray-600 */
          border-color: transparent;
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .fc .fc-button-primary:hover {
          background-color: #334155;
        }
        .fc .fc-button-active {
          background-color: #0ea5e9 !important; /* lightBlue-500 */
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: #f1f5f9;
        }
        .fc-event {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default EventosCalendario;