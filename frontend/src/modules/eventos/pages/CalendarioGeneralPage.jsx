import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import horarioService from '@/modules/centros/services/horarioService';
import eventoService from '@/modules/eventos/services/eventoService';
import centroService from '@/modules/centros/services/centroService';

export default function CalendarioGeneralPage() {

    const navigate = useNavigate();

    const [centros, setCentros] = useState([]);

    const [selectedCentro, setSelectedCentro] = useState('');

    const [businessHours, setBusinessHours] = useState([]);

    const [blockedHours, setBlockedHours] = useState([]);

    const [calendarEvents, setCalendarEvents] = useState([]);

    const [hasSchedules, setHasSchedules] = useState(false);

    // =========================================
    // CARGAR CENTROS
    // =========================================

    useEffect(() => {

        loadCentros();

    }, []);

    const loadCentros = async () => {

        try {

            const response = await centroService.getAll();

            setCentros(response);

            // seleccionar el primero automáticamente
            if (response.length > 0) {

                setSelectedCentro(response[0].id_cen);
            }

        } catch (error) {

            console.log(error);
        }
    };

    // =========================================
    // CUANDO CAMBIA EL CENTRO
    // =========================================

    useEffect(() => {

        if (selectedCentro) {

            loadHorarios(selectedCentro);

            loadEventos(selectedCentro);
        }

    }, [selectedCentro]);

    const loadHorarios = async (idCentro) => {

        try {

            const response =
                await horarioService.getByCentro(idCentro);

            transformEvents(response);

        } catch (error) {

            console.log(error);
        }
    };

    const loadEventos = async (idCentro) => {

        try {

            const response =
                await eventoService.getByCentro(idCentro);

            transformCalendarEvents(response);

        } catch (error) {

            console.log(error);
        }
    };

    // =========================================
    // TRANSFORMAR HORARIOS
    // =========================================

    const transformEvents = (horariosData) => {

        const diasMap = {

            domingo: 0,
            lunes: 1,
            martes: 2,
            miercoles: 3,
            jueves: 4,
            viernes: 5,
            sabado: 6,
        };

        const business = [];

        const blocked = [];

        let hasAnySchedule = false;

        horariosData.forEach((horario) => {

            const dayNumber =
                diasMap[
                    horario.dia_sem_hor?.toLowerCase()
                ];

            business.push({

                daysOfWeek: [dayNumber],

                startTime: horario.hora_ini_hor,

                endTime: horario.hora_fin_hor,
            });

            hasAnySchedule = true;

            horario.horarios_indisponibles?.forEach((ind) => {

                blocked.push({

                    daysOfWeek: [dayNumber],

                    startTime: ind.hora_ini_ind,

                    endTime: ind.hora_fin_ind,

                    display: 'background',

                    overlap: false,

                    classNames: ['blocked-slot'],
                });
            });
        });

        setBusinessHours(business);

        setBlockedHours(blocked);

        setHasSchedules(hasAnySchedule);
    };

    // =========================================
    // EVENTOS
    // =========================================

    const transformCalendarEvents = (eventosData) => {

        const transformed = eventosData

            .filter(
                (evento) =>
                    evento.estado_eve !== 'cancelado'
            )

            .map((evento) => {

                let color = '#eab308';

                if (evento.estado_eve === 'aprobado') {

                    color = '#2563eb';
                }

                return {

                    id: evento.id_eve,

                    title: evento.tipo_eve,

                    start:
                        `${evento.fecha_eve}T${evento.hora_eve}`,

                    end:
                        `${evento.fecha_eve}T${evento.hora_eve}`,

                    backgroundColor: color,

                    borderColor: color,

                    textColor: '#ffffff',
                };
            });

        setCalendarEvents(transformed);
    };

    // =========================================
    // RESERVA
    // =========================================

    const handleSelect = (info) => {

        const fecha =
            info.startStr.split('T')[0];

        const hora =
            info.startStr
                .split('T')[1]
                ?.substring(0, 5);

        navigate('/evento', {

            state: {

                fecha_eve: fecha,

                hora_eve: hora,

                id_cen_3: selectedCentro,
            }
        });
    };

    return (

        <div className="
            min-h-screen
            bg-slate-100
            dark:bg-[#020817]
            p-3
            md:p-6
            lg:p-10
        ">

            {/* HEADER */}

            <div className="
                flex
                flex-col
                gap-4
                mb-6
            ">

                <div>

                    <h1 className="
                        text-4xl
                        font-black
                        text-slate-800
                        dark:text-white
                    ">
                        Calendario General
                    </h1>

                    <p className="
                        text-slate-500
                        dark:text-slate-400
                    ">
                        Visualiza eventos de cualquier centro
                    </p>

                </div>

                {/* SELECT CENTROS */}

                <select

                    value={selectedCentro}

                    onChange={(e) =>
                        setSelectedCentro(e.target.value)
                    }

                    className="
                        w-full
                        md:w-[400px]

                        rounded-2xl

                        border
                        border-slate-300
                        dark:border-slate-700

                        bg-white
                        dark:bg-slate-900

                        px-4
                        py-3

                        text-slate-700
                        dark:text-white

                        shadow-lg
                        outline-none
                    "
                >

                    {centros.map((centro) => (

                        <option

                            key={centro.id_cen}

                            value={centro.id_cen}
                        >
                            {centro.nom_cen}
                        </option>
                    ))}

                </select>

            </div>

            {/* CALENDARIO */}

            <div className="
                bg-white
                dark:bg-[#081028]
                rounded-[32px]
                shadow-2xl
                p-3
                md:p-6
                border
                border-slate-200
                dark:border-slate-800
            ">

                <FullCalendar

                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin
                    ]}

                    initialView="dayGridMonth"

                    locale="es"

                    selectable={true}

                    select={handleSelect}

                    businessHours={businessHours}

                    events={[
                        ...blockedHours,
                        ...calendarEvents
                    ]}

                    slotMinTime="06:00:00"

                    slotMaxTime="22:00:00"

                    allDaySlot={false}

                    headerToolbar={{

                        left: 'prev,next today',

                        center: 'title',

                        right:
                            'dayGridMonth,timeGridWeek,timeGridDay'
                    }}

                    buttonText={{

                        today: 'Hoy',

                        month: 'Mes',

                        week: 'Semana',

                        day: 'Día',
                    }}
                />

            </div>

        </div>
    );
}