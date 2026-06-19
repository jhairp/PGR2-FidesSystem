import { AnimatePresence, motion } from 'framer-motion'
import { Trash2, X } from 'lucide-react'

export default function DocumentoDeleteConfirm({ show, onClose, onConfirm }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="
                            bg-white dark:bg-[#0F172A]
                            rounded-[2.5rem] p-10
                            w-full max-w-sm text-center
                            border border-slate-100 dark:border-slate-800
                            shadow-2xl
                        "
                    >
                        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
                            <Trash2 size={28} />
                        </div>
                        <h3 className="font-black text-slate-800 dark:text-white text-lg uppercase tracking-tighter mb-2">
                            ¿Eliminar documento?
                        </h3>
                        <p className="text-xs text-slate-400 mb-8 leading-relaxed">
                            Esta acción no se puede deshacer. El archivo también se eliminará del servidor.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black uppercase tracking-widest transition shadow-lg shadow-rose-500/20"
                            >
                                Eliminar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
