import Badge from '../../../components/ui/Badge'

import TableActions from '../../../components/ui/TableActions'

export default function BautizoTable({
    bautizos,
    toggleStatus,
    onView,
    onEdit,
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
                    min-w-[1000px]
                ">

                    <thead>

                        <tr className="
                            border-b border-slate-100 dark:border-slate-800
                            bg-slate-50/30 dark:bg-slate-900/40
                        ">

                            <th className="
                                p-8
                                text-[10px]
                                font-black
                                text-slate-400
                                uppercase
                                tracking-[0.2em]
                            ">
                                Bautizado
                            </th>

                            <th className="
                                p-8
                                text-[10px]
                                font-black
                                text-slate-400
                                uppercase
                                tracking-[0.2em]
                            ">
                                Fecha
                            </th>

                            <th className="
                                p-8
                                text-[10px]
                                font-black
                                text-slate-400
                                uppercase
                                tracking-[0.2em]
                            ">
                                Centro
                            </th>

                            <th className="
                                p-8
                                text-[10px]
                                font-black
                                text-slate-400
                                uppercase
                                tracking-[0.2em]
                            ">
                                Libro Sacramental
                            </th>

                            <th className="
                                p-8
                                text-center
                                text-[10px]
                                font-black
                                text-slate-400
                                uppercase
                                tracking-[0.2em]
                            ">
                                Estado
                            </th>

                            <th className="
                                p-8
                                text-center
                                text-[10px]
                                font-black
                                text-slate-400
                                uppercase
                                tracking-[0.2em]
                            ">
                                Acciones
                            </th>

                        </tr>

                    </thead>

                    <tbody className="
                        divide-y divide-slate-50
                        dark:divide-slate-800/50
                    ">

                        {bautizos.map((bautizo) => (

                            <tr
                                key={bautizo.id_sac}
                                className="
                                    group
                                    hover:bg-indigo-50/20
                                    dark:hover:bg-indigo-500/5
                                    transition-colors
                                "
                            >

                                {/* BAUTIZADO */}

                                <td className="p-8">

                                    <div className="
                                        flex items-center gap-4
                                    ">

                                        <div className="
                                            w-10 h-10
                                            bg-indigo-50
                                            rounded-xl
                                            flex items-center justify-center
                                            text-indigo-600
                                            font-black
                                            uppercase
                                        ">

                                            {
                                                bautizo.bautizado?.[0]
                                            }

                                        </div>

                                        <div>

                                            <p className="
                                                font-bold
                                                text-slate-700 dark:text-slate-200
                                                uppercase
                                                text-sm
                                            ">

                                                {
                                                    bautizo.bautizado
                                                }

                                            </p>

                                            <p className="
                                                text-[10px]
                                                text-slate-400
                                                uppercase
                                            ">

                                                Sacramento de Bautizo

                                            </p>

                                        </div>

                                    </div>

                                </td>

                                {/* FECHA */}

                                <td className="
                                    p-8
                                    font-mono
                                    text-xs
                                    font-bold
                                    text-slate-500
                                ">

                                    {
                                        bautizo.fecha_sac
                                    }

                                </td>

                                {/* CENTRO */}

                                <td className="
                                    p-8
                                    text-[10px]
                                    font-black
                                    uppercase
                                    text-indigo-500
                                ">

                                    {
                                        bautizo.centro
                                    }

                                </td>

                                {/* LIBRO */}

                                <td className="
                                    p-8
                                    font-mono
                                    text-xs
                                    font-bold
                                    text-slate-500
                                ">

                                    {
                                        bautizo.libro
                                    }

                                </td>

                                {/* ESTADO */}

                                <td className="
                                    p-8
                                    text-center
                                ">

                                    <Badge
                                        status={
                                            bautizo.estado_sac
                                        }
                                        onClick={() =>
                                            toggleStatus(bautizo)
                                        }
                                    />

                                </td>

                                {/* ACCIONES */}

                                <td className="
                                    p-8
                                    text-center
                                ">

                                    <div className="
                                        flex justify-center
                                    ">

                                        <TableActions
                                            item={bautizo}
                                            onView={onView}
                                            onEdit={onEdit}
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