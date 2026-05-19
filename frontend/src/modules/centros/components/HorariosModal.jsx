import { useMemo, useState, useEffect } from "react";

import Modal from "../../../components/ui/Modal";

import horarioService from "../services/horarioService";

import {
    Clock3,
    Save,
    Ban,
    CalendarClock,
} from "lucide-react";

const days = [

    { key: "lunes", label: "L" },
    { key: "martes", label: "M" },
    { key: "miercoles", label: "M" },
    { key: "jueves", label: "J" },
    { key: "viernes", label: "V" },
    { key: "sabado", label: "S" },
    { key: "domingo", label: "D" },
];

const hours = [

    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
];

export default function HorariosModal({

    show,
    onClose,
    centro,

}) {

    // =========================================
    // STATES
    // =========================================

    const [mode,
        setMode] =
        useState("available");

    const [tempSelection,
        setTempSelection] =
        useState(null);

    const [hoverHour,
        setHoverHour] =
        useState(null);

    const [availableRanges,
        setAvailableRanges] =
        useState([]);

    const [unavailableRanges,
        setUnavailableRanges] =
        useState([]);

    useEffect(() => {

        if (
            show
            &&
            centro?.id_cen
        ) {

            loadHorarios();
        }

    }, [show, centro]);

    // =========================================
    // HELPERS
    // =========================================

    const hourIndex =
        (hour) => {

            return hours.indexOf(hour);
        };

    const loadHorarios =
        async () => {

            try {

                const data =
                    await horarioService.getByCentro(
                        centro.id_cen
                    );

                // =====================================
                // AZULES
                // =====================================

                const disponibles =
                    data.map((item) => ({

                        day:
                            item.dia_sem_hor,

                        start:
                            item.hora_ini_hor.slice(0, 5),

                        end:
                            item.hora_fin_hor.slice(0, 5),
                    }));

                // =====================================
                // ROJOS
                // =====================================

                const indisponibles =
                    data.flatMap((item) =>

                        (
                            item.horarios_indisponibles
                            || []
                        ).map((ind) => ({

                            day:
                                item.dia_sem_hor,

                            start:
                                ind.hora_ini_ind.slice(0, 5),

                            end:
                                ind.hora_fin_ind.slice(0, 5),
                        }))
                    );

                setAvailableRanges(
                    disponibles
                );

                setUnavailableRanges(
                    indisponibles
                );

            } catch (error) {

                console.log(error);
            }
        };

    // =========================================
    // AVAILABLE
    // =========================================

    const isAvailable =
        (day, hour) => {

            return availableRanges.some((range) => {

                if (range.day !== day)
                    return false;

                return (
                    hourIndex(hour)
                    >= hourIndex(range.start)

                    &&
                    hourIndex(hour)
                    <= hourIndex(range.end)
                );
            });
        };

    // =========================================
    // UNAVAILABLE
    // =========================================

    const isUnavailable =
        (day, hour) => {

            return unavailableRanges.some((range) => {

                if (range.day !== day)
                    return false;

                return (
                    hourIndex(hour)
                    >= hourIndex(range.start)

                    &&
                    hourIndex(hour)
                    <= hourIndex(range.end)
                );
            });
        };

    // =========================================
    // PREVIEW
    // =========================================

    const isPreview =
        (day, hour) => {

            if (
                !tempSelection
                ||
                tempSelection.day !== day
                ||
                !hoverHour
            ) {
                return false;
            }

            const startIndex =
                hourIndex(
                    tempSelection.hour
                );

            const endIndex =
                hourIndex(
                    hoverHour
                );

            const currentIndex =
                hourIndex(hour);

            const min =
                Math.min(
                    startIndex,
                    endIndex
                );

            const max =
                Math.max(
                    startIndex,
                    endIndex
                );

            // =====================================
            // PREVIEW ROJO SOLO DENTRO DEL AZUL
            // =====================================

            if (
                mode === "unavailable"
            ) {

                const insideBlue =
                    availableRanges.some(
                        (range) => {

                            return (

                                range.day === day

                                &&

                                currentIndex
                                >=
                                hourIndex(
                                    range.start
                                )

                                &&

                                currentIndex
                                <=
                                hourIndex(
                                    range.end
                                )
                            );
                        }
                    );

                if (!insideBlue) {

                    return false;
                }
            }

            return (
                currentIndex >= min
                &&
                currentIndex <= max
            );
        };

    // =========================================
    // VALIDAR HUECOS
    // =========================================

    const validateGap =
        (
            day,
            start,
            end
        ) => {

            const existing =
                availableRanges.filter(
                    (range) =>
                        range.day === day
                );

            if (
                existing.length === 0
            ) {
                return true;
            }

            const startI =
                hourIndex(start);

            const endI =
                hourIndex(end);

            for (
                const range
                of existing
            ) {

                const rStart =
                    hourIndex(
                        range.start
                    );

                const rEnd =
                    hourIndex(
                        range.end
                    );

                // TOCA O CONTINUA

                const connected =
                    (
                        startI <= rEnd + 1
                    )

                    &&

                    (
                        endI >= rStart - 1
                    );

                if (connected) {

                    return true;
                }
            }

            return false;
        };

    // =========================================
    // MERGE RANGES
    // =========================================

    const mergeRanges =
        (ranges) => {

            const grouped = {};

            ranges.forEach((range) => {

                if (
                    !grouped[range.day]
                ) {

                    grouped[
                        range.day
                    ] = [];
                }

                grouped[
                    range.day
                ].push(range);
            });

            const merged = [];

            Object.keys(grouped)
                .forEach((day) => {

                    const sorted =
                        grouped[day]
                            .sort(
                                (a, b) =>

                                    hourIndex(
                                        a.start
                                    )

                                    -

                                    hourIndex(
                                        b.start
                                    )
                            );

                    let current =
                        sorted[0];

                    for (
                        let i = 1;
                        i < sorted.length;
                        i++
                    ) {

                        const next =
                            sorted[i];

                        if (

                            hourIndex(
                                next.start
                            )

                            <=

                            hourIndex(
                                current.end
                            ) + 1

                        ) {

                            current.end =
                                hours[
                                    Math.max(
                                        hourIndex(
                                            current.end
                                        ),

                                        hourIndex(
                                            next.end
                                        )
                                    )
                                ];

                        } else {

                            merged.push(
                                current
                            );

                            current = next;
                        }
                    }

                    merged.push(
                        current
                    );
                });

            return merged;
        };

    // =========================================
    // CLICK
    // =========================================

    const handleCellClick =
        (day, hour) => {

            // =====================================
            // REMOVE RED
            // =====================================

            const redIndex =
                unavailableRanges.findIndex(
                    (range) => {

                        return (
                            range.day === day
                            &&
                            hourIndex(hour)
                            >= hourIndex(range.start)
                            &&
                            hourIndex(hour)
                            <= hourIndex(range.end)
                        );
                    }
                );

            if (redIndex !== -1) {

                setUnavailableRanges((prev) =>
                    prev.filter(
                        (_, index) =>
                            index !== redIndex
                    )
                );

                return;
            }

            // =====================================
            // REMOVE BLUE
            // =====================================

            const blueIndex =
                availableRanges.findIndex(
                    (range) => {

                        return (
                            range.day === day
                            &&
                            hourIndex(hour)
                            >= hourIndex(range.start)
                            &&
                            hourIndex(hour)
                            <= hourIndex(range.end)
                        );
                    }
                );

            if (
                blueIndex !== -1
                &&
                mode === "available"
            ) {

                setAvailableRanges((prev) =>
                    prev.filter(
                        (_, index) =>
                            index !== blueIndex
                    )
                );

                return;
            }

            // =====================================
            // FIRST CLICK
            // =====================================

            if (!tempSelection) {

                // ROJO SOLO EN AZUL

                if (
                    mode === "unavailable"
                    &&
                    !isAvailable(day, hour)
                ) {
                    return;
                }

                setTempSelection({

                    day,
                    hour,
                });

                return;
            }

            // =====================================
            // SAME DAY
            // =====================================

            if (
                tempSelection.day !== day
            ) {

                setTempSelection(null);

                return;
            }

            const startIndex =
                hourIndex(
                    tempSelection.hour
                );

            const endIndex =
                hourIndex(hour);

            const start =
                hours[
                    Math.min(
                        startIndex,
                        endIndex
                    )
                ];

            const end =
                hours[
                    Math.max(
                        startIndex,
                        endIndex
                    )
                ];

            // =====================================
            // AVAILABLE
            // =====================================

            if (
                mode === "available"
            ) {

                const valid =
                    validateGap(
                        day,
                        start,
                        end
                    );

                if (!valid) {

                    alert(
                        "No puedes dejar espacios vacíos en un mismo día"
                    );

                    setTempSelection(
                        null
                    );

                    return;
                }

                const merged =
                    mergeRanges([

                        ...availableRanges,

                        {
                            day,
                            start,
                            end,
                        }
                    ]);

                setAvailableRanges(
                    merged
                );
            }

            // =====================================
            // UNAVAILABLE
            // =====================================

            if (
                mode === "unavailable"
            ) {

                const inside =
                    availableRanges.some(
                        (range) => {

                            return (

                                range.day === day

                                &&

                                hourIndex(start)
                                >= hourIndex(
                                    range.start
                                )

                                &&

                                hourIndex(end)
                                <= hourIndex(
                                    range.end
                                )
                            );
                        }
                    );

                if (!inside) {

                    alert(
                        "El rango rojo debe estar dentro del azul"
                    );

                    setTempSelection(
                        null
                    );

                    return;
                }

                setUnavailableRanges((prev) => [

                    ...prev,

                    {
                        day,
                        start,
                        end,
                    }
                ]);
            }

            setTempSelection(null);

            setHoverHour(null);
        };

    // =========================================
    // TOTAL
    // =========================================

    const totalHorarios =
        useMemo(() => {

            return availableRanges.length;

        }, [availableRanges]);

    // =========================================
    // SAVE
    // =========================================

    const handleSave =
        async () => {

            const payload = {

                centro:
                    centro?.id_cen,

                disponibles:
                    availableRanges,

                indisponibles:
                    unavailableRanges,
            };

            try {

                await horarioService.saveSchedule(
                    payload
                );

                alert(
                    "Horarios guardados"
                );

                onClose();

            } catch (error) {

                console.log(error);

                alert(
                    "Error al guardar"
                );
            }
            onClose();
        };

    return (

        <Modal
            show={show}
            onClose={onClose}
            maxWidth="5xl"
            padding={false}
        >

            <div
                className="
                    bg-white
                    dark:bg-[#071224]

                    rounded-[2.8rem]
                    overflow-hidden

                    border
                    border-slate-200
                    dark:border-slate-800

                    text-slate-900
                    dark:text-white

                    transition-colors
                    duration-300
                "
            >

                {/* HEADER */}

                <div
                    className="
                        px-8
                        py-7

                        border-b
                        border-slate-200
                        dark:border-slate-800

                        flex
                        flex-col
                        xl:flex-row

                        xl:items-center
                        xl:justify-between

                        gap-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-5
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
                            "
                        >

                            <Clock3
                                size={30}
                                className="
                                    text-blue-400
                                "
                            />

                        </div>

                        <div>

                            <h2
                                className="
                                    text-5xl
                                    font-black
                                    leading-none
                                "
                            >
                                Horarios
                            </h2>

                            <p
                                className="
                                    text-slate-500
                                    dark:text-slate-400
                                    font-bold
                                    uppercase
                                    mt-2
                                "
                            >
                                {centro?.nom_cen}
                            </p>

                        </div>

                    </div>

                    {/* MODES */}

                    <div
                        className="
                            flex
                            gap-4
                            flex-wrap
                        "
                    >

                        <button

                            onClick={() =>
                                setMode(
                                    "available"
                                )
                            }

                            className={`
                                px-6
                                py-4

                                rounded-2xl

                                flex
                                items-center
                                gap-3

                                font-black

                                transition-all

                                ${
                                    mode ===
                                    "available"

                                        ? `
                                            bg-blue-600
                                            text-white
                                        `

                                        : `
                                            bg-slate-100
                                            text-slate-600

                                            dark:bg-slate-800
                                            dark:text-slate-400
                                        `
                                }
                            `}
                        >

                            <CalendarClock
                                size={18}
                            />

                            Disponibles

                        </button>

                        <button

                            onClick={() =>
                                setMode(
                                    "unavailable"
                                )
                            }

                            className={`
                                px-6
                                py-4

                                rounded-2xl

                                flex
                                items-center
                                gap-3

                                font-black

                                transition-all

                                ${
                                    mode ===
                                    "unavailable"

                                        ? `
                                            bg-red-600
                                            text-white
                                        `

                                        : `
                                            bg-slate-100
                                            text-slate-600

                                            dark:bg-slate-800
                                            dark:text-slate-400
                                        `
                                }
                            `}
                        >

                            <Ban size={18} />

                            Indisponibles

                        </button>

                    </div>

                </div>

                {/* GRID */}

                <div
                    className="
                        p-6
                        overflow-auto
                    "
                >

                    <div
                        className="
                            min-w-[1000px]
                        "
                    >

                        {/* DAYS */}

                        <div
                            className="
                                grid
                                grid-cols-8
                                gap-3
                                mb-4
                            "
                        >

                            <div />

                            {
                                days.map((day) => (

                                    <div
                                        key={day.key}

                                        className="
                                            h-14

                                            rounded-2xl

                                            bg-slate-100
                                            dark:bg-slate-800/60

                                            flex
                                            items-center
                                            justify-center

                                            text-sm
                                            font-black
                                            uppercase
                                            text-slate-700
                                            dark:text-slate-300
                                        "
                                    >

                                        {day.label}

                                    </div>
                                ))
                            }

                        </div>

                        {/* HOURS */}

                        {
                            hours.map((hour) => (

                                <div
                                    key={hour}

                                    className="
                                        grid
                                        grid-cols-8
                                        gap-3
                                        mb-3
                                    "
                                >

                                    {/* HOUR */}

                                    <div
                                        className="
                                            h-14

                                            rounded-2xl

                                            bg-slate-100
                                            dark:bg-slate-900/60

                                            flex
                                            items-center
                                            justify-center

                                            text-slate-600
                                            dark:text-slate-400
                                            text-sm
                                        "
                                    >
                                        {hour}
                                    </div>

                                    {/* CELLS */}

                                    {
                                        days.map((day) => {

                                            const available =
                                                isAvailable(
                                                    day.key,
                                                    hour
                                                );

                                            const unavailable =
                                                isUnavailable(
                                                    day.key,
                                                    hour
                                                );

                                            const preview =
                                                isPreview(
                                                    day.key,
                                                    hour
                                                );

                                            return (

                                                <button
                                                    key={`${day.key}-${hour}`}

                                                    onClick={() =>
                                                        handleCellClick(
                                                            day.key,
                                                            hour
                                                        )
                                                    }

                                                    onMouseEnter={() =>
                                                        setHoverHour(hour)
                                                    }

                                                    className={`
                                                        h-14

                                                        rounded-2xl

                                                        border

                                                        transition-all
                                                        duration-200

                                                        active:scale-95

                                                        ${
                                                            unavailable

                                                                ? `
                                                                    bg-red-500
                                                                    border-red-400

                                                                    shadow-lg
                                                                    shadow-red-500/30
                                                                `

                                                                : preview

                                                                    ? mode === "available"

                                                                        ? `
                                                                            bg-blue-400/40
                                                                            border-blue-400

                                                                            shadow-lg
                                                                            shadow-blue-500/20
                                                                        `

                                                                        : `
                                                                            bg-red-400/60
                                                                            border-red-400

                                                                            shadow-lg
                                                                            shadow-red-500/25
                                                                        `

                                                                    : available

                                                                        ? `
                                                                            bg-blue-500
                                                                            border-blue-400

                                                                            shadow-lg
                                                                            shadow-blue-500/30
                                                                        `

                                                                        : mode === "unavailable"

                                                                            ? available

                                                                                ? `
                                                                                    bg-blue-500/20
                                                                                    border-blue-500/30
                                                                                `

                                                                                : `
                                                                                    bg-slate-50
                                                                                    border-slate-200

                                                                                    dark:bg-slate-900/60
                                                                                    dark:border-slate-800
                                                                                `

                                                                            : `
                                                                                bg-slate-50
                                                                                border-slate-200

                                                                                dark:bg-slate-900/60
                                                                                dark:border-slate-800

                                                                                hover:border-blue-400
                                                                                hover:bg-blue-100

                                                                                dark:hover:border-blue-500/40
                                                                                dark:hover:bg-blue-500/10
                                                                            `
                                                        }

                                                                        
                                                        }
                                                    `}
                                                />
                                            );
                                        })
                                    }

                                </div>
                            ))
                        }

                    </div>

                </div>

                {/* FOOTER */}

                <div
                    className="
                        border-t
                        border-slate-200
                        dark:border-slate-800

                        px-8
                        py-6

                        flex
                        justify-between
                        items-center
                    "
                >

                    <div>

                        <p
                            className="
                                text-slate-400
                                font-semibold
                            "
                        >

                            Horarios configurados:
                            {" "}

                            <span
                                className="
                                    text-blue-400
                                    font-black
                                "
                            >

                                {totalHorarios}

                            </span>

                        </p>

                    </div>

                    <button

                        onClick={handleSave}

                        className="
                            px-8
                            py-4

                            rounded-2xl

                            bg-blue-600
                            hover:bg-blue-500
                            text-white
                            transition-all
                            duration-200

                            active:scale-95

                            flex
                            items-center
                            gap-3

                            font-black
                            text-lg
                        "
                    >

                        <Save size={20} />

                        Guardar Cambios

                    </button>

                </div>

            </div>

        </Modal>
    );
}