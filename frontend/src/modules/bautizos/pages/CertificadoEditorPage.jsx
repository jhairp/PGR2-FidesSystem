import { useEffect, useMemo, useRef, useState } from 'react'
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Copy,
    ImagePlus,
    Layers,
    MousePointer2,
    Plus,
    Save,
    Trash2,
    Type,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import certificadoService from '../services/certificadoService'

const FONT_OPTIONS = [
    'Georgia, Times New Roman, serif',
    'Arial, Helvetica, sans-serif',
    'Times New Roman, Times, serif',
    'Verdana, Geneva, sans-serif',
    'Courier New, Courier, monospace',
]

const newId = (prefix) => `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`

const defaultText = {
    type: 'text',
    content: 'Nuevo texto',
    x: 96,
    y: 96,
    width: 220,
    height: 40,
    fontSize: 16,
    fontFamily: FONT_OPTIONS[0],
    fontWeight: '700',
    color: '#111111',
    backgroundColor: 'transparent',
    textAlign: 'left',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
}

export default function CertificadoEditorPage() {

    const navigate = useNavigate()
    const canvasRef = useRef(null)
    const fileRef = useRef(null)

    const [template, setTemplate] = useState(null)
    const [fields, setFields] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [drag, setDrag] = useState(null)
    const [resize, setResize] = useState(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [zoom, setZoom] = useState(0.72)

    const selected = useMemo(
        () => template?.elements.find(element => element.id === selectedId) ?? null,
        [template, selectedId]
    )

    useEffect(() => {
        let active = true

        certificadoService.getTemplate().then(data => {
            if (!active) return
            setTemplate(data.template)
            setFields(data.fields)
            setSelectedId(data.template.elements[0]?.id ?? null)
        })

        return () => {
            active = false
        }
    }, [])

    const updateTemplate = (updater) => {
        setTemplate(current => {
            if (!current) return current
            return updater(current)
        })
    }

    const updateSelected = (changes) => {
        if (!selected) return

        updateTemplate(current => ({
            ...current,
            elements: current.elements.map(element =>
                element.id === selected.id
                    ? { ...element, ...changes }
                    : element
            ),
        }))
    }

    const addText = () => {
        const element = {
            ...defaultText,
            id: newId('text'),
        }

        updateTemplate(current => ({
            ...current,
            elements: [...current.elements, element],
        }))
        setSelectedId(element.id)
    }

    const addField = (field) => {
        const element = {
            ...defaultText,
            id: newId('field'),
            type: 'field',
            field: field.value,
            label: `${field.label}:`,
            content: '',
            width: 300,
            height: 34,
        }

        updateTemplate(current => ({
            ...current,
            elements: [...current.elements, element],
        }))
        setSelectedId(element.id)
    }

    const duplicateSelected = () => {
        if (!selected) return

        const element = {
            ...selected,
            id: newId(selected.type),
            x: selected.x + 20,
            y: selected.y + 20,
        }

        updateTemplate(current => ({
            ...current,
            elements: [...current.elements, element],
        }))
        setSelectedId(element.id)
    }

    const deleteSelected = () => {
        if (!selected) return

        updateTemplate(current => ({
            ...current,
            elements: current.elements.filter(element => element.id !== selected.id),
        }))
        setSelectedId(null)
    }

    const uploadImage = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        const data = await certificadoService.uploadImage(file)
        const element = {
            id: newId('image'),
            type: 'image',
            src: data.url,
            x: 120,
            y: 120,
            width: 180,
            height: 120,
            objectFit: 'contain',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 0,
            backgroundColor: 'transparent',
        }

        updateTemplate(current => ({
            ...current,
            elements: [...current.elements, element],
        }))
        setSelectedId(element.id)
        event.target.value = ''
    }

    const save = async () => {
        if (!template) return

        try {
            setSaving(true)
            await certificadoService.saveTemplate(template)
            setMessage('Plantilla guardada correctamente')
            setTimeout(() => navigate('/bautizos'), 500)
        } catch (error) {
            console.error(error)
            setMessage('No se pudo guardar la plantilla')
        } finally {
            setSaving(false)
            setTimeout(() => setMessage(''), 2500)
        }
    }

    const getCanvasPoint = (event) => {
        const rect = canvasRef.current.getBoundingClientRect()
        return {
            x: (event.clientX - rect.left) / zoom,
            y: (event.clientY - rect.top) / zoom,
        }
    }

    const startDrag = (event, element) => {
        event.stopPropagation()
        setSelectedId(element.id)

        const point = getCanvasPoint(event)
        setDrag({
            id: element.id,
            offsetX: point.x - element.x,
            offsetY: point.y - element.y,
        })
    }

    const startResize = (event, element) => {
        event.stopPropagation()
        setSelectedId(element.id)

        const point = getCanvasPoint(event)
        setResize({
            id: element.id,
            startX: point.x,
            startY: point.y,
            width: element.width,
            height: element.height,
        })
    }

    const moveDrag = (event) => {
        if (resize) {
            const point = getCanvasPoint(event)

            updateTemplate(current => ({
                ...current,
                elements: current.elements.map(element =>
                    element.id === resize.id
                        ? {
                            ...element,
                            width: Math.max(24, Math.round(resize.width + point.x - resize.startX)),
                            height: Math.max(18, Math.round(resize.height + point.y - resize.startY)),
                        }
                        : element
                ),
            }))
            return
        }

        if (!drag) return

        const point = getCanvasPoint(event)
        updateTemplate(current => ({
            ...current,
            elements: current.elements.map(element =>
                element.id === drag.id
                    ? {
                        ...element,
                        x: Math.round(point.x - drag.offsetX),
                        y: Math.round(point.y - drag.offsetY),
                    }
                    : element
            ),
        }))
    }

    const updatePage = (changes) => {
        updateTemplate(current => ({
            ...current,
            page: {
                ...current.page,
                ...changes,
            },
        }))
    }

    const renderContent = (element) => {
        if (element.type === 'image') {
            return (
                <img
                    src={certificadoService.getAssetUrl(element.src)}
                    alt=""
                    className="w-full h-full pointer-events-none"
                    style={{ objectFit: element.objectFit ?? 'contain' }}
                />
            )
        }

        const field = fields.find(item => item.value === element.field)
        const text = element.type === 'field'
            ? `${element.label ?? ''} ${field?.label ?? element.field}`
            : element.content

        return text
    }

    const elementStyle = (element) => {
        const borderWidth = Number(element.borderWidth ?? 0)
        const isImage = element.type === 'image'

        return {
            left: element.x,
            top: element.y,
            width: element.width,
            height: isImage ? element.height : 'auto',
            minHeight: isImage ? undefined : element.height,
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
            fontWeight: element.fontWeight,
            color: element.color,
            backgroundColor: element.backgroundColor,
            textAlign: element.textAlign,
            borderColor: borderWidth > 0 ? element.borderColor : 'transparent',
            borderWidth,
            borderRadius: element.borderRadius,
            borderStyle: borderWidth > 0 ? 'solid' : 'none',
            boxShadow: getLineShadow(element),
            padding: 2,
            lineHeight: 1.25,
            whiteSpace: 'pre-wrap',
            overflow: isImage ? 'hidden' : 'visible',
        }
    }

    if (!template) {
        return <div className="p-8 text-slate-500">Cargando editor...</div>
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#0B1020]">
            <div className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#11141D]/95 backdrop-blur px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div>
                    <h1 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">
                        Editor de Certificado
                    </h1>
                    <p className="text-xs text-slate-400 font-bold">
                        Disena la plantilla del certificado de bautizo
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {message && (
                        <span className="text-xs font-bold text-emerald-600">
                            {message}
                        </span>
                    )}
                    <button
                        onClick={save}
                        disabled={saving}
                        className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2"
                    >
                        <Save size={16} />
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_320px] gap-0">
                <aside className="max-h-none xl:h-[calc(100vh-73px)] overflow-y-auto border-b xl:border-b-0 xl:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11141D] p-5">
                    <PanelTitle icon={Plus} title="Elementos libres" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2 mb-6">
                        <button
                            onClick={addText}
                            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2"
                        >
                            <Type size={15} />
                            Texto libre
                        </button>
                        <button
                            onClick={() => fileRef.current.click()}
                            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2"
                        >
                            <ImagePlus size={15} />
                            Imagen
                        </button>
                    </div>

                    <input
                        ref={fileRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={uploadImage}
                    />

                    <PanelTitle icon={Layers} title="Respuestas de la base de datos" />
                    <div className="space-y-2 mb-6">
                        {fields.map(field => (
                            <button
                                key={field.value}
                                onClick={() => addField(field)}
                                className="w-full text-left px-3 py-2 rounded-lg border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-xs font-bold text-indigo-700 dark:text-indigo-300"
                            >
                                <span className="block text-[9px] uppercase tracking-widest text-indigo-400">Dato BD</span>
                                {field.label}
                            </button>
                        ))}
                    </div>

                    <PanelTitle icon={MousePointer2} title="En el certificado" />
                    <div className="space-y-2">
                        {template.elements.map(element => (
                            <button
                                key={element.id}
                                onClick={() => setSelectedId(element.id)}
                                className={`
                                    w-full text-left px-3 py-2 rounded-lg border text-xs font-bold
                                    ${selectedId === element.id
                                        ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                                    }
                                `}
                            >
                                <span className="block text-[9px] uppercase tracking-widest text-slate-400">
                                    {getElementKind(element)}
                                </span>
                                {getElementName(element, fields)}
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="min-h-[70vh] xl:h-[calc(100vh-73px)] overflow-auto p-4 sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <MousePointer2 size={15} />
                            Arrastra los elementos para acomodarlos
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">Zoom</span>
                            <input
                                type="range"
                                min="0.45"
                                max="1"
                                step="0.05"
                                value={zoom}
                                onChange={event => setZoom(Number(event.target.value))}
                            />
                        </div>
                    </div>

                    <div
                        className="mx-auto"
                        style={{
                            width: template.page.width * zoom,
                            height: template.page.height * zoom,
                        }}
                    >
                        <div
                            ref={canvasRef}
                            onMouseMove={moveDrag}
                            onMouseUp={() => { setDrag(null); setResize(null) }}
                            onMouseLeave={() => { setDrag(null); setResize(null) }}
                            onMouseDown={() => setSelectedId(null)}
                            className="relative origin-top-left shadow-2xl bg-white overflow-hidden"
                            style={{
                                width: template.page.width,
                                height: template.page.height,
                                transform: `scale(${zoom})`,
                                backgroundColor: template.page.backgroundColor,
                                border: `2px solid ${template.page.borderColor}`,
                            }}
                        >
                            <div
                                className="absolute pointer-events-none"
                                style={{
                                    inset: 24,
                                    border: `1px solid ${template.page.borderColor}`,
                                }}
                            />

                            {template.elements.map(element => (
                                <div
                                    key={element.id}
                                    onMouseDown={event => startDrag(event, element)}
                                    className={`
                                        absolute cursor-move
                                        ${element.type === 'image' ? 'overflow-hidden' : 'overflow-visible'}
                                        ${selectedId === element.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                                    `}
                                    style={elementStyle(element)}
                                >
                                    {selectedId === element.id && (
                                        <span
                                            className={`
                                                absolute left-0 -top-6
                                                px-2 py-1 rounded-md
                                                text-[9px] font-black uppercase tracking-widest
                                                text-white shadow pointer-events-none
                                                ${element.type === 'field'
                                                    ? 'bg-indigo-600'
                                                    : element.type === 'image'
                                                        ? 'bg-emerald-600'
                                                        : 'bg-slate-700'
                                                }
                                            `}
                                        >
                                            {getElementKind(element)}
                                        </span>
                                    )}
                                    {renderContent(element)}
                                    {selectedId === element.id && (
                                        <button
                                            type="button"
                                            onMouseDown={event => startResize(event, element)}
                                            className="
                                                absolute -right-2 -bottom-2
                                                w-4 h-4
                                                rounded-full
                                                border-2 border-white
                                                bg-indigo-600
                                                shadow
                                                cursor-nwse-resize
                                            "
                                            title="Cambiar tamano"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                <aside className="max-h-none xl:h-[calc(100vh-73px)] overflow-y-auto border-t xl:border-t-0 xl:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11141D] p-5">
                    <PanelTitle icon={MousePointer2} title="Propiedades" />

                    {!selected && (
                        <div className="space-y-4">
                            <ColorInput
                                label="Fondo de hoja"
                                value={template.page.backgroundColor}
                                onChange={value => updatePage({ backgroundColor: value })}
                            />
                            <ColorInput
                                label="Color del marco"
                                value={template.page.borderColor}
                                onChange={value => updatePage({ borderColor: value })}
                            />
                            <p className="text-xs text-slate-400">
                                Selecciona un elemento del lienzo para editarlo.
                            </p>
                        </div>
                    )}

                    {selected && (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={duplicateSelected}
                                    className="flex-1 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2"
                                >
                                    <Copy size={14} />
                                    Copiar
                                </button>
                                <button
                                    onClick={deleteSelected}
                                    className="flex-1 p-2 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    Borrar
                                </button>
                            </div>

                            {selected.type === 'text' && (
                                <TextArea
                                    label="Texto"
                                    value={selected.content ?? ''}
                                    onChange={value => updateSelected({ content: value })}
                                />
                            )}

                            {selected.type === 'field' && (
                                <>
                                    <SelectInput
                                        label="Campo"
                                        value={selected.field}
                                        onChange={value => updateSelected({ field: value })}
                                        options={fields.map(field => ({
                                            value: field.value,
                                            label: field.label,
                                        }))}
                                    />
                                    <TextInput
                                        label="Etiqueta"
                                        value={selected.label ?? ''}
                                        onChange={value => updateSelected({ label: value })}
                                    />
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <NumberInput label="X" value={selected.x} onChange={value => updateSelected({ x: value })} />
                                <NumberInput label="Y" value={selected.y} onChange={value => updateSelected({ y: value })} />
                                <NumberInput label="Ancho" value={selected.width} onChange={value => updateSelected({ width: value })} />
                                <NumberInput label="Alto" value={selected.height} onChange={value => updateSelected({ height: value })} />
                            </div>

                            {selected.type !== 'image' && (
                                <>
                                    <SelectInput
                                        label="Tipo de letra"
                                        value={selected.fontFamily}
                                        onChange={value => updateSelected({ fontFamily: value })}
                                        options={FONT_OPTIONS.map(font => ({ value: font, label: font.split(',')[0] }))}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <NumberInput label="Tamano" value={selected.fontSize} onChange={value => updateSelected({ fontSize: value })} />
                                        <SelectInput
                                            label="Peso"
                                            value={selected.fontWeight}
                                            onChange={value => updateSelected({ fontWeight: value })}
                                            options={[
                                                { value: '400', label: 'Normal' },
                                                { value: '700', label: 'Negrita' },
                                                { value: '900', label: 'Extra' },
                                            ]}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <IconButton active={selected.textAlign === 'left'} onClick={() => updateSelected({ textAlign: 'left' })} icon={AlignLeft} />
                                        <IconButton active={selected.textAlign === 'center'} onClick={() => updateSelected({ textAlign: 'center' })} icon={AlignCenter} />
                                        <IconButton active={selected.textAlign === 'right'} onClick={() => updateSelected({ textAlign: 'right' })} icon={AlignRight} />
                                    </div>
                                </>
                            )}

                            {selected.type === 'image' && (
                                <SelectInput
                                    label="Ajuste de imagen"
                                    value={selected.objectFit ?? 'contain'}
                                    onChange={value => updateSelected({ objectFit: value })}
                                    options={[
                                        { value: 'contain', label: 'Contener' },
                                        { value: 'cover', label: 'Cubrir' },
                                        { value: 'fill', label: 'Estirar' },
                                    ]}
                                />
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <ColorInput label="Color" value={selected.color ?? '#111111'} onChange={value => updateSelected({ color: value })} />
                                <ColorInput label="Fondo" value={normalizeColor(selected.backgroundColor)} onChange={value => updateSelected({ backgroundColor: value })} />
                                <ColorInput label="Borde" value={normalizeColor(selected.borderColor)} onChange={value => updateSelected({ borderColor: value })} />
                                <NumberInput label="Borde px" value={selected.borderWidth ?? 0} onChange={value => updateSelected({ borderWidth: value })} />
                            </div>

                            <NumberInput
                                label="Redondeo"
                                value={selected.borderRadius ?? 0}
                                onChange={value => updateSelected({ borderRadius: value })}
                            />

                            {selected.type !== 'image' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <ToggleButton
                                        active={Boolean(selected.underline)}
                                        onClick={() => updateSelected({ underline: !selected.underline })}
                                    >
                                        Subrayado
                                    </ToggleButton>
                                    <ToggleButton
                                        active={Boolean(selected.borderTop)}
                                        onClick={() => updateSelected({ borderTop: !selected.borderTop })}
                                    >
                                        Linea arriba
                                    </ToggleButton>
                                </div>
                            )}
                        </div>
                    )}
                </aside>
            </div>
        </div>
    )
}

function PanelTitle({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-2 mb-3 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <Icon size={15} />
            {title}
        </div>
    )
}

function TextInput({ label, value, onChange }) {
    return (
        <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <input
                value={value}
                onChange={event => onChange(event.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm dark:text-white"
            />
        </label>
    )
}

function TextArea({ label, value, onChange }) {
    return (
        <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <textarea
                value={value}
                rows={4}
                onChange={event => onChange(event.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm dark:text-white resize-none"
            />
        </label>
    )
}

function NumberInput({ label, value, onChange }) {
    return (
        <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <input
                type="number"
                value={value ?? 0}
                onChange={event => onChange(Number(event.target.value))}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm dark:text-white"
            />
        </label>
    )
}

function ColorInput({ label, value, onChange }) {
    return (
        <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <div className="mt-1 flex gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={event => onChange(event.target.value)}
                    className="h-10 w-12 rounded-lg"
                />
                <input
                    value={value}
                    onChange={event => onChange(event.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm dark:text-white"
                />
            </div>
        </label>
    )
}

function SelectInput({ label, value, onChange, options }) {
    return (
        <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <select
                value={value ?? ''}
                onChange={event => onChange(event.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm dark:text-white"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    )
}

function IconButton({ active, onClick, icon: Icon }) {
    return (
        <button
            onClick={onClick}
            className={`
                flex-1 p-2 rounded-lg border
                ${active
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700'
                }
            `}
        >
            <Icon size={16} className="mx-auto" />
        </button>
    )
}

function ToggleButton({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`
                p-2 rounded-lg text-xs font-bold
                ${active
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300'
                }
            `}
        >
            {children}
        </button>
    )
}

function normalizeColor(value) {
    if (!value || value === 'transparent') return '#ffffff'
    return value
}

function getLineShadow(element) {
    const shadows = []

    if (element.underline) {
        shadows.push('inset 0 -1px 0 currentColor')
    }

    if (element.borderTop) {
        shadows.push('inset 0 1px 0 currentColor')
    }

    return shadows.length ? shadows.join(', ') : undefined
}

function getElementKind(element) {
    if (element.type === 'field') return 'Dato BD'
    if (element.type === 'image') return 'Imagen'
    return 'Texto'
}

function getElementName(element, fields = []) {
    if (element.type === 'field') {
        const field = fields.find(item => item.value === element.field)
        return field?.label ?? element.field ?? 'Dato'
    }

    if (element.type === 'image') {
        return 'Imagen del certificado'
    }

    return element.content?.split('\n')?.[0] || 'Texto libre'
}
