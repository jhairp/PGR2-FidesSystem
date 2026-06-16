import React, { useState, useRef } from 'react'
import {
    Upload,
    FileText,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    ChevronDown,
    Download,
    X,
    Search,
} from 'lucide-react'

import { useDocumentos } from '../hooks/useDocumentos'
import documentoService from '../services/documentoService'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIPOS = [
    { value: 'partida_bautismo', label: 'Partida de Bautismo' },
    { value: 'cedula',           label: 'Cédula de Identidad'  },
    { value: 'certificado',      label: 'Certificado'           },
    { value: 'acta_matrimonio',  label: 'Acta de Matrimonio'    },
    { value: 'foto',             label: 'Fotografía'            },
    { value: 'otro',             label: 'Otro'                  },
]

const ESTADOS = {
    generado  : { label: 'Generado',  color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300', icon: <Clock size={12} /> },
    pendiente : { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', icon: <AlertCircle size={12} /> },
    aprobado  : { label: 'Aprobado',  color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', icon: <CheckCircle size={12} /> },
    rechazado : { label: 'Rechazado', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400', icon: <XCircle size={12} /> },
}

const estadoBadge = (estado) => {
    const cfg = ESTADOS[estado] ?? ESTADOS.generado
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>
            {cfg.icon} {cfg.label}
        </span>
    )
}

const iconArchivo = (url = '') => {
    const ext = url.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️'
    if (ext === 'pdf') return '📄'
    if (['doc', 'docx'].includes(ext)) return '📝'
    return '📎'
}

// ─── Modal de subida ──────────────────────────────────────────────────────────

function UploadModal({ onClose, onSubmit, uploading }) {
    const fileRef = useRef(null)
    const [form, setForm]     = useState({ nom_doc: '', tipo_doc: '', desc_doc: '', id_sac_5: '' })
    const [archivo, setArchivo] = useState(null)
    const [drag, setDrag]     = useState(false)

    const handleFile = (file) => {
        if (!file) return
        setArchivo(file)
        if (!form.nom_doc) setForm(f => ({ ...f, nom_doc: file.name.replace(/\.[^.]+$/, '') }))
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDrag(false)
        handleFile(e.dataTransfer.files[0])
    }

    const handleSubmit = () => {
        if (!archivo || !form.nom_doc || !form.tipo_doc) return
        const fd = new FormData()
        fd.append('archivo',  archivo)
        fd.append('nom_doc',  form.nom_doc)
        fd.append('tipo_doc', form.tipo_doc)
        fd.append('desc_doc', form.desc_doc)
        if (form.id_sac_5) fd.append('id_sac_5', form.id_sac_5)
        onSubmit(fd)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#11141D] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <Upload size={18} />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-widest">Subir Documento</h2>
                            <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG, DOC · Máx. 10 MB</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4">

                    {/* Drop zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDrag(true) }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current.click()}
                        className={`
                            relative cursor-pointer rounded-2xl border-2 border-dashed p-8
                            flex flex-col items-center gap-3 transition-all
                            ${drag
                                ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                            }
                        `}
                    >
                        <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={e => handleFile(e.target.files[0])} />

                        {archivo ? (
                            <>
                                <div className="text-4xl">{iconArchivo(archivo.name)}</div>
                                <p className="font-bold text-slate-700 dark:text-slate-200 text-sm text-center break-all">{archivo.name}</p>
                                <p className="text-[11px] text-slate-400">{(archivo.size / 1024).toFixed(1)} KB</p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                                    <Upload size={22} />
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                                    Arrastra un archivo aquí o <span className="text-indigo-500 font-bold">haz clic para seleccionar</span>
                                </p>
                            </>
                        )}
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                            Nombre del documento *
                        </label>
                        <input
                            type="text"
                            value={form.nom_doc}
                            onChange={e => setForm(f => ({ ...f, nom_doc: e.target.value }))}
                            placeholder="Ej. Partida de bautismo de Juan"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    {/* Tipo */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                            Tipo de documento *
                        </label>
                        <div className="relative">
                            <select
                                value={form.tipo_doc}
                                onChange={e => setForm(f => ({ ...f, tipo_doc: e.target.value }))}
                                className="w-full appearance-none px-4 py-3 pr-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            >
                                <option value="">Selecciona un tipo…</option>
                                {TIPOS.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                            Descripción (opcional)
                        </label>
                        <input
                            type="text"
                            value={form.desc_doc}
                            onChange={e => setForm(f => ({ ...f, desc_doc: e.target.value }))}
                            placeholder="Descripción breve…"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    {/* ID Sacramento */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1.5">
                            ID del Sacramento (opcional)
                        </label>
                        <input
                            type="number"
                            value={form.id_sac_5}
                            onChange={e => setForm(f => ({ ...f, id_sac_5: e.target.value }))}
                            placeholder="Ej. 3"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 pt-0">
                    <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={uploading || !archivo || !form.nom_doc || !form.tipo_doc}
                        className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Subiendo…
                            </>
                        ) : (
                            <><Upload size={14} /> Subir Documento</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function DocumentosIndex() {
    const {
        documentos, loading, uploading, error, success,
        subirDocumento, cambiarEstado, eliminarDocumento, clearMessages,
    } = useDocumentos()

    const [showUpload, setShowUpload]   = useState(false)
    const [busqueda,   setBusqueda]     = useState('')
    const [filtroEstado, setFiltroEstado] = useState('')
    const [confirmarElim, setConfirmarElim] = useState(null)

    // Filtros locales
    const filtrados = documentos.filter(d => {
        const coincide = d.nom_doc.toLowerCase().includes(busqueda.toLowerCase()) ||
                         d.tipo_doc.toLowerCase().includes(busqueda.toLowerCase()) ||
                         (d.codigo_doc ?? '').toLowerCase().includes(busqueda.toLowerCase())
        const estado   = filtroEstado ? d.estado_doc === filtroEstado : true
        return coincide && estado
    })

    const handleUpload = async (fd) => {
        try {
            await subirDocumento(fd)
            setShowUpload(false)
        } catch {
            // El hook ya maneja el error
        }
    }

    const handleEliminar = async (id) => {
        await eliminarDocumento(id)
        setConfirmarElim(null)
    }

    return (
        <div className="space-y-6">

            {/* ── Cabecera ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                        Documentos
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5 tracking-wide">
                        Gestión de documentos sacramentales
                    </p>
                </div>
                <button
                    onClick={() => { clearMessages(); setShowUpload(true) }}
                    className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-500/25 transition-all"
                >
                    <Upload size={15} />
                    Subir Documento
                </button>
            </div>

            {/* ── Alertas ── */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-400 text-sm">
                    <XCircle size={16} className="shrink-0" />
                    {error}
                    <button onClick={clearMessages} className="ml-auto"><X size={14} /></button>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm">
                    <CheckCircle size={16} className="shrink-0" />
                    {success}
                    <button onClick={clearMessages} className="ml-auto"><X size={14} /></button>
                </div>
            )}

            {/* ── Controles de búsqueda / filtro ── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, tipo o código…"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>
                <div className="relative">
                    <select
                        value={filtroEstado}
                        onChange={e => setFiltroEstado(e.target.value)}
                        className="appearance-none pl-4 pr-9 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    >
                        <option value="">Todos los estados</option>
                        {Object.entries(ESTADOS).map(([val, cfg]) => (
                            <option key={val} value={val}>{cfg.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* ── Tabla / Cards ── */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            ) : filtrados.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-slate-400">
                    <FileText size={40} className="opacity-30" />
                    <p className="text-sm font-bold uppercase tracking-widest">Sin documentos</p>
                    <p className="text-xs">Sube el primer documento usando el botón de arriba.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtrados.map(doc => (
                        <div key={doc.id_doc}
                            className="bg-white dark:bg-[#11141D] border border-slate-100 dark:border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow"
                        >
                            {/* Icono tipo */}
                            <div className="text-3xl w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl shrink-0">
                                {iconArchivo(doc.url_doc)}
                            </div>

                            {/* Info principal */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="font-black text-slate-800 dark:text-white text-sm truncate">{doc.nom_doc}</span>
                                    {estadoBadge(doc.estado_doc)}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-slate-400">
                                    <span>{TIPOS.find(t => t.value === doc.tipo_doc)?.label ?? doc.tipo_doc}</span>
                                    {doc.codigo_doc && <span className="font-mono">{doc.codigo_doc}</span>}
                                    {doc.sacramento_tipo && (
                                        <span>
                                            Sacramento: <strong className="text-slate-500 dark:text-slate-300">{doc.sacramento_tipo}</strong>
                                            {doc.sacramento_fecha && ` · ${doc.sacramento_fecha}`}
                                        </span>
                                    )}
                                    {doc.desc_doc && <span className="italic">{doc.desc_doc}</span>}
                                </div>
                                {doc.observacion_doc && (
                                    <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                                        ⚠ {doc.observacion_doc}
                                    </p>
                                )}
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-2 shrink-0">

                                {/* Descargar */}
                                <a
                                    href={documentoService.getFileUrl(doc.url_doc)}
                                    target="_blank"
                                    rel="noreferrer"
                                    title="Ver / Descargar"
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors"
                                >
                                    <Download size={15} />
                                </a>

                                {/* Cambiar estado */}
                                <div className="relative group">
                                    <button
                                        title="Cambiar estado"
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 transition-colors"
                                    >
                                        <Eye size={15} />
                                    </button>
                                    {/* Mini dropdown de estados */}
                                    <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#1a1e2d] border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-10 overflow-hidden hidden group-hover:block">
                                        {Object.entries(ESTADOS).map(([val, cfg]) => (
                                            <button
                                                key={val}
                                                onClick={() => cambiarEstado(doc.id_doc, val)}
                                                className={`w-full flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors
                                                    ${doc.estado_doc === val ? 'text-indigo-600' : 'text-slate-500 dark:text-slate-400'}`}
                                            >
                                                {cfg.icon} {cfg.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Eliminar */}
                                <button
                                    onClick={() => setConfirmarElim(doc.id_doc)}
                                    title="Eliminar"
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 transition-colors"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Modal de subida ── */}
            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    onSubmit={handleUpload}
                    uploading={uploading}
                />
            )}

            {/* ── Confirm eliminar ── */}
            {confirmarElim && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#11141D] rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-5">
                        <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 dark:text-white text-base uppercase tracking-widest">¿Eliminar documento?</h3>
                            <p className="text-xs text-slate-400 mt-1">Esta acción no se puede deshacer. El archivo también se eliminará del servidor.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmarElim(null)} className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={() => handleEliminar(confirmarElim)} className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-rose-500/20">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
