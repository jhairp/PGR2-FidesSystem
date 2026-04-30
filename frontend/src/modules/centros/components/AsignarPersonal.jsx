import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { UserCheck, UserPlus, Search, UserMinus } from 'lucide-react'; // Añadido UserMinus para desasignar

export default function AsignarPersonal({ centro, personas = [], personasAsignadas = [] }) {
    const [filter, setFilter] = useState("");

    const filteredPersonas = personas.filter(p => 
        `${p.nom_per} ${p.ap_pat_per} ${p.ap_mat_per}`.toLowerCase().includes(filter.toLowerCase())
    );

    const handleToggle = (personaId) => {
        router.post(route('centros.toggle.persona', { 
            centro: centro.id_cen,
            persona: personaId
        }), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Buscador interno */}
            <div className="relative mb-6 group">
                <Search 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" 
                    size={18} 
                />
                <input 
                    type="text"
                    placeholder="Buscar personal por nombre..."
                    className="w-full pl-12 pr-4 py-4 
                            /* Modo Claro */
                            bg-white border border-slate-200 text-slate-700 shadow-sm
                            /* Modo Oscuro */
                            dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500
                            /* Estados */
                            rounded-2xl text-sm font-bold outline-none
                            focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
                            dark:focus:ring-blue-500/10 dark:focus:border-blue-400
                            transition-all duration-300"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPersonas.map((persona) => {
                    const isAssigned = personasAsignadas.includes(persona.id_per);
                    
                    return (
                        <div 
                            key={persona.id_per}
                            className={`flex justify-between items-center p-4 rounded-2xl border transition-all duration-300 ${
                                isAssigned 
                                ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20' 
                                : 'bg-white border-slate-100 dark:bg-slate-800/50 dark:border-slate-700'
                            }`}
                        >
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold uppercase ${isAssigned ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {persona.nom_per} {persona.ap_pat_per} {persona.ap_mat_per}
                                </span>
                                {persona.usuario?.rol && (
                                    <span className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isAssigned ? 'text-blue-500/70' : 'text-indigo-500'}`}>
                                        {persona.usuario.rol.nom_rol}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => handleToggle(persona.id_per)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm ${
                                    isAssigned
                                    ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                                }`}
                            >
                                {isAssigned ? (
                                    <><UserMinus size={14} strokeWidth={3} /> Quitar</>
                                ) : (
                                    <><UserPlus size={14} strokeWidth={3} /> Asignar</>
                                )}
                            </button>
                        </div>
                    );
                })}

                {filteredPersonas.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-slate-400 text-xs font-bold uppercase italic">No se encontró personal</p>
                    </div>
                )}
            </div>
        </div>
    );
}