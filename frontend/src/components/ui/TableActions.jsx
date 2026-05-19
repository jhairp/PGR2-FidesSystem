// resources/js/Components/UI/TableActions.jsx
import React from 'react';
import { Edit3, Trash2, Eye, Users, Clock3 } from 'lucide-react'; // Importamos Eye

export default function TableActions({ item, onEdit, onDelete, onView, onAssign, onSchedule, }) {
    const id =
    item.id_cen ||
    item.id_rol ||
    item.id_parroquia ||
    item.id_usu ||
    item.id;

    // Si hay onDelete o onView, ajustamos la justificación
    const justify = (onDelete || onAssign || onSchedule|| onView) ? 'justify-end' : 'justify-center';

    return (
        <div className={`flex items-center gap-3 ${justify}`}>
            {/* --- BOTÓN VER (MORADO) --- */}
            {onView && (
                <button
                    onClick={() => onView(item)}
                    className="
                        p-2.5
                        bg-violet-50
                        text-violet-600
                        hover:bg-violet-600
                        hover:text-white
                        rounded-xl
                        transition-all
                        duration-200
                        active:scale-95
                        dark:bg-violet-500/10
                        dark:text-violet-400
                        dark:hover:bg-violet-600
                        dark:hover:text-white
                    "
                    title="Ver Detalles"
                >
                    <Eye size={16} strokeWidth={2.5} />
                </button>
            )}

            {/* --- BOTÓN EDITAR --- */}
            {onEdit && (
            <button
                onClick={() => onEdit(item)}
                className="
                    p-2.5
                    bg-amber-50
                    text-amber-600
                    hover:bg-amber-500
                    hover:text-white
                    rounded-xl
                    transition-all
                    duration-200
                    active:scale-95
                    dark:bg-amber-400/10
                    dark:text-amber-400
                    dark:hover:bg-amber-400
                    dark:hover:text-black
                "
                title="Editar"
            >
                <Edit3 size={16} strokeWidth={2.5} />
            </button>
            )}

            {/* --- BOTÓN ELIMINAR --- */}
            {onDelete && (
                <button
                    onClick={() => onDelete(id)}
                    className="
                        p-2.5
                        bg-rose-50
                        text-rose-600
                        hover:bg-rose-600
                        hover:text-white
                        rounded-xl
                        transition-all
                        duration-200
                        active:scale-95
                        dark:bg-rose-500/10
                        dark:text-rose-400
                        dark:hover:bg-rose-600
                    "
                    title="Eliminar"
                >
                    <Trash2 size={16} strokeWidth={2.5} />
                </button>
            )}

            {/* --- BOTÓN ASIGNAR PERSONAL --- */}
            {onAssign && (

                <button

                    onClick={() =>
                        onAssign(item)
                    }

                    className="
                        p-2.5
                        bg-blue-50
                        text-blue-600
                        hover:bg-blue-600
                        hover:text-white
                        rounded-xl
                        transition-all
                        duration-200
                        active:scale-95
                        dark:bg-blue-400/10
                        dark:text-blue-400
                    "

                    title="Asignar Personal"
                >

                    <Users
                        size={16}
                        strokeWidth={2.5}
                    />

                </button>
            )}

            {/* --- BOTÓN HORARIOS --- */}
            {onSchedule && (

                <button

                    onClick={() =>
                        onSchedule(item)
                    }

                    className="
                        p-2.5
                        bg-emerald-50
                        text-emerald-600
                        hover:bg-emerald-600
                        hover:text-white
                        rounded-xl
                        transition-all
                        duration-200
                        active:scale-95
                        dark:bg-emerald-400/10
                        dark:text-emerald-400
                    "

                    title="Gestionar Horarios"
                >

                    <Clock3
                        size={16}
                        strokeWidth={2.5}
                    />

                </button>
            )}
        </div>
    );
}