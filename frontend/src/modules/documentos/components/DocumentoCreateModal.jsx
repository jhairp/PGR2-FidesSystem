import { AnimatePresence, motion } from 'framer-motion'
import { X, FolderOpen } from 'lucide-react'
import DocumentoForm from './DocumentoForm'

export default function DocumentoCreateModal({
    show,
    onClose,
    onSubmit,
    loading,
    sacramentos,
}) {

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
                        transition={{ duration: 0.25 }}
                        className="
                            relative w-full max-w-xl
                            bg-white dark:bg-[#0F172A]
                            rounded-[2.8rem]
                            overflow-hidden
                            border border-slate-200 dark:border-slate-800
                            shadow-[0_20px_100px_rgba(0,0,0,0.22)]
                        "
                    >
                        {/* Cerrar */}
                        <button
                            onClick={onClose}
                            className="
                                absolute top-6 right-6 z-50
                                w-10 h-10 rounded-2xl
                                bg-white/10 hover:bg-white/20
                                flex items-center justify-center transition-all
                            "
                        >
                            <X size={20} className="text-white" />
                        </button>

                        {/* Header */}
                        <div className="
                            px-10 py-7
                            bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500
                        ">
                            <div className="flex items-center gap-3">
                                <FolderOpen size={22} className="text-white/80" />
                                <h1 className="
                                    text-2xl font-black uppercase tracking-[0.15em] text-white
                                ">
                                    Subir Documento
                                </h1>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="px-10 py-8 max-h-[75vh] overflow-y-auto">
                            <DocumentoForm
                                sacramentos={sacramentos}
                                onSubmit={onSubmit}
                                loading={loading}
                                isEdit={false}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
