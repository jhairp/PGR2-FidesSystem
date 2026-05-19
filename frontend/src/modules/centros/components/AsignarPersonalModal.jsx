import { useMemo, useState } from "react";

import Modal from "../../../components/ui/Modal";

import {

    Users,
    Search,
    UserPlus,
    UserMinus,

} from "lucide-react";

import useAsignaciones
from "../hooks/useAsignaciones";

export default function AsignarPersonalModal({

    show,
    onClose,

    centro,

}) {

    const [filter, setFilter] =
        useState("");

    const {

        personas,
        asignados,

        assignPersona,
        removeAsignacion,

    } = useAsignaciones(
        centro
    );

    /*
    -----------------------------------------
    IDS ASIGNADOS
    -----------------------------------------
    */

    const assignedIds =
        useMemo(() => {

            return asignados.map(
                (item) =>
                    item.id_per_3
            );

        }, [asignados]);

    if (!show || !centro)
        return null;


    /*
    -----------------------------------------
    FILTRADO
    -----------------------------------------
    */

    const filteredPersonas =
        personas.filter((persona) => {

            const fullName =
                `
                ${persona.nom_per || ""}
                ${persona.ap_pat_per || ""}
                `
                    .toLowerCase();

            return fullName.includes(
                filter.toLowerCase()
            );
        });

    /*
    -----------------------------------------
    TOGGLE
    -----------------------------------------
    */

    const handleToggle =
        (persona) => {

            const asignado =
                asignados.find(
                    (item) =>
                        item.id_per_3 ===
                        persona.id_per
                );

            if (asignado) {

                removeAsignacion(
                    asignado.id_det_par
                );

            } else {

                assignPersona(
                    persona.id_per
                );
            }
        };

    return (

        <Modal
            show={show}
            onClose={onClose}
            maxWidth="2xl"
            padding={false}
        >

            <div
                className="
                    w-full
                    max-w-6xl
                    bg-white
                    dark:bg-[#0f172a]
                    rounded-[2rem]
                    p-3
                    border
                    border-slate-200
                    dark:border-slate-800
                "
            >

                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        gap-4
                        mb-8
                    "
                >

                    <div
                        className="
                            w-16
                            h-16
                            rounded-3xl
                            bg-blue-100
                            dark:bg-blue-500/10
                            flex
                            items-center
                            justify-center
                            text-blue-600
                            dark:text-blue-400
                        "
                    >

                        <Users size={30} />

                    </div>

                    <div>

                        <h2
                            className="
                                text-3xl
                                font-black
                                text-slate-800
                                dark:text-white
                            "
                        >

                            Personal del Centro

                        </h2>

                        <p
                            className="
                                text-slate-500
                                dark:text-slate-400
                                text-sm
                                font-semibold
                            "
                        >

                            {centro.nom_cen}

                        </p>

                    </div>

                </div>

                {/* SEARCH */}

                <div
                    className="
                        relative
                        mb-8
                        group
                    "
                >

                    <Search
                        size={18}

                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                            group-focus-within:text-blue-500
                            transition-colors
                        "
                    />

                    <input

                        type="text"

                        placeholder="Buscar personal..."

                        value={filter}

                        onChange={(e) =>
                            setFilter(
                                e.target.value
                            )
                        }

                        className="
                            w-full
                            pl-12
                            pr-4
                            py-4

                            bg-white
                            dark:bg-slate-900

                            border
                            border-slate-200
                            dark:border-slate-700

                            text-slate-700
                            dark:text-white

                            placeholder-slate-400
                            dark:placeholder-slate-500

                            rounded-2xl
                            text-sm
                            font-bold
                            outline-none

                            focus:ring-4
                            focus:ring-blue-500/20
                            focus:border-blue-500

                            transition-all
                        "
                    />

                </div>

                {/* LIST */}

                <div
                    className="
                        space-y-4
                        max-h-[500px]
                        overflow-y-auto
                        pr-2
                    "
                >

                    {
                        filteredPersonas.map(
                            (persona) => {

                                const isAssigned =
                                    assignedIds.includes(
                                        persona.id_per
                                    );

                                return (

                                    <div

                                        key={
                                            persona.id_per
                                        }

                                        className={`
                                            flex
                                            items-center
                                            justify-between
                                            p-4
                                            rounded-3xl
                                            border
                                            transition-all
                                            duration-300

                                            ${isAssigned

                                                ? `
                                                    bg-blue-50/60
                                                    border-blue-200

                                                    dark:bg-blue-500/10
                                                    dark:border-blue-500/20
                                                `

                                                : `
                                                    bg-white
                                                    border-slate-100

                                                    dark:bg-slate-900
                                                    dark:border-slate-800
                                                `
                                            }
                                        `}
                                    >

                                        {/* LEFT */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-4
                                            "
                                        >

                                            <div
                                                className={`
                                                    w-12
                                                    h-12
                                                    rounded-2xl
                                                    flex
                                                    items-center
                                                    justify-center
                                                    font-black
                                                    text-sm

                                                    ${isAssigned

                                                        ? `
                                                            bg-blue-600
                                                            text-white
                                                        `

                                                        : `
                                                            bg-slate-100
                                                            text-slate-600

                                                            dark:bg-slate-800
                                                            dark:text-slate-300
                                                        `
                                                    }
                                                `}
                                            >

                                                {
                                                    persona.nom_per?.[0]
                                                }

                                                {
                                                    persona.ap_pat_per?.[0]
                                                }

                                            </div>

                                            <div>

                                                <h4
                                                    className={`
                                                        text-sm
                                                        font-black
                                                        uppercase

                                                        ${isAssigned

                                                            ? `
                                                                text-blue-700
                                                                dark:text-blue-300
                                                            `

                                                            : `
                                                                text-slate-700
                                                                dark:text-white
                                                            `
                                                        }
                                                    `}
                                                >

                                                    {
                                                        persona.nombre_completo
                                                    }

                                                </h4>

                                                <p
                                                    className="
                                                        text-[10px]
                                                        uppercase
                                                        tracking-widest
                                                        font-black
                                                        text-slate-400
                                                    "
                                                >

                                                    {
                                                        "carnet   " + persona.carnet_per 
                                                    }

                                                </p>

                                            </div>

                                        </div>

                                        {/* BUTTON */}

                                        <button

                                            onClick={() =>
                                                handleToggle(
                                                    persona
                                                )
                                            }

                                            className={`
                                                flex
                                                items-center
                                                gap-2

                                                px-5
                                                py-3

                                                rounded-2xl

                                                text-[11px]
                                                font-black
                                                uppercase
                                                tracking-wider

                                                transition-all
                                                active:scale-95

                                                ${isAssigned

                                                    ? `
                                                        bg-blue-600
                                                        hover:bg-blue-700
                                                        text-white
                                                    `

                                                    : `
                                                        bg-slate-100
                                                        hover:bg-slate-200

                                                        dark:bg-slate-800
                                                        dark:hover:bg-slate-700

                                                        text-slate-600
                                                        dark:text-slate-300
                                                    `
                                                }
                                            `}
                                        >

                                            {
                                                isAssigned
                                                    ? (
                                                        <>
                                                            <UserMinus
                                                                size={16}
                                                                strokeWidth={2.5}
                                                            />

                                                            <span className="hidden sm:inline">
                                                                Quitar
                                                            </span>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            <UserPlus
                                                                size={16}
                                                                strokeWidth={2.5}
                                                            />

                                                            <span className="hidden sm:inline">
                                                                Asignar
                                                            </span>
                                                        </>
                                                    )
                                            }

                                        </button>

                                    </div>
                                );
                            }
                        )
                    }

                    {
                        filteredPersonas.length === 0 && (

                            <div
                                className="
                                    py-16
                                    text-center
                                "
                            >

                                <p
                                    className="
                                        text-slate-400
                                        text-xs
                                        font-black
                                        uppercase
                                        tracking-widest
                                    "
                                >

                                    No se encontró personal

                                </p>

                            </div>
                        )
                    }

                </div>

            </div>

        </Modal>
    );
}