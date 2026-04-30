import Badge from '../../../components/ui/Badge'

import TableActions from '../../../components/ui/TableActions'

export default function UsuarioTable({
    usuarios,
    toggleStatus,
    onView,
}) {

    return (

        <div className="mx-4 mb-10 overflow-hidden bg-white dark:bg-[#11141D] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">

            <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse min-w-[800px]">

                    <thead>

                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40">

                            <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Nombre / Correo
                            </th>

                            <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                C.I.
                            </th>

                            <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Rol
                            </th>

                            <th className="p-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Estado
                            </th>

                            <th className="p-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Acciones
                            </th>

                        </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">

                        {usuarios.map((user) => (

                            <tr
                                key={user.id_usu}
                                className="group hover:bg-indigo-50/20 dark:hover:bg-indigo-500/5 transition-colors"
                            >

                                <td className="p-8">

                                    <div className="flex items-center gap-4">

                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black uppercase">

                                            {user.persona?.nom_per?.[0]}
                                            {user.persona?.ap_pat_per?.[0]}

                                        </div>

                                        <div>

                                            <p className="font-bold text-slate-700 dark:text-slate-200 uppercase text-sm">

                                                {user.persona?.nom_per}
                                                {' '}
                                                {user.persona?.ap_pat_per}

                                            </p>

                                            <p className="text-[10px] text-slate-400 lowercase">

                                                {user.correo_usu}

                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td className="p-8 font-mono text-xs font-bold text-slate-500">

                                    {user.persona?.carnet_per}

                                </td>

                                <td className="p-8 text-[10px] font-black uppercase text-indigo-500">

                                    {user.nombre_rol}

                                </td>

                                <td className="p-8 text-center">

                                    <Badge
                                        status={user.estado_usu}
                                        onClick={() => toggleStatus(user)}
                                    />

                                </td>

                                <td className="p-8 text-center">

                                    <div className="flex justify-center">

                                        <TableActions
                                            item={user}
                                            onView={onView}
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