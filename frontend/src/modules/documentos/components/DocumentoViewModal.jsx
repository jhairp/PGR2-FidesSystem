import { AnimatePresence, motion } from 'framer-motion'
import { X, Download, FileText } from 'lucide-react'
import documentoService from '../services/documentoService'

const TIPOS_LABEL = {
    partida_bautismo: 'Partida de Bautismo',
    cedula:           'Cédula de Identidad',
    certificado:      'Certificado',
    acta_matrimonio:  'Acta de Matrimonio',
    foto:             'Fotografía',
    otro:             'Otro',
}

const ESTADO_COLORS = {
    generado  : 'bg-slate-100 text-slate-500',
    pendiente : 'bg-amber-100 text-amber-700',
    aprobado  : 'bg-emerald-100 text-emerald-700',
    rechazado : 'bg-rose-100 text-rose-700',
}

export default function DocumentoViewModal({ show, onClose, documento }) {

    if (!documento) return null

    const fileUrl  = documentoService.getFileUrl(documento.url_doc)
    const previewUrl = documentoService.getPreviewUrl(documento.id_doc)
    const ext      = (documento.url_doc ?? '').split('.').pop().toLowerCase()
    const isImage  = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
    const isPdf    = ext === 'pdf'
    const isOffice = ['doc', 'docx'].includes(ext)

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
                        bg-black/60 backdrop-blur-sm
                        p-4
                    "
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="
                            relative w-full max-w-4xl h-[90vh]
                            bg-white dark:bg-[#0F172A]
                            rounded-[2.8rem]
                            overflow-hidden
                            border border-slate-200 dark:border-slate-800
                            shadow-[0_20px_100px_rgba(0,0,0,0.30)]
                            flex flex-col
                        "
                    >
                        {/* ── Header ── */}
                        <div className="
                            shrink-0 px-8 py-5
                            bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600
                            flex items-center justify-between
                        ">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                    <FileText size={18} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="
                                        text-white font-black uppercase tracking-widest text-sm truncate
                                    ">
                                        {documento.nom_doc}
                                    </h2>
                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                        {TIPOS_LABEL[documento.tipo_doc] ?? documento.tipo_doc}
                                        {documento.codigo_doc && ` · ${documento.codigo_doc}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {/* Estado badge */}
                                <span className={`
                                    px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                    ${ESTADO_COLORS[documento.estado_doc] ?? ESTADO_COLORS.generado}
                                `}>
                                    {documento.estado_doc}
                                </span>

                                {/* Descargar */}
                                <a
                                    href={fileUrl}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl
                                        flex items-center justify-center transition-all
                                    "
                                    title="Descargar"
                                >
                                    <Download size={16} className="text-white" />
                                </a>

                                {/* Cerrar */}
                                <button
                                    onClick={onClose}
                                    className="
                                        w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl
                                        flex items-center justify-center transition-all
                                    "
                                >
                                    <X size={18} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* ── Info sacramento ── */}
                        {documento.sacramento_tipo && (
                            <div className="
                                shrink-0 px-8 py-3
                                border-b border-slate-100 dark:border-slate-800
                                flex items-center gap-2
                                bg-slate-50 dark:bg-slate-900/40
                            ">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Sacramento:
                                </span>
                                <span className="text-[11px] font-bold text-indigo-500 uppercase">
                                    {documento.sacramento_tipo}
                                </span>
                                {documento.sacramento_fecha && (
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        · {documento.sacramento_fecha}
                                    </span>
                                )}
                                {documento.observacion_doc && (
                                    <span className="ml-auto text-[10px] text-amber-600 font-bold">
                                        ⚠ {documento.observacion_doc}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* ── Visor ── */}
                        <div className="flex-1 overflow-hidden bg-slate-100 dark:bg-slate-900">

                            {isPdf && (
                                <iframe
                                    src={previewUrl}
                                    title={documento.nom_doc}
                                    className="w-full h-full border-0"
                                />
                            )}

                            {isImage && (
                                <div className="w-full h-full flex items-center justify-center p-6">
                                    <img
                                        src={fileUrl}
                                        alt={documento.nom_doc}
                                        className="
                                            max-w-full max-h-full
                                            object-contain
                                            rounded-2xl
                                            shadow-xl
                                        "
                                    />
                                </div>
                            )}

                            {isOffice && (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                                    <FileText size={56} className="opacity-30" />
                                    <p className="text-sm font-bold uppercase tracking-widest">
                                        Vista previa no disponible para archivos Word
                                    </p>
                                    <a
                                        href={fileUrl}
                                        download
                                        className="
                                            flex items-center gap-2 px-6 py-3
                                            bg-indigo-600 hover:bg-indigo-700
                                            text-white text-[11px] font-black uppercase tracking-widest
                                            rounded-2xl transition-colors
                                        "
                                    >
                                        <Download size={14} /> Descargar para ver
                                    </a>
                                </div>
                            )}

                            {!isPdf && !isImage && !isOffice && (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                                    <FileText size={56} className="opacity-30" />
                                    <p className="text-sm font-bold uppercase tracking-widest">
                                        Formato no compatible con vista previa
                                    </p>
                                    <a
                                        href={fileUrl}
                                        download
                                        className="
                                            flex items-center gap-2 px-6 py-3
                                            bg-indigo-600 hover:bg-indigo-700
                                            text-white text-[11px] font-black uppercase tracking-widest
                                            rounded-2xl transition-colors
                                        "
                                    >
                                        <Download size={14} /> Descargar
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
