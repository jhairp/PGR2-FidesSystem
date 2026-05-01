import {
    Plus,
    Printer,
} from 'lucide-react'

export function CreateButton({
    onClick,
    children = 'Nuevo Registro',
}) {

    return (

        <button
            onClick={onClick}
            className="bg-indigo-600
                text-white
                px-8 py-4
                rounded-[1.8rem]
                font-black 
                text-[11px] 
                uppercase 
                tracking-widest 
                flex 
                items-center 
                gap-3 
                shadow-xl 
                shadow-indigo-500/20 
                hover:bg-indigo-700 
                transition
            "
        >

            <Plus size={18} />

            {children}

        </button>
    )
}

export function ReportButton({
    onClick,
}) {

    return (

        <button
            onClick={onClick}
            className="
                bg-emerald-600 
                text-white 
                px-6 
                py-2.5 
                rounded-[1.8rem] 
                font-black 
                text-[11px] 
                uppercase 
                tracking-widest 
                flex 
                items-center 
                gap-3 
                shadow-xl 
                shadow-emerald-500/30 
                hover:bg-emerald-700 
                transition 
                active:scale-95
            "
        >

            <Printer size={18}  />

        </button>
    )
}