import React from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';

export default function Navbar({ onOpenMenu, onOpenProfile }) {
    // Extraemos el usuario de las props compartidas de Inertia
    //const { auth } = usePage().props;
    const user = {
        persona: {
            nom_per: 'Jhahir',
        },
        correo_usu: 'jhahir@gmail.com',
    };
    //const user = auth.user;

    return (
        <header className="h-20 bg-white/80 dark:bg-[#11141D]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
            <div className="h-full px-6 md:px-10 flex items-center justify-between">
                <button onClick={onOpenMenu} className="lg:hidden p-2 text-slate-600 dark:text-slate-300">
                    <Menu size={24} />
                </button>
                
                <div className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Sistema Parroquial
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2.5 text-slate-400 relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#11141D]"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

                    <button onClick={onOpenProfile} className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                        <div className="text-right hidden sm:block">
                            {/* Mostramos el nombre y apellido paterno del usuario */}
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                {user.persona 
                                    ? `${user.persona.nom_per}` 
                                    : user.correo_usu.split('@')[0]
                                }
                            </p>
                            <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">En Línea</p>
                        </div>
                        
                        {/* Contenedor de la foto de perfil */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border-2 border-transparent group-hover:border-indigo-500 transition-all">
                            {user.foto_usu ? (
                                <img 
                                    src={`/backend/assets/images/perfil/${user.foto_usu}`} 
                                    alt="Perfil" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "/backend/assets/images/perfil/default.png";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                    <span className="text-xs font-bold">{user.correo_usu[0].toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <ChevronDown size={14} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </header>
    );
}