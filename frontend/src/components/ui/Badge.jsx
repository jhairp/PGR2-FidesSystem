import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Badge({ status, onClick }) {
    const [flash, setFlash] = useState(false);
    const currentStatus = String(status || '').trim().toLowerCase();

    // El destello interno del botón se activa al cambiar el estado
    useEffect(() => {
        setFlash(true);
        const timer = setTimeout(() => setFlash(false), 600);
        return () => clearTimeout(timer);
    }, [status]);

    const config = {
        "activo": { 
            label: 'Activo', 
            classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 hover:bg-emerald-600 hover:text-white hover:border-emerald-600' 
        },
        "inactivo": { 
            label: 'Inactivo', 
            classes: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200/50 hover:bg-orange-600 hover:text-white hover:border-orange-600' 
        }
    };

    if (!config[currentStatus]) return null;
    const { label, classes } = config[currentStatus];

    return (
        <motion.button 
            type="button"
            onClick={onClick}
            // Animación de botón físico (se hunde y gira un poco)
            whileTap={{
                scale: 0.78,
                rotate: -2
            }}

            whileHover={{
                y: -2,
                scale: 1.03
            }}
            className={`
                relative px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border 
                transition-all duration-300 cursor-pointer overflow-hidden shadow-sm
                ${classes}
                ${flash ? 'ring-2 ring-white/60 dark:ring-white/20' : ''}
            `}
        >
            {/* El rayo de luz cinematográfico */}
            <AnimatePresence>
                {flash && (
                    <motion.span 
                        initial={{ x: '-100%', skewX: -20 }}
                        animate={{ x: '200%', skewX: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent z-0"
                    />
                )}
            </AnimatePresence>
            
            <span className="relative z-10">{label}</span>
        </motion.button>
    );
}