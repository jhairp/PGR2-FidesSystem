import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Cross, Check, ArrowRight } from 'lucide-react';

export default function SelectAvatar() {
    // 1. Lista de tus archivos reales (según tu captura de VS Code)
    const avatars = [
        'jesus.jpg', 'jesus2.jpg', 'corazon.jpg', 
        'cruz.jpg', 'dino.jpg', 'gato.jpg', 
        'rosario.jpg', 'user_azul.jpg', 'user_shrek.jpg'
    ];

    // 2. Definimos el formulario (Cambié el default a jesus.jpg)
    const { data, setData, post, processing } = useForm({
        foto_usu: 'jesus.jpg', 
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('perfil.foto.update'));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F111A] flex items-center justify-center p-6">
            <Head title="Elige tu Perfil - Curia Digital" />

            <div className="w-full max-w-2xl">
                {/* Encabezado */}
                <div className="text-center mb-10">
                    <div className="inline-flex w-14 h-14 bg-indigo-600 rounded-2xl items-center justify-center text-white mb-4 shadow-xl shadow-indigo-500/20">
                        <Cross size={28} />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Personaliza tu Perfil</h2>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.4em] mt-2">Selecciona un avatar para tu cuenta</p>
                </div>

                {/* Contenedor de Selección */}
                <div className="bg-white dark:bg-[#11141D] p-8 md:p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
                            {avatars.map((avatar, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setData('foto_usu', avatar)}
                                    className={`
                                        relative group rounded-[2.5rem] overflow-hidden aspect-square border-4 transition-all duration-300
                                        ${data.foto_usu === avatar 
                                            ? 'border-indigo-600 scale-105 shadow-2xl shadow-indigo-500/20' 
                                            : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'}
                                    `}
                                >
                                    <img 
                                        src={`/backend/assets/images/perfil/${avatar}`} 
                                        alt={avatar}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => { e.target.src = "/backend/assets/images/perfil/default.png"; }}
                                    />
                                    
                                    {/* Overlay de Selección */}
                                    {data.foto_usu === avatar && (
                                        <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                                            <div className="bg-indigo-600 text-white rounded-full p-1.5 shadow-lg">
                                                <Check size={20} strokeWidth={4} />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Botón de Confirmación */}
                        <button 
                            disabled={processing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-[0.25em] py-5 rounded-[1.5rem] transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : (
                                <>
                                    Comenzar ahora
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Podrás cambiar tu foto después en la configuración de cuenta
                </p>
            </div>
        </div>
    );
}