import {
    useLocation
} from 'react-router-dom';

import {
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import eventoService
from '../services/eventoService';

export default function EventoPage() {

    const { state } =
        useLocation();

    const [formData,
    setFormData] =
        useState({

            tipo_eve: '',

            fecha_eve:
                state?.fecha_eve || '',

            hora_eve:
                state?.hora_eve || '',

            estado_eve:
                'CONFIRMADO',

            detalle_eve: '',

            id_cen_3:
                state?.id_cen_3,

            id_com_1: null,
        });

    const tiposEvento = [

        'MISA',

        'BAUTIZO',

        'MATRIMONIO',

        'CONFESION',

        'ADORACION',
    ];

    const infoEventos = {
        MISA: {
            precio: 'Bs. 70',
            requisitos: [
                'Nombre de la intención.',
                'pago 2 dias antes.'
            ]
        },

        BAUTIZO: {
            precio: 'Bs. 150',
            requisitos: [
                'Certificado de nacimiento.',
                'Fotocopia de CI de padres.',
                'Fotocopia de CI de padrinos.',
                'pago 2 dias antes.'
            ]
        },

        MATRIMONIO: {
            precio: 'Bs. 500',
            requisitos: [
                'Certificados de bautizo de los novios.',
                'Fotocopia de CI de ambos novios.',
                'Curso prematrimonial completo.',
                'Dos testigos.',
                'pago 2 dias antes.'
            ]
        },

        CONFESION: {
            precio: 'Gratuito',
            requisitos: [
                'No requiere documentación.'
            ]
        },

        ADORACION: {
            precio: 'Gratuito',
            requisitos: [
                'Registro previo de asistencia.'
            ]
        }
    };

    const [showQR,
    setShowQR] =
        useState(false);

    const navigate =
        useNavigate();

    const handleChange =
        (e) => {

            setFormData({

                ...formData,

                [e.target.name]:
                    e.target.value
            });
        };

    const handleSubmit =
    async (e) => {

        e.preventDefault();

        try {

            const payload = {

                ...formData,

                estado_eve:
                    'pendiente',
            };

            await eventoService
                .create(payload);

            // =================================
            // MOSTRAR MODAL QR
            // =================================

            setShowQR(true);

            // =================================
            // REDIRECCIONAR
            // =================================

            setTimeout(() => {

                navigate(

                    `/calendario/${formData.id_cen_3}`
                );

            }, 4000);

        } catch (error) {

            console.log(error);

            alert(
                'Error al reservar'
            );
        }
    };

    return (

        <div className="
            min-h-screen
            bg-slate-100
            dark:bg-[#020817]
            flex
            items-center
            justify-center
            p-4
        ">

            <form
                onSubmit={handleSubmit}
                className="
                    w-full
                    max-w-2xl

                    bg-white
                    dark:bg-[#081028]

                    rounded-[32px]

                    shadow-2xl

                    p-8

                    border
                    border-slate-200
                    dark:border-slate-800
                "
            >

                <h1 className="
                    text-3xl
                    font-black
                    text-slate-800
                    dark:text-white
                    mb-8
                ">

                    Reservar Evento

                </h1>

                {
                    showQR && (

                        <div className="
                            fixed
                            inset-0
                            z-50

                            bg-black/70
                            backdrop-blur-md

                            flex
                            items-center
                            justify-center

                            p-4
                        ">

                            <div className="
                                w-full
                                max-w-md

                                bg-white
                                dark:bg-[#081028]

                                rounded-[32px]

                                shadow-2xl

                                p-8

                                border
                                border-slate-200
                                dark:border-slate-800

                                text-center

                                animate-in
                                fade-in
                                zoom-in
                                duration-300
                            ">

                                <h2 className="
                                    text-3xl
                                    font-black
                                    text-slate-800
                                    dark:text-white

                                    mb-3
                                ">

                                    Reserva Confirmada

                                </h2>

                                <p className="
                                    text-slate-500
                                    dark:text-slate-400

                                    mb-6
                                ">

                                    Escanea el QR para
                                    continuar con el pago.

                                </p>

                                <img
                                    src="/images/general/QR.png"
                                    alt="QR"

                                    className="
                                        w-64
                                        h-64

                                        object-contain

                                        mx-auto

                                        rounded-3xl

                                        shadow-xl

                                        border
                                        border-slate-200
                                        dark:border-slate-700
                                    "
                                />

                                

                                <p className="
                                    mt-6

                                    text-sm

                                    text-slate-400
                                ">

                                    Redirigiendo al calendario...

                                </p>

                            </div>

                        </div>
                    )
                }

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-6
                ">

                    {/* TIPO */}

                    <div>

                        <label className="
                            font-bold
                            text-slate-700
                            dark:text-slate-300
                        ">

                            Tipo de evento

                        </label>

                        <select
                            name="tipo_eve"
                            value={formData.tipo_eve}
                            onChange={handleChange}
                            className="
                                w-full
                                mt-2
                                rounded-2xl
                                border
                                p-4
                                dark:bg-slate-900
                            "
                            required
                        >

                            <option value="">
                                Seleccionar
                            </option>

                            {
                                tiposEvento.map(

                                    (tipo) => (

                                        <option
                                            key={tipo}
                                            value={tipo}
                                        >

                                            {tipo}

                                        </option>
                                    )
                                )
                            }

                        </select>

                    </div>

                    {/* FECHA */}

                    <div>

                        <label className="
                            font-bold
                        ">

                            Fecha

                        </label>

                        <input
                            type="date"
                            value={formData.fecha_eve}
                            disabled
                            className="
                                w-full
                                mt-2
                                rounded-2xl
                                border
                                p-4
                                dark:bg-slate-900
                            "
                        />

                    </div>

                    {/* HORA */}

                    <div>

                        <label className="
                            font-bold
                        ">

                            Hora

                        </label>

                        <input
                            type="time"
                            value={formData.hora_eve}
                            disabled
                            className="
                                w-full
                                mt-2
                                rounded-2xl
                                border
                                p-4
                                dark:bg-slate-900
                            "
                        />

                    </div>

                    {/* DETALLE */}

                    <div className="
                        md:col-span-2
                    ">

                        <label className="
                            font-bold
                        ">

                            Detalle

                        </label>

                        <textarea
                            name="detalle_eve"
                            value={formData.detalle_eve}
                            onChange={handleChange}
                            rows={5}
                            className="
                                w-full
                                mt-2
                                rounded-2xl
                                border
                                p-4
                                dark:bg-slate-900
                            "
                        />

                    </div>

                </div>

                {
                    formData.tipo_eve &&
                    infoEventos[formData.tipo_eve] && (

                        <div className="
                            mt-8
                            rounded-3xl
                            border
                            border-indigo-200
                            dark:border-indigo-800

                            bg-indigo-50
                            dark:bg-indigo-950/30

                            p-6
                        ">

                            <h3 className="
                                text-xl
                                font-black
                                text-indigo-700
                                dark:text-indigo-300
                                mb-4
                            ">
                                Información del Evento
                            </h3>

                            <div className="mb-4">

                                <span className="
                                    font-bold
                                    text-slate-700
                                    dark:text-slate-300
                                ">
                                    Precio:
                                </span>

                                <span className="
                                    ml-2
                                    text-green-600
                                    font-bold
                                    text-lg
                                ">
                                    {infoEventos[formData.tipo_eve].precio}
                                </span>

                            </div>

                            <div>

                                <p className="
                                    font-bold
                                    text-slate-700
                                    dark:text-slate-300
                                    mb-2
                                ">
                                    Requisitos:
                                </p>

                                <ul className="
                                    list-disc
                                    pl-6
                                    space-y-1
                                    text-slate-600
                                    dark:text-slate-400
                                ">

                                    {
                                        infoEventos[
                                            formData.tipo_eve
                                        ].requisitos.map(
                                            (req, index) => (

                                                <li key={index}>
                                                    {req}
                                                </li>
                                            )
                                        )
                                    }

                                </ul>

                            </div>

                        </div>
                    )
                }

                <button
                    type="submit"
                    className="
                        mt-8
                        w-full
                        rounded-2xl
                        bg-indigo-600
                        hover:bg-indigo-700
                        text-white
                        font-bold
                        py-4
                        transition-all
                    "
                >

                    Reservar

                </button>

            </form>

        </div>
    );
}