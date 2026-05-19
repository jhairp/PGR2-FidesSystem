import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Edit3, AlertCircle, Users } from 'lucide-react';

export default function TopAlert({ show, type = 'creado', message }) {
    const config = {
        // Soporta tanto el nombre de la acción (Laravel) como el alias (Hook)
        creado: {
            icon: <CheckCircle size={20} />,
            className: 'bg-emerald-500 text-white',
        },
        success: { // Alias por si acaso
            icon: <CheckCircle size={20} />,
            className: 'bg-emerald-500 text-white',
        },
        editado: {
        icon: <Edit3 size={20} />,
        className: 'bg-amber-400 text-white shadow-lg shadow-amber-400/30', // bg-amber es el amarillo/naranja
    },
        info: { // Alias para editado
            icon: <Edit3 size={20} />,
            className: 'bg-indigo-600 text-white',
        },
        activo: {
            icon: <CheckCircle size={20} />,
            className: 'bg-emerald-500 text-white',
        },
        inactivo: {
            icon: <AlertCircle size={20} />,
            className: 'bg-orange-500 text-white',
        },
        warning: {
            icon: <AlertCircle size={20} />,
            className: 'bg-orange-500 text-white',
        },
        error: {
            icon: <AlertCircle size={20} />,
            className: 'bg-rose-600 text-white',
        },
        // CONFIGURACIÓN AZUL PARA ASIGNACIÓN
        asignado: {
            icon: <Users size={20} />,
            className: 'bg-blue-600 text-white shadow-lg shadow-blue-500/40',
        },
        assign: { // Este es el que usa tu Hook actual
            icon: <Users size={20} />,
            className: 'bg-blue-600 text-white shadow-lg shadow-blue-500/40',
        }
    };

    // Buscamos la configuración, si no existe usamos 'creado' (verde) como último recurso
    const current = config[type] || config.creado;

    const alertContent = (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: -120, x: '-50%', opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, x: '-50%', opacity: 1, scale: 1 }}
                    exit={{ y: -100, x: '-50%', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                    className="fixed top-10 left-1/2 z-[9999] pointer-events-none"
                >
                    <div
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] font-black text-xs uppercase tracking-widest ${current.className} pointer-events-auto transition-colors duration-300`}
                    >
                        {current.icon}
                        <span>{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(alertContent, document.body);
}