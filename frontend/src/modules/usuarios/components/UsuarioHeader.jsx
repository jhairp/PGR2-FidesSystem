import {
    Plus,
    Printer,
} from 'lucide-react'

export default function UsuarioHeader({
    abrirModal,
}) {

    return (

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 px-4">

            <div>

                <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter text-indigo-600">
                    Usuarios
                </h1>

                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 ml-1">
                    Gestión de Usuarios
                </p>

            </div>

            <div className="flex gap-3">

                <button
                    className="bg-emerald-600 text-white px-6 py-2.5 rounded-[1.8rem]"
                >
                    <Printer size={18} />
                </button>

                <button
                    onClick={abrirModal}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-3"
                >

                    <Plus size={18} />

                    Nuevo Registro

                </button>

            </div>

        </header>
    )
}