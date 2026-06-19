import Badge from '../../../components/ui/Badge'
import TableActions from '../../../components/ui/TableActions'
import { FileText } from 'lucide-react'

const TIPOS_LABEL = {
    partida_bautismo: 'Partida de Bautismo',
    cedula:           'Cédula de Identidad',
    certificado:      'Certificado',
    acta_matrimonio:  'Acta de Matrimonio',
    foto:             'Fotografía',
    otro:             'Otro',
}

const ESTADO_COLORS = {
    generado  : 'bg-slate-100 text-slate-500 dark:bg-slate-700/60 dark:text-slate-300',
    pendiente : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    aprobado  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rechazado : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
}

const iconArchivo = (url = '') => {
    const ext = (url || '').split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png'].includes(ext)) return '🖼️'
    if (ext === 'pdf') return '📄'
    if (['doc', 'docx'].includes(ext)) return '📝'
    return '📎'
}

export default function DocumentoTable({
    documentos,
    onView,
    onEdit,
    onEstado,
    onDelete,
}) {

    return (
        <div className="
            mx-4 mb-10 overflow-hidden
            bg-white dark:bg-[#11141D]
            rounded-[2.5rem]
            border border-slate-100 dark:border-slate-800
            shadow-sm
        ">
            <div className="overflow-x-auto">
                <table className="
                    w-full text-left
                    border-collapse
                    min-w-[900px]
                ">
                    <thead>
                        <tr className="
                            border-b border-slate-100 dark:border-slate-800
                            bg-slate-50/30 dark:bg-slate-900/40
                        ">
                            {['Documento', 'Tipo', 'Sacramento', 'Código', 'Estado', 'Acciones'].map(h => (
                                <th key={h} className={`
                                    p-8 text-[10px] font-black text-slate-400
                                    uppercase tracking-[0.2em]
                                    ${h === 'Estado' || h === 'Acciones' ? 'text-center' : ''}
                                `}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">

                        {documentos.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-slate-300 dark:text-slate-600">
                                        <FileText size={40} />
                                        <p className="text-[11px] font-black uppercase tracking-widest">
                                            Sin documentos registrados
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {documentos.map((doc) => (
                            <tr
                                key={doc.id_doc}
                                className="
                                    group
                                    hover:bg-indigo-50/20
                                    dark:hover:bg-indigo-500/5
                                    transition-colors
                                "
                            >
                                {/* DOCUMENTO */}
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="
                                            w-10 h-10
                                            bg-indigo-50 dark:bg-indigo-900/30
                                            rounded-xl
                                            flex items-center justify-center
                                            text-lg
                                            shrink-0
                                        ">
                                            {iconArchivo(doc.url_doc)}
                                        </div>
                                        <div>
                                            <p className="
                                                font-bold text-slate-700 dark:text-slate-200
                                                uppercase text-sm
                                            ">
                                                {doc.nom_doc}
                                            </p>
                                            {doc.desc_doc && (
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    {doc.desc_doc}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* TIPO */}
                                <td className="p-8 text-[10px] font-black uppercase text-indigo-500 tracking-wide">
                                    {TIPOS_LABEL[doc.tipo_doc] ?? doc.tipo_doc}
                                </td>

                                {/* SACRAMENTO */}
                                <td className="p-8 font-mono text-xs font-bold text-slate-500">
                                    {doc.sacramento_tipo
                                        ? <><span className="uppercase">{doc.sacramento_tipo}</span>
                                            {doc.sacramento_fecha && <span className="block text-[10px] text-slate-400">{doc.sacramento_fecha}</span>}
                                          </>
                                        : <span className="text-slate-300 dark:text-slate-600">—</span>
                                    }
                                </td>

                                {/* CÓDIGO */}
                                <td className="p-8 font-mono text-[11px] font-bold text-slate-400">
                                    {doc.codigo_doc ?? '—'}
                                </td>

                                {/* ESTADO — badge clickeable */}
                                <td className="p-8 text-center">
                                    <button
                                        onClick={() => onEstado(doc)}
                                        className={`
                                            px-4 py-1.5 rounded-full
                                            text-[10px] font-black uppercase tracking-widest
                                            border border-transparent
                                            transition-all hover:scale-105 active:scale-95
                                            ${ESTADO_COLORS[doc.estado_doc] ?? ESTADO_COLORS.generado}
                                        `}
                                    >
                                        {doc.estado_doc}
                                    </button>
                                </td>

                                {/* ACCIONES */}
                                <td className="p-8 text-center">
                                    <div className="flex justify-center">
                                        <TableActions
                                            item={{ ...doc, id: doc.id_doc }}
                                            onView={onView}
                                            onEdit={onEdit}
                                            onDelete={() => onDelete(doc.id_doc)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
