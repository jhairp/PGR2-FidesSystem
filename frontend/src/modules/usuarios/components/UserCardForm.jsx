import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Fingerprint, Smartphone, Shield, Edit3, Save } from 'lucide-react';

const InputField = ({ label, name, type = "text", icon: Icon, readOnly, value, onChange, error }) => (
    <div className="flex flex-col gap-0.5">
        <label className="text-[10px] font-black text-indigo-500/60 uppercase tracking-widest flex items-center gap-1.5">
            <Icon size={10} /> {label}
        </label>
        <input
            type={type}
            disabled={readOnly}
            value={value || ''}
            onChange={e => onChange(name, e.target.value)}
            autoComplete="off" 
            className={`w-full bg-transparent font-bold text-sm transition-all outline-none pb-1
                ${error ? 'text-red-500 border-b border-red-500' : 'text-slate-700 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 focus:border-indigo-500'}
                ${readOnly ? 'border-transparent cursor-default' : 'border-dashed'}`}
        />
        {error && <p className="text-[9px] text-red-500 font-bold uppercase italic mt-1">{error}</p>}
    </div>
);

// CORRECCIÓN: Se añade isViewOnly a las llaves de abajo
export default function UserCardForm({ data, setData, errors, roles, isEditing, submit, processing, isViewOnly }) {
    const [readOnly, setReadOnly] = useState(true);
    const lastValidFoto = useRef(data.foto_usu);

    useEffect(() => {
        setReadOnly(isEditing); 
    }, [isEditing, data.id_usu]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!readOnly && !processing) {
            submit(e);
        }
    };

    const getFotoUrl = () => {
        const defaultPath = '/backend/assets/images/perfil/default.png';
        const fotoActual = (data.foto_usu === 'default.png' && isEditing) ? lastValidFoto.current : data.foto_usu;
        if (!fotoActual || fotoActual === 'default.png') return defaultPath;
        return fotoActual.includes('http') ? fotoActual : `/backend/assets/images/perfil/${fotoActual.split('/').pop()}`;
    };

    return (
        <div className="w-full overflow-hidden shadow-2xl rounded-[2.5rem]">
            <div className="flex flex-col md:flex-row bg-white dark:bg-[#11141D] min-h-[420px]">
                
                {/* FRANJA IZQUIERDA - Cambia a violeta si es isViewOnly */}
                <div className={`w-full md:w-[280px] ${isViewOnly ? 'bg-violet-600' : 'bg-indigo-600'} p-8 flex flex-col items-center justify-between text-white relative transition-colors duration-500`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={120} strokeWidth={1} /></div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-lg font-black leading-none uppercase tracking-tighter text-white">SISTEMA</h2>
                        <p className="text-[10px] font-bold opacity-70 tracking-[0.2em] text-indigo-100">PARROQUIAL V2.0</p>
                    </div>
                    <div className="relative z-10 my-6">
                        <div className="w-32 h-40 bg-white rounded-lg shadow-2xl p-1 rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center overflow-hidden border border-slate-200">
                                <img src={getFotoUrl()} alt="Perfil" className="w-full h-full object-cover transition-opacity duration-300" onError={(e) => { e.target.src = '/backend/assets/images/perfil/default.png'; }} />
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 w-full text-center space-y-2">
                        <div className="bg-black/20 py-1 rounded-full border border-white/10">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white">
                                {isViewOnly ? 'EXPEDIENTE' : (data.id_usu ? `ID: ${data.id_usu}` : 'NUEVO REGISTRO')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CUERPO DEL CARNET */}
                <div className="flex-1 p-10 flex flex-col relative overflow-hidden bg-slate-50/50 dark:bg-[#11141D]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none text-slate-900 dark:text-white"><Shield size={350} /></div>

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="mb-8">
                            <h3 className={`text-2xl font-black ${isViewOnly ? 'text-violet-600' : 'text-slate-800'} dark:text-white tracking-tighter uppercase`}>
                                {isViewOnly ? 'Vista de Consulta' : (isEditing ? 'Expediente Personal' : 'Registro de Personal')}
                            </h3>
                            <div className={`w-16 h-1.5 ${isViewOnly ? 'bg-violet-500' : 'bg-indigo-500'} rounded-full mt-1`}></div>
                        </div>

                        <form id="user-form" onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-x-10 gap-y-6">
                            <InputField label="Nombres" name="nom_per" icon={User} readOnly={readOnly} value={data.nom_per} onChange={setData} error={errors.nom_per} />
                            <InputField label="Apellidos" name="ap_pat_per" icon={User} readOnly={readOnly} value={data.ap_pat_per} onChange={setData} error={errors.ap_pat_per} />
                            <InputField label="Documento CI" name="carnet_per" icon={Fingerprint} readOnly={readOnly} value={data.carnet_per} onChange={setData} error={errors.carnet_per} />
                            <InputField label="Correo" name="correo_usu" icon={Mail} type="email" readOnly={readOnly} value={data.correo_usu} onChange={setData} error={errors.correo_usu} />
                            <InputField label="Número de Celular" name="cel_per" icon={Smartphone} readOnly={readOnly} value={data.cel_per} onChange={setData} error={errors.cel_per} />

                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-indigo-500/60 uppercase tracking-widest flex items-center gap-1.5"><Shield size={10} /> Rol Asignado</label>
                                <select disabled={readOnly} value={data.id_rol_1 || ''} onChange={e => setData('id_rol_1', e.target.value)} className={`w-full bg-transparent font-bold text-sm outline-none pb-1 appearance-none ${readOnly ? 'text-slate-700 dark:text-slate-100 border-b border-transparent' : 'text-indigo-600 border-b border-dashed border-slate-300'}`}>
                                    <option value="" disabled>Seleccione un rol</option>
                                    {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nom_rol}</option>)}
                                </select>
                            </div>
                        </form>

                        <div className="mt-auto pt-10 flex items-center justify-between">
                            <div className="flex gap-4">
                                {readOnly ? (
                                    /* BOTÓN PARA ACTIVAR EDICIÓN */
                                    <button 
                                        type="button"  /* <--- CRUCIAL: evita que el formulario se envíe */
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setReadOnly(false);
                                        }} 
                                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2"
                                    >
                                        <Edit3 size={14} /> Editar Información
                                    </button>
                                ) : (
                                    /* BOTÓN PARA GUARDAR CAMBIOS */
                                    <button 
                                        key="save-button"
                                        form="user-form" 
                                        type="submit" 
                                        disabled={processing} 
                                        className="bg-emerald-500 text-white px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2"
                                    >
                                        {processing ? "Guardando..." : (isEditing ? "Actualizar Datos" : "Emitir Acceso")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}