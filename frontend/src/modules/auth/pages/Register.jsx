import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { Cross, User, Mail, Lock, CreditCard, Phone, ArrowRight, Camera } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        nom_per: '',
        ap_pat_per: '',
        carnet_per: '',
        cel_per: '',
        correo_usu: '',
        password: '',
        password_confirmation: '',
        foto_usu: 'default.png', // Valor inicial por defecto
    });

    const avatars = [
        'default.png','corazon.jpg', 'cruz.jpg', 'dino.jpg', 'gato.jpg', 
        'jesus.jpg', 'jesus2.jpg', 'rosario.jpg', 
        'user_azul.jpg', 'user_shrek.jpg'
    ];

    const submit = (e) => {
        e.preventDefault();
        post(route('register.store'));
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F111A] flex items-center justify-center p-6">
            <Head title="Registro de Fieles" />
            
            <div className="w-full max-w-lg bg-white dark:bg-[#11141D] p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex w-12 h-12 bg-indigo-600 rounded-2xl items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/40">
                        <Cross size={24} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Únete a la Curia</h2>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Registro de Fieles</p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* --- SELECTOR DE AVATAR (NUEVO) --- */}
                    <div className="md:col-span-2 mb-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
                            Selecciona tu Identidad Visual
                        </label>
                        <div className="flex flex-col items-center gap-4 p-5 bg-slate-50 dark:bg-[#1A1F2B] rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                            {/* Previsualización del seleccionado */}
                            <div className="relative">
                                <div className="w-20 h-20 rounded-[1.8rem] bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md">
                                    <div className="w-full h-full rounded-[1.7rem] bg-white dark:bg-[#11141D] overflow-hidden">
                                        <img 
                                            src={`/backend/assets/images/perfil/${data.foto_usu}`} 
                                            className="w-full h-full object-cover"
                                            alt="Seleccionado"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                                    <Camera size={12} className="text-indigo-500" />
                                </div>
                            </div>

                            {/* Grid de opciones */}
                            <div className="grid grid-cols-5 gap-2">
                                {avatars.map((img) => (
                                    <button 
                                        key={img}
                                        type="button"
                                        onClick={() => setData('foto_usu', img)}
                                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 ${
                                            data.foto_usu === img 
                                            ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105' 
                                            : 'border-transparent opacity-40 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={`/backend/assets/images/perfil/${img}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Nombre */}
                    <div className="md:col-span-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre</label>
                        <input type="text" value={data.nom_per} onChange={e => setData('nom_per', e.target.value)} className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none rounded-2xl py-3 px-4 dark:text-white mt-1 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                        {errors.nom_per && <p className="text-rose-500 text-[10px] mt-1 ml-2">{errors.nom_per}</p>}
                    </div>

                    {/* Apellido */}
                    <div className="md:col-span-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Apellidos</label>
                        <input type="text" value={data.ap_pat_per} onChange={e => setData('ap_pat_per', e.target.value)} className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none rounded-2xl py-3 px-4 dark:text-white mt-1 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                        {errors.ap_pat_per && <p className="text-rose-500 text-[10px] mt-1 ml-2">{errors.ap_pat_per}</p>}
                    </div>

                    {/* Carnet */}
                    <div className="md:col-span-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Carnet / CI</label>
                        <input type="text" value={data.carnet_per} onChange={e => setData('carnet_per', e.target.value)} className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none rounded-2xl py-3 px-4 dark:text-white mt-1 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                        {errors.carnet_per && <p className="text-rose-500 text-[10px] mt-1 ml-2">{errors.carnet_per}</p>}
                    </div>

                    {/* Celular */}
                    <div className="md:col-span-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Celular</label>
                        <input type="text" value={data.cel_per} onChange={e => setData('cel_per', e.target.value)} className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none rounded-2xl py-3 px-4 dark:text-white mt-1 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                        {errors.cel_per && <p className="text-rose-500 text-[10px] mt-1 ml-2">{errors.cel_per}</p>}
                    </div>

                    {/* Email y Password (col-span-2) */}
                    <div className="md:col-span-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Correo Electrónico</label>
                        <input type="email" value={data.correo_usu} onChange={e => setData('correo_usu', e.target.value)} className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none rounded-2xl py-3 px-4 dark:text-white mt-1 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                        {errors.correo_usu && <p className="text-rose-500 text-[10px] mt-1 ml-2">{errors.correo_usu}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Contraseña</label>
                        <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none rounded-2xl py-3 px-4 dark:text-white mt-1 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                        {errors.password && <p className="text-rose-500 text-[10px] mt-1 ml-2">{errors.password}</p>}
                    </div>

                    <div className="md:col-span-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirmar</label>
                        <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none rounded-2xl py-3 px-4 dark:text-white mt-1 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                    </div>

                    <button disabled={processing} className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/30 mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
                        {processing ? 'Procesando...' : 'Crear mi Cuenta'} <ArrowRight size={14}/>
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[.2em]">
                            <span className="bg-white dark:bg-[#11141D] px-4 text-slate-400">O también puedes</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <a 
                            href={route('auth.google')} 
                            className="flex items-center justify-center gap-3 w-full p-4 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#1A1F2B] transition-all font-bold text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 group"
                        >
                            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4 group-hover:scale-110 transition-transform" alt="Google" />
                            Registrarme con Google
                        </a>

                        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                            ¿Ya tienes cuenta? {' '}
                            <Link href={route('login')} className="text-indigo-500 hover:underline">Inicia Sesión</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}