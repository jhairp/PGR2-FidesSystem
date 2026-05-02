import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Cross, CreditCard, Phone, CheckCircle } from 'lucide-react';

export default function CompletaDatosGoogle({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        carnet_per: '',
        cel_per: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('auth.guardar.google'));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F111A] flex items-center justify-center p-6">
            <Head title="Completar Registro" />
            
            <div className="w-full max-w-md bg-white dark:bg-[#11141D] p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex w-12 h-12 bg-indigo-600 rounded-2xl items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/20">
                        <Cross size={24} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">
                        Hola, {user.nombre}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
                        Solo un paso más para finalizar
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Carnet */}
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">
                            Documento de Identidad (CI)
                        </label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={data.carnet_per} 
                                onChange={e => setData('carnet_per', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl py-3 pl-12 dark:text-white"
                                placeholder="Ingresa tu carnet"
                                required
                            />
                        </div>
                        {errors.carnet_per && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.carnet_per}</p>}
                    </div>

                    {/* Celular */}
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">
                            Número de Celular
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={data.cel_per} 
                                onChange={e => setData('cel_per', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl py-3 pl-12 dark:text-white"
                                placeholder="Ej: 78901234"
                                required
                            />
                        </div>
                        {errors.cel_per && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.cel_per}</p>}
                    </div>

                    <button 
                        disabled={processing} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 group"
                    >
                        {processing ? 'Guardando...' : (
                            <>
                                Finalizar Registro
                                <CheckCircle size={16} className="group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}