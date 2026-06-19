import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShieldCheck } from 'lucide-react'

const ESTADOS = [
    { value: 'generado',  label: 'Generado',  color: 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400' },
    { value: 'pendiente', label: 'Pendiente', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400' },
    { value: 'aprobado',  label: 'Aprobado',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-500' },
    { value: 'rechazado', label: 'Rechazado', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-500' },
]

export default function DocumentoEstadoModal({
    show,
    onClose,
    onSubmit,
    loading,
    documento,
}) {

    const [estado,      setEstado]      = useState('')
    const [observacion, setObservacion] = useState('')

    useEffect(() => {
        if (documento) {
            setEstado(documento.estado_doc ?? '')
            setObservacion(documento.observacion_doc ?? '')
        }
    }, [documento])

    if (!documento) return null

    const handleSubmit = () => {
        if (!estado) return
        onSubmit(documento, estado, observacion)
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="
                        fixed inset-0 z-[9999]
                        flex items-center justify-center
                        bg-black/50 backdrop-blur-sm
                        p-6
                    "
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="
                            relative w-full max-w-md
                            bg-white dark:bg-[#0F172A]
                            rounded-[2.8rem]
                            overflow-hidden
                            border border-slate-200 dark:border-slate-800
                            shadow-[0_20px_80px_rgba(0,0,0,0.20)]
                        "
                    >
                        {/* Cerrar */}
                        <button
                            onClick={onClose}
                            className="
                                absolute top-6 right-6 z-50
                                w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20
                                flex items-center justify-center transition-all
                            "
                        >
                            <X size={18} className="text-white" />
                        </button>

                        {/* Header */}
                        <div className="
                            px-10 py-7
                            bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700
                        ">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={22} className="text-white/80" />
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-widest">
                                        Cambiar Estado
                                    </h2>
                                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-0.5 truncate">
                                        {documento.nom_doc}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="px-10 py-8 space-y-6">

                            {/* Opciones de estado */}
                            <div>
                                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                                    Selecciona el nuevo estado
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {ESTADOS.map(e => (
                                        <button
                                            key={e.value}
                                            onClick={() => setEstado(e.value)}
                                            className={`
                                                py-3 px-4 rounded-2xl border-2 transition-all
                                                text-[11px] font-black uppercase tracking-widest
                                                ${e.color}
                                                ${estado === e.value
                                                    ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105 shadow-md'
                                                    : 'opacity-70 hover:opacity-100'
                                                }
                                            `}
                                        >
                                            {e.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Observación */}
                            <div>
                                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                                    Observación (opcional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={observacion}
                                    onChange={e => setObservacion(e.target.value)}
                                    placeholder="Motivo del cambio de estado…"
                                    className="
                                        w-full px-5 py-3 rounded-2xl resize-none
                                        border border-slate-200 dark:border-slate-700
                                        bg-slate-50 dark:bg-slate-800/50
                                        text-slate-800 dark:text-white text-sm
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                                        transition placeholder:text-slate-400
                                    "
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="
                                        flex-1 py-3.5 rounded-2xl
                                        border border-slate-200 dark:border-slate-700
                                        text-slate-500 dark:text-slate-400
                                        text-[11px] font-black uppercase tracking-widest
                                        hover:bg-slate-50 dark:hover:bg-slate-800
                                        transition-colors
                                    "
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !estado}
                                    className="
                                        flex-1 py-3.5 rounded-2xl
                                        bg-indigo-600 hover:bg-indigo-700
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        text-white text-[11px] font-black uppercase tracking-widest
                                        transition-colors shadow-lg shadow-indigo-500/20
                                        flex items-center justify-center gap-2
                                    "
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <ShieldCheck size={14} />
                                    )}
                                    {loading ? 'Guardando…' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
