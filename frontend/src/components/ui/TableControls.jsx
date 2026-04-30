import React, { useState } from 'react';
import { Search, ChevronDown, ListOrdered, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TableControls({ searchQuery, setSearchQuery, perPage, setPerPage }) {
    const [isOpen, setIsOpen] = useState(false);
    const options = [10, 20, 50, 100];

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 px-4 items-center relative z-10">
            {/* Buscador */}
            <div className="relative flex-1 w-full">
                <Search
                    className="absolute left-6 top-1/2 -translate-y-1/2
                            text-indigo-500/50
                            z-10 pointer-events-none"
                    size={20}
                />
                <input 
                    type="text"
                    placeholder="BUSCAR EN LOS REGISTROS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/50 dark:bg-[#11141D]/50 backdrop-blur-xl border-none ring-1 ring-slate-200/60 dark:ring-slate-800/60 p-5 pl-16 rounded-[2rem] text-[11px] font-bold uppercase tracking-widest text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all outline-none"
                />
            </div>

            {/* Selector Personalizado (Dropdown) */}
            <div className="relative min-w-[180px]">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between bg-white dark:bg-[#11141D] ring-1 ring-slate-200 dark:ring-slate-800 py-5 px-8 rounded-[2rem] text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:ring-indigo-500 transition-all shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <ListOrdered size={18} className="text-indigo-500" />
                        <span>Mostrar {perPage}</span>
                    </div>
                    <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={16} />
                </button>

                {/* Menú Desplegable Animado */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Overlay invisible para cerrar al hacer click fuera */}
                            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                            
                            <motion.div 
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 10, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="absolute top-full left-0 w-full bg-white dark:bg-[#1A1D26] border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-2xl overflow-hidden z-20 p-2"
                            >
                                {options.map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => {
                                            setPerPage(num);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                            perPage === num 
                                            ? 'bg-indigo-500 text-white' 
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        MOSTRAR {num}
                                        {perPage === num && <Check size={14} />}
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}