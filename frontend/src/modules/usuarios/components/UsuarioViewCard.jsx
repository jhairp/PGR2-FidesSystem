import {
    User,
    Mail,
    Fingerprint,
    Smartphone,
    Shield,
    Edit3,
    X,
} from 'lucide-react'

const InfoField = ({
    label,
    icon: Icon,
    value,
}) => (

    <div className="flex flex-col gap-0.5">

        <label className="text-[10px] font-black text-violet-500/70 uppercase tracking-widest flex items-center gap-1.5">

            <Icon size={10} />

            {label}

        </label>

        <div
            className="
                w-full
                bg-transparent
                font-bold
                text-sm
                text-slate-700
                dark:text-slate-100
                border-b
                border-transparent
                pb-1
                cursor-default
                uppercase
            "
        >
            {value || '---'}
        </div>

    </div>
)

export default function UsuarioViewCard({
    user,
    onClose,
}) {

    if (!user) return null

    return (

        <div className="w-full overflow-hidden shadow-2xl rounded-[2.5rem]">

            <div className="flex flex-col md:flex-row bg-white dark:bg-[#11141D] min-h-[420px]">

                {/* FRANJA IZQUIERDA */}

                <div className="w-full md:w-[280px] bg-violet-600 p-8 flex flex-col items-center justify-between text-white relative transition-colors duration-500 overflow-hidden">

                    <div className="absolute top-0 right-0 p-4 opacity-10">

                        <Shield
                            size={120}
                            strokeWidth={1}
                        />

                    </div>

                    <div className="relative z-10 text-center">

                        <h2 className="text-lg font-black leading-none uppercase tracking-tighter text-white">
                            SISTEMA
                        </h2>

                        <p className="text-[10px] font-bold opacity-70 tracking-[0.2em] text-violet-100">
                            PARROQUIAL
                        </p>

                    </div>

                    <div className="relative z-10 my-6">

                        <div className="w-32 h-40 bg-white rounded-lg shadow-2xl p-1 rotate-2 hover:rotate-0 transition-transform duration-500">

                            <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center overflow-hidden border border-slate-200">

                                <img
                                    src={
                                        user.foto_usu
                                            ? `/images/perfil/${user.foto_usu}`
                                            : '/images/perfil/default.png'
                                    }
                                    alt="Perfil"
                                    className="w-full h-full object-cover transition-opacity duration-300"
                                />

                            </div>

                        </div>

                    </div>

                    <div className="relative z-10 w-full text-center space-y-2">

                        <div className="bg-black/20 py-1 rounded-full border border-white/10">

                            <p className="text-[9px] font-black uppercase tracking-widest text-white">

                                usuario

                            </p>

                        </div>

                    </div>

                </div>

                {/* CUERPO */}

                <div className="flex-1 p-10 flex flex-col relative overflow-hidden bg-slate-50/50 dark:bg-[#11141D]">

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none text-slate-900 dark:text-white">

                        <Shield size={350} />

                    </div>

                    <div className="relative z-10 h-full flex flex-col">

                        <div className="mb-8">

                            <h3 className="text-2xl font-black text-violet-600 dark:text-white tracking-tighter uppercase">

                                datos del usuario

                            </h3>

                            <div className="w-16 h-1.5 bg-violet-500 rounded-full mt-1"></div>

                        </div>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-6">

                            <InfoField
                                label="Nombres"
                                icon={User}
                                value={user.persona?.nom_per}
                            />

                            <InfoField
                                label="Apellidos"
                                icon={User}
                                value={user.persona?.ap_pat_per}
                            />

                            <InfoField
                                label="Documento CI"
                                icon={Fingerprint}
                                value={user.persona?.carnet_per}
                            />

                            <InfoField
                                label="Correo"
                                icon={Mail}
                                value={user.correo_usu}
                            />

                            <InfoField
                                label="Número de Celular"
                                icon={Smartphone}
                                value={user.persona?.cel_per}
                            />

                            <InfoField
                                label="Rol Asignado"
                                icon={Shield}
                                value={
                                    user.nombre_rol
                                    ||
                                    user.rol?.nom_rol
                                }
                            />

                        </div>

                        <div className="mt-auto pt-10 flex items-center justify-between">

                            <div className="flex gap-4">

                                <button
                                    className="
                                        bg-slate-900
                                        text-white
                                        px-8
                                        py-3
                                        rounded-xl
                                        font-black
                                        text-[10px]
                                        uppercase
                                        tracking-widest
                                        shadow-xl
                                        hover:bg-violet-600
                                        transition-all
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <Edit3 size={14} />

                                    Editar Información

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}