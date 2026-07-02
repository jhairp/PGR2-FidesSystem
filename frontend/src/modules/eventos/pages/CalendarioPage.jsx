import FullCalendar
from '@fullcalendar/react';

import dayGridPlugin
from '@fullcalendar/daygrid';

import timeGridPlugin
from '@fullcalendar/timegrid';

import interactionPlugin
from '@fullcalendar/interaction';

import {
    useEffect,
    useState
} from 'react';

import {
    useParams
} from 'react-router-dom';

import {
    useNavigate
} from 'react-router-dom';

import horarioService from '@/modules/centros/services/horarioService';

import eventoService from '@/modules/eventos/services/eventoService';

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { puedeEditar } from '@/modules/auth/roles';

export default function CalendarioPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();
    const puedeCrear = puedeEditar(user, 'calendario'); // Fiel solo ve

    const [selectedDate,
    setSelectedDate] =
        useState(null);

    const [events,
    setEvents] =
        useState([]);

    const [businessHours,
    setBusinessHours] =
        useState([]);

    const [blockedHours,
    setBlockedHours] =
        useState([]);

    const [calendarEvents,
    setCalendarEvents] =
        useState([]);

    const [hasSchedules,
    setHasSchedules] =
        useState(false);

    const [horarios,
    setHorarios] =
        useState([]);

    useEffect(() => {

        loadHorarios();

        loadEventos();

    }, [id]);

    const loadHorarios =
    async () => {

        try {

            const response =
                await horarioService
                    .getByCentro(id);

            setHorarios(response);

            transformEvents(response);

        } catch (error) {

            console.log(error);
        }
    };

    const loadEventos =
    async () => {

        try {

            const response =
                await eventoService
                    .getByCentro(id);

            transformCalendarEvents(
                response
            );

        } catch (error) {

            console.log(error);
        }
    };

    const transformEvents =
    (horariosData) => {

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

        horariosData.forEach(

            (horario) => {

                const dayNumber =

                    diasMap[
                        horario.dia_sem_hor
                            ?.toLowerCase()
                    ];

                // =================================
                // HORARIOS DISPONIBLES
                // =================================

                business.push({

                    daysOfWeek: [
                        dayNumber
                    ],

                    startTime:
                        horario.hora_ini_hor,

                    endTime:
                        horario.hora_fin_hor,
                });

                hasAnySchedule = true;

                // =================================
                // HORARIOS INDISPONIBLES
                // =================================

                horario
                    .horarios_indisponibles
                    ?.forEach(

                    (ind) => {

                        blocked.push({

                            daysOfWeek: [
                                dayNumber
                            ],

                            startTime:
                                ind.hora_ini_ind,

                            endTime:
                                ind.hora_fin_ind,

                            display:
                                'background',

                            overlap: false,

                            classNames: ['blocked-slot'],

                        });
                    });
            }
        );

        setBusinessHours(business);

        setBlockedHours(blocked);

        setHasSchedules(hasAnySchedule);
    };

    const transformCalendarEvents =
    (eventosData) => {

        const transformed =
            eventosData

                // =================================
                // CANCELADOS NO APARECEN
                // =================================

                .filter(

                    (evento) =>

                        evento.estado_eve
                            !== 'cancelado'
                )

                .map(

                    (evento) => {

                        let color =
                            '#eab308';

                        // =================================
                        // APROBADO
                        // =================================

                        if (

                            evento.estado_eve
                            === 'aprobado'
                        ) {

                            color = '#2563eb';
                        }

                        // =================================
                        // PENDIENTE
                        // =================================

                        if (

                            evento.estado_eve
                            === 'pendiente'
                        ) {

                            color = '#eab308';
                        }

                        return {

                            id:
                                evento.id_eve,

                            title:
                                evento.tipo_eve,

                            start:
                                `${evento.fecha_eve}T${evento.hora_eve}`,

                            end:
                                `${evento.fecha_eve}T${evento.hora_eve}`,

                            backgroundColor:
                                color,

                            borderColor:
                                color,

                            textColor:
                                '#ffffff',

                            editable:
                                false,
                        };
                    }
                );

        setCalendarEvents(
            transformed
        );
    };

    const isInsideBusinessHours =
    (selectInfo) => {

        // ====================================
        // NO HAY HORARIOS
        // ====================================

        if (!hasSchedules) {

            return false;
        }

        const start =
            selectInfo.start;

        const day =
            start.getDay();

        const hours =
            start.getHours();

        const minutes =
            start.getMinutes();

        const currentTime =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        // ====================================
        // VALIDAR HORARIOS DISPONIBLES
        // ====================================

        const isBusinessHour =
            businessHours.some(

                (business) => {

                    return (

                        business.daysOfWeek.includes(day)

                        &&

                        currentTime >= business.startTime

                        &&

                        currentTime < business.endTime
                    );
                }
            );

        if (!isBusinessHour) {

            return false;
        }

        // ====================================
        // VALIDAR BLOQUEADOS
        // ====================================

        const isBlocked =
            blockedHours.some(

                (blocked) => {

                    return (

                        blocked.daysOfWeek.includes(day)

                        &&

                        currentTime >= blocked.startTime

                        &&

                        currentTime < blocked.endTime
                    );
                }
            );

        return !isBlocked;
    };

    // CLICK DÍA

    const handleSelect =
    (info) => {

        const fecha =
            info.startStr
                .split('T')[0];

        const hora =
            info.startStr
                .split('T')[1]
                ?.substring(0, 5);

        navigate(

            '/evento',

            {

                state: {

                    fecha_eve:
                        fecha,

                    hora_eve:
                        hora,

                    id_cen_3:
                        id,
                }
            }
        );
    };

    const handleDateClick =
        (info) => {

            setSelectedDate(
                info.dateStr
            );
        };

    return (

        <div className="
            min-h-screen
            bg-slate-100
            dark:bg-[#020817]
            p-3
            md:p-6
            lg:p-10
            transition-all
        ">

            {/* HEADER */}

            <div className="
                mb-6
                flex
                flex-col
                gap-4
                md:flex-row
                md:items-center
                md:justify-between
            ">

                <div>

                    <h1 className="
                        text-4xl
                        font-black
                        text-slate-800
                        dark:text-white
                    ">

                        Calendario

                    </h1>

                    <p className="
                        text-slate-500
                        dark:text-slate-400
                        font-medium
                    ">

                        Reserva de misas

                    </p>

                </div>

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

                    overflow-x-auto
                ">
                <div className="
                    overflow-hidden
                ">

                    <div className="

                        [&_.fc]:text-sm
                        md:[&_.fc]:text-base

                        /* ================================= */
                        /* TOOLBAR */
                        /* ================================= */

                        [&_.fc-toolbar]:flex
                        [&_.fc-toolbar]:flex-col
                        md:[&_.fc-toolbar]:flex-row

                        [&_.fc-toolbar]:gap-4
                        [&_.fc-toolbar]:items-start
                        md:[&_.fc-toolbar]:items-center

                        [&_.fc-toolbar-title]:text-2xl
                        md:[&_.fc-toolbar-title]:text-4xl

                        [&_.fc-toolbar-title]:font-black

                        [&_.fc-toolbar-title]:text-slate-800
                        dark:[&_.fc-toolbar-title]:text-white

                        /* ================================= */
                        /* BUTTONS */
                        /* ================================= */

                        [&_.fc-button]:rounded-2xl
                        [&_.fc-button]:border-0

                        [&_.fc-button]:shadow-xl

                        [&_.fc-button]:px-3
                        md:[&_.fc-button]:px-5

                        [&_.fc-button]:py-2

                        [&_.fc-button]:font-bold

                        [&_.fc-button]:transition-all

                        [&_.fc-button-primary]:bg-slate-800
                        [&_.fc-button-primary]:hover:bg-slate-700

                        dark:[&_.fc-button-primary]:bg-slate-700
                        dark:[&_.fc-button-primary]:hover:bg-slate-600

                        /* ================================= */
                        /* HEADER DAYS */
                        /* ================================= */

                        [&_.fc-col-header-cell]:bg-slate-100
                        dark:[&_.fc-col-header-cell]:bg-slate-900

                        [&_.fc-col-header-cell]:py-4

                        [&_.fc-col-header-cell-cushion]:text-slate-700
                        dark:[&_.fc-col-header-cell-cushion]:text-slate-300

                        [&_.fc-col-header-cell-cushion]:font-black

                        /* ================================= */
                        /* GRID */
                        /* ================================= */

                        [&_.fc-scrollgrid]:border-slate-200
                        dark:[&_.fc-scrollgrid]:border-slate-800

                        [&_.fc-theme-standard_td]:border-color:#e2e8f0

                        dark:[&_.fc-theme-standard_td]:border-color:#1e293b

                        dark:[&_.fc-theme-standard_th]:border-color:#1e293b

                        /* ================================= */
                        /* DAYS */
                        /* ================================= */

                        [&_.fc-daygrid-day-frame]:min-h-[90px]
                        md:[&_.fc-daygrid-day-frame]:min-h-[130px]

                        [&_.fc-daygrid-day-frame]:transition-all

                        [&_.fc-daygrid-day]:bg-white
                        dark:[&_.fc-daygrid-day]:bg-slate-950

                        [&_.fc-daygrid-day:hover]:bg-slate-50
                        dark:[&_.fc-daygrid-day:hover]:bg-slate-900

                        /* ================================= */
                        /* TODAY */
                        /* ================================= */

                        [&_.fc-day-today]:bg-indigo-50
                        dark:[&_.fc-day-today]:bg-indigo-500/10

                        /* ================================= */
                        /* DAY NUMBERS */
                        /* ================================= */

                        [&_.fc-daygrid-day-number]:text-slate-700
                        dark:[&_.fc-daygrid-day-number]:text-slate-300

                        [&_.fc-daygrid-day-number]:font-semibold

                        /* ================================= */
                        /* EVENTS */
                        /* ================================= */

                        [&_.fc-event]:rounded-2xl

                        [&_.fc-event]:border-0

                        [&_.fc-event]:px-2
                        [&_.fc-event]:py-1.5

                        [&_.fc-event]:bg-gradient-to-r
                        [&_.fc-event]:from-indigo

                        /* ================================= */
                        /* NON BUSINESS HOURS */
                        /* ================================= */

                        [&_.fc-non-business]:bg-slate-200/90
                        dark:[&_.fc-non-business]:bg-[#111827]

                        /* ================================= */
                        /* BLOCKED HOURS */
                        /* ================================= */

                        [&_.fc-bg-event]:bg-slate-200/90
                        dark:[&_.fc-bg-event]:bg-[#0b1120]

                        [&_.fc-bg-event]:opacity-100

                        [&_.fc-bg-event]:border-0

                        /* ================================= */
                        /* TIMEGRID */
                        /* ================================= */

                        [&_.fc-timegrid-slot]:h-16

                        dark:[&_.fc-timegrid-slot]:border-color:#1e293b

                        dark:[&_.fc-timegrid-axis]:border-color:#1e293b

                        /* ================================= */
                        /* TIMEGRID BACKGROUND */
                        /* ================================= */

                        [&_.fc-timegrid]:bg-white
                        dark:[&_.fc-timegrid]:bg-[#020817]

                        [&_.fc-timegrid-body]:bg-white
                        dark:[&_.fc-timegrid-body]:bg-[#020817]

                        [&_.fc-timegrid-slot]:bg-white
                        dark:[&_.fc-timegrid-slot]:bg-[#020817]

                        [&_.fc-timegrid-col]:bg-white
                        dark:[&_.fc-timegrid-col]:bg-[#020817]

                        /* ================================= */
                        /* TIMEGRID HEADERS */
                        /* ================================= */

                        [&_.fc-timegrid-axis]:bg-white
                        dark:[&_.fc-timegrid-axis]:bg-[#020817]

                        [&_.fc-timegrid-axis-cushion]:text-slate-600
                        dark:[&_.fc-timegrid-axis-cushion]:text-slate-400

                        [&_.fc-timegrid-slot-label]:bg-white
                        dark:[&_.fc-timegrid-slot-label]:bg-[#020817]

                        /* ================================= */
                        /* TIMEGRID LINES */
                        /* ================================= */

                        [&_.fc-timegrid-slot]:border-color:#1e293b

                        [&_.fc-timegrid-col-frame]:border-color:#1e293b

                        [&_.fc-timegrid-divider]:border-color:#1e293b

                        /* ================================= */
                        /* TIMEGRID DAY HEADERS */
                        /* ================================= */

                        [&_.fc-timegrid-col-header]:bg-slate-100
                        dark:[&_.fc-timegrid-col-header]:bg-slate-900

                        [&_.fc-timegrid-axis-frame]:bg-slate-100
                        dark:[&_.fc-timegrid-axis-frame]:bg-slate-900

                        /* ================================= */
                        /* TIMEGRID CURRENT DAY */
                        /* ================================= */

                        [&_.fc-timegrid-col.fc-day-today]:bg-indigo-500/10

                        /* ================================= */
                        /* ALL DAY */
                        /* ================================= */

                        [&_.fc-timegrid-allday]:bg-slate-100
                        dark:[&_.fc-timegrid-allday]:bg-slate-900

                        [&_.fc-timegrid-allday-table]:bg-slate-100
                        dark:[&_.fc-timegrid-allday-table]:bg-slate-900

                        /* ================================= */
                        /* NOW INDICATOR */
                        /* ================================= */

                        [&_.fc-timegrid-now-indicator-line]:border-color:#6366f1

                        [&_.fc-timegrid-now-indicator-arrow]:border-color:#6366f1

                        /* ================================= */
                        /* SCROLL */
                        /* ================================= */

                        [&_.fc-view-harness]:min-h-[75vh]

                    ">

                        <FullCalendar

                            plugins={[

                                dayGridPlugin,

                                timeGridPlugin,

                                interactionPlugin
                            ]}

                            initialView={
                                window.innerWidth < 768
                                    ? "timeGridDay"
                                    : "dayGridMonth"
                            }

                            locale="es"

                            headerToolbar={{

                                left:
                                    'prev,next today',

                                center:
                                    'title',

                                right:
                                    'dayGridMonth,timeGridWeek,timeGridDay'
                            }}

                            buttonText={{

                                today: 'Hoy',

                                month: 'Mes',

                                week: 'Semana',

                                day: 'Día',
                            }}

                            events={[

                                ...blockedHours,

                                ...calendarEvents
                            ]}

                            businessHours={businessHours}

                            nowIndicator={true}

                            slotLaneClassNames={(arg) => {

                                // ====================================
                                // NO EXISTEN HORARIOS
                                // ====================================

                                if (!hasSchedules) {

                                    return ['fc-non-business'];
                                }

                                const day =
                                    arg.date.getDay();

                                const hour =
                                    arg.date.getHours();

                                const minute =
                                    arg.date.getMinutes();

                                const currentTime =
                                    `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

                                const isBusiness =
                                    businessHours.some(

                                        (business) => (

                                            business.daysOfWeek.includes(day)

                                            &&

                                            currentTime >= business.startTime

                                            &&

                                            currentTime < business.endTime
                                        )
                                    );

                                return isBusiness

                                    ? []

                                    : ['fc-non-business'];
                            }}
                            selectConstraint="businessHours"

                            slotMinTime="06:00:00"

                            slotMaxTime="22:00:00"
                            
                            selectAllow={isInsideBusinessHours}

                            editable={false}

                            selectable={puedeCrear}

                            select={puedeCrear ? handleSelect : undefined}

                            height="auto"

                            expandRows={true}

                            stickyHeaderDates={true}

                            allDaySlot={false}

                            dayMaxEvents={2}

                            moreLinkClick="popover"

                            slotEventOverlap={false}

                            // CLICK DÍA

                            dateClick={(info) => {

                                const calendarApi =
                                    info.view.calendar;

                                calendarApi.changeView(

                                    'timeGridDay',

                                    info.dateStr
                                );
                            }}

                        />

                    </div>

                </div>

            </div>

        </div>
    );
}