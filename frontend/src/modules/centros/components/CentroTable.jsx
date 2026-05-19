import { useNavigate }
from "react-router-dom";

import Badge
from "../../../components/ui/Badge";

import TableActions
from "../../../components/ui/TableActions";

export default function CentroTable({

    centros,
    toggleStatus,
    onEdit,
    onAssign,
    onSchedule

}) {

    const navigate = useNavigate();

    return (

        <div
            className="
                mx-4
                mb-10
                overflow-hidden
                bg-white
                dark:bg-[#11141D]
                rounded-[2.5rem]
                border
                border-slate-100
                dark:border-slate-800
                shadow-sm
            "
        >

            <div className="overflow-x-auto">

                <table
                    className="
                        w-full
                        text-left
                        border-collapse
                        min-w-[900px]
                    "
                >

                    <thead>

                        <tr
                            className="
                                border-b
                                border-slate-100
                                dark:border-slate-800
                                bg-slate-50/30
                                dark:bg-slate-900/40
                            "
                        >

                            <th
                                className="
                                    p-8
                                    text-[10px]
                                    font-black
                                    text-slate-400
                                    uppercase
                                    tracking-[0.2em]
                                "
                            >
                                Centro
                            </th>

                            <th
                                className="
                                    p-8
                                    text-[10px]
                                    font-black
                                    text-slate-400
                                    uppercase
                                    tracking-[0.2em]
                                "
                            >
                                Telefono
                            </th>

                            <th
                                className="
                                    p-8
                                    text-[10px]
                                    font-black
                                    text-slate-400
                                    uppercase
                                    tracking-[0.2em]
                                "
                            >
                                Parroquia
                            </th>

                            <th
                                className="
                                    p-8
                                    text-center
                                    text-[10px]
                                    font-black
                                    text-slate-400
                                    uppercase
                                    tracking-[0.2em]
                                "
                            >
                                Estado
                            </th>

                            <th
                                className="
                                    p-8
                                    text-center
                                    text-[10px]
                                    font-black
                                    text-slate-400
                                    uppercase
                                    tracking-[0.2em]
                                "
                            >
                                Acciones
                            </th>

                        </tr>

                    </thead>

                    <tbody
                        className="
                            divide-y
                            divide-slate-50
                            dark:divide-slate-800/50
                        "
                    >

                        {centros.map((item) => (

                            <tr
                                key={item.id_cen}
                                className="
                                    group
                                    hover:bg-indigo-50/20
                                    dark:hover:bg-indigo-500/5
                                    transition-colors
                                "
                            >

                                <td className="p-8">

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-4
                                        "
                                    >

                                        <div
                                            className="
                                                w-10
                                                h-10
                                                bg-indigo-50
                                                dark:bg-indigo-500/10
                                                rounded-xl
                                                flex
                                                items-center
                                                justify-center
                                                text-indigo-600
                                                dark:text-indigo-400
                                                font-black
                                                uppercase
                                            "
                                        >

                                            {item.nom_cen?.[0]}

                                        </div>

                                        <div>

                                            <p
                                                className="
                                                    font-bold
                                                    text-slate-700
                                                    dark:text-slate-200
                                                    uppercase
                                                    text-sm
                                                "
                                            >

                                                {item.nom_cen}

                                            </p>

                                            <p
                                                className="
                                                    text-[10px]
                                                    text-slate-400
                                                    uppercase
                                                "
                                            >

                                                {item.calle_cen}

                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td
                                    className="
                                        p-8
                                        text-xs
                                        font-bold
                                        text-slate-500
                                        uppercase
                                    "
                                >

                                    {item.telf_cen}

                                </td>

                                <td
                                    className="
                                        p-8
                                        text-[10px]
                                        font-black
                                        uppercase
                                        text-indigo-500
                                    "
                                >

                                    {
                                        item.parroquia_nombre
                                    }

                                </td>

                                <td
                                    className="
                                        p-8
                                        text-center
                                    "
                                >

                                    <Badge
                                        status={
                                            item.estado_cen
                                        }
                                        onClick={() =>
                                            toggleStatus(item)
                                        }
                                    />

                                </td>

                                <td
                                    className="
                                        p-8
                                        text-center
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            justify-center
                                        "
                                    >

                                        <TableActions

                                            item={item}

                                            onEdit={onEdit}

                                            onAssign={onAssign}

                                            onSchedule={(item) =>
                                                console.log(
                                                    "Horarios",
                                                    item
                                                )
                                            }
                                        />
                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}