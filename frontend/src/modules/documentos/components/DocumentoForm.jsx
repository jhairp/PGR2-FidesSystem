import { useState, useEffect, useRef } from 'react'
import { Upload, ChevronDown } from 'lucide-react'

const TIPOS = [
    { value: 'partida_bautismo', label: 'Partida de Bautismo' },
    { value: 'cedula',           label: 'Cédula de Identidad'  },
    { value: 'certificado',      label: 'Certificado'           },
    { value: 'acta_matrimonio',  label: 'Acta de Matrimonio'    },
    { value: 'foto',             label: 'Fotografía'            },
    { value: 'otro',             label: 'Otro'                  },
]

const inputCls = `
    w-full px-5 py-3.5
    rounded-2xl
    border border-slate-200 dark:border-slate-700
    bg-slate-50 dark:bg-slate-800/50
    text-slate-800 dark:text-white
    text-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    transition
    placeholder:text-slate-400
`

const labelCls = `
    text-[10px] font-black text-slate-500 dark:text-slate-400
    uppercase tracking-widest block mb-1.5
`

/**
 * @param {object}   initialData   — datos del documento a editar (null = crear)
 * @param {array}    sacramentos   — lista completa de sacramentos para el select
 * @param {function} onSubmit      — recibe un FormData
 * @param {boolean}  loading       — deshabilita el botón durante el guardado
 * @param {boolean}  isEdit        — modo edición (true) o creación (false)
 */
export default function DocumentoForm({
    initialData = null,
    sacramentos = [],
    onSubmit,
    loading = false,
    isEdit = false,
}) {

    const fileRef = useRef(null)
    const [drag, setDrag] = useState(false)
    const [archivo, setArchivo] = useState(null)

    const [form, setForm] = useState({
        nom_doc:  '',
        tipo_doc: '',
        desc_doc: '',
        id_sac_5: '',
    })

    // Rellena el formulario cuando se abre en modo edición
    useEffect(() => {
        if (initialData) {
            setForm({
                nom_doc:  initialData.nom_doc  ?? '',
                tipo_doc: initialData.tipo_doc ?? '',
                desc_doc: initialData.desc_doc ?? '',
                id_sac_5: initialData.id_sac_5_id != null ? String(initialData.id_sac_5_id) : '',
            })
        }
    }, [initialData])

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

    const handleFile = (file) => {
        if (!file) return
        setArchivo(file)
        if (!form.nom_doc) {
            setForm(f => ({ ...f, nom_doc: file.name.replace(/\.[^.]+$/, '') }))
        }
    }

    const handleDrop = (e) => {
        e.preventDefault(); setDrag(false)
        handleFile(e.dataTransfer.files[0])
    }

    const iconArchivo = (name = '') => {
        const ext = name.split('.').pop().toLowerCase()
        if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️'
        if (ext === 'pdf') return '📄'
        if (['doc', 'docx'].includes(ext)) return '📝'
        return '📎'
    }

    const handleSubmit = () => {
        if (!form.nom_doc || !form.tipo_doc) return
        if (!isEdit && !archivo) return          // en creación el archivo es obligatorio

        const fd = new FormData()
        if (archivo) fd.append('archivo', archivo)
        fd.append('nom_doc',  form.nom_doc.trim())
        fd.append('tipo_doc', form.tipo_doc)
        fd.append('desc_doc', form.desc_doc.trim())
        if (form.id_sac_5) fd.append('id_sac_5', form.id_sac_5)
        onSubmit(fd)
    }

    const canSubmit = form.nom_doc && form.tipo_doc && (isEdit || archivo)

    return (
        <div className="space-y-5">

            {/* ── Drop zone (obligatoria en creación, opcional en edición) ── */}
            <div>
                <label className={labelCls}>
                    {isEdit ? 'Reemplazar archivo (opcional)' : 'Archivo *'}
                </label>
                <div
                    onDragOver={e => { e.preventDefault(); setDrag(true) }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current.click()}
                    className={`
                        cursor-pointer rounded-2xl border-2 border-dashed p-6
                        flex flex-col items-center gap-2 transition-all
                        ${drag
                            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                        }
                    `}
                >
                    <input
                        ref={fileRef} type="file" className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={e => handleFile(e.target.files[0])}
                    />
                    {archivo ? (
                        <>
                            <span className="text-3xl">{iconArchivo(archivo.name)}</span>
                            <p className="font-bold text-slate-700 dark:text-slate-200 text-sm text-center break-all">
                                {archivo.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                                {(archivo.size / 1024).toFixed(1)} KB
                            </p>
                        </>
                    ) : isEdit && initialData?.url_doc ? (
                        <>
                            <span className="text-3xl">{iconArchivo(initialData.url_doc)}</span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                                Archivo actual: <strong>{initialData.url_doc.split('/').pop()}</strong>
                            </p>
                            <p className="text-[10px] text-slate-400">
                                Haz clic para reemplazarlo
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                                <Upload size={20} />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                                Arrastra un archivo o <span className="text-indigo-500 font-bold">selecciona uno</span>
                            </p>
                            <p className="text-[10px] text-slate-400">PDF · JPG · PNG · DOC · máx. 10 MB</p>
                        </>
                    )}
                </div>
            </div>

            {/* ── Nombre ── */}
            <div>
                <label className={labelCls}>Nombre del documento *</label>
                <input
                    type="text"
                    value={form.nom_doc}
                    onChange={set('nom_doc')}
                    placeholder="Ej. Partida de bautismo de María"
                    className={inputCls}
                />
            </div>

            {/* ── Tipo ── */}
            <div>
                <label className={labelCls}>Tipo de documento *</label>
                <div className="relative">
                    <select
                        value={form.tipo_doc}
                        onChange={set('tipo_doc')}
                        className={inputCls + ' appearance-none pr-10'}
                    >
                        <option value="">Selecciona un tipo…</option>
                        {TIPOS.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* ── Sacramento — select con datos reales ── */}
            <div>
                <label className={labelCls}>Sacramento relacionado (opcional)</label>
                <div className="relative">
                    <select
                        value={form.id_sac_5}
                        onChange={set('id_sac_5')}
                        className={inputCls + ' appearance-none pr-10'}
                    >
                        <option value="">Sin sacramento asociado</option>
                        {sacramentos.map(s => (
                            <option key={s.id_sac} value={s.id_sac}>
                                #{s.id_sac} · {s.tipo_sac} — {s.bautizado ?? s.fecha_sac}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {sacramentos.length === 0 && (
                    <p className="text-[10px] text-slate-400 mt-1 ml-1">
                        Cargando sacramentos…
                    </p>
                )}
            </div>

            {/* ── Descripción ── */}
            <div>
                <label className={labelCls}>Descripción (opcional)</label>
                <input
                    type="text"
                    value={form.desc_doc}
                    onChange={set('desc_doc')}
                    placeholder="Descripción breve del documento…"
                    className={inputCls}
                />
            </div>

            {/* ── Botón ── */}
            <button
                onClick={handleSubmit}
                disabled={loading || !canSubmit}
                className="
                    w-full py-4
                    bg-indigo-600 hover:bg-indigo-700
                    disabled:opacity-50 disabled:cursor-not-allowed
                    text-white text-[11px] font-black uppercase tracking-widest
                    rounded-2xl transition-colors
                    shadow-lg shadow-indigo-500/20
                    flex items-center justify-center gap-2
                "
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Guardando…
                    </>
                ) : (
                    <><Upload size={15} /> {isEdit ? 'Guardar cambios' : 'Subir documento'}</>
                )}
            </button>
        </div>
    )
}
