import React, { useState, useEffect } from 'react'
import {
    Edit2,
    Save,
    Mail,
    Camera,
    X,
} from 'lucide-react'

import { useAuth }
from '@/modules/auth/hooks/useAuth'

import api from '@/api/axios'

export default function UserProfileContent() {

    const {
        user,
        setUser,
    } = useAuth()

    const [isEditing, setIsEditing] =
        useState(false)

    const [processing, setProcessing] =
        useState(false)

    const [showPhotoSelector,
        setShowPhotoSelector] =
        useState(false)

    const avatars = [
        'default.png',
        'corazon.jpg',
        'cruz.jpg',
        'dino.jpg',
        'gato.jpg',
        'jesus.jpg',
        'jesus2.jpg',
        'rosario.jpg',
        'user_azul.jpg',
        'user_shrek.jpg',
    ]

    const [data, setData] = useState({

        nombre: '',

        apellido_p: '',

        correo: '',

        foto_usu: 'default.png',
    })

    useEffect(() => {

        if (user) {

            setData({

                nombre:
                    user.persona?.nom_per || '',

                apellido_p:
                    user.persona?.ap_pat_per || '',

                correo:
                    user.correo_usu || '',

                foto_usu:
                    user.foto_usu || 'default.png',
            })
        }

    }, [user])

    const handleChange = (e) => {

        setData({

            ...data,

            [e.target.name]:
                e.target.value,
        })
    }

    const handleSave = async (e) => {

        e.preventDefault()

        try {

            setProcessing(true)

            const response =
                await api.post(
                    '/auth/profile/update/',
                    {

                        nom_per:
                            data.nombre,

                        ap_pat_per:
                            data.apellido_p,

                        foto_usu:
                            data.foto_usu,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )

            setUser(
                response.data
            )

            setIsEditing(false)

            setShowPhotoSelector(false)

        } catch (error) {

            console.log(error)

        } finally {

            setProcessing(false)
        }
    }

    return (

        <div className="space-y-6">

            {/* FOTO */}

            <div className="flex flex-col items-center">

                <div
                    className={`relative group ${

                        isEditing
                            ? 'cursor-pointer'
                            : ''
                    }`}

                    onClick={() =>

                        isEditing &&
                        setShowPhotoSelector(
                            !showPhotoSelector
                        )
                    }
                >

                    <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 shadow-xl">

                        <div className="w-full h-full rounded-[2.3rem] bg-white dark:bg-[#11141D] overflow-hidden border-4 border-white dark:border-[#11141D]">

                            <img
                                src={`/images/perfil/${data.foto_usu}`}
                                className="w-full h-full object-cover"
                                alt="Avatar"

                                onError={(e) => {

                                    e.target.src =
                                        '/images/perfil/default.png'
                                }}
                            />

                        </div>

                    </div>

                    {isEditing && (

                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem] text-white transition-opacity">

                            <Camera size={24} />

                        </div>
                    )}

                </div>

                <p className="mt-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">

                    Usuario

                </p>

            </div>

            {/* AVATARS */}

            {
                isEditing &&
                showPhotoSelector && (

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-indigo-200 dark:border-indigo-500/30 animate-in fade-in zoom-in duration-200">

                        <div className="flex justify-between items-center mb-2 px-2">

                            <span className="text-[10px] font-bold text-slate-400 uppercase">

                                Selecciona un avatar

                            </span>

                            <X
                                size={14}
                                className="text-slate-400 cursor-pointer"

                                onClick={() =>
                                    setShowPhotoSelector(false)
                                }
                            />

                        </div>

                        <div className="grid grid-cols-5 gap-2">

                            {
                                avatars.map((img) => (

                                    <button
                                        key={img}

                                        onClick={() => {

                                            setData({

                                                ...data,

                                                foto_usu: img,
                                            })

                                            setShowPhotoSelector(false)
                                        }}

                                        className={`rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${

                                            data.foto_usu === img

                                                ? 'border-indigo-500 bg-indigo-50'

                                                : 'border-transparent opacity-60'
                                        }`}
                                    >

                                        <img
                                            src={`/images/perfil/${img}`}
                                            className="w-full aspect-square object-cover"
                                        />

                                    </button>
                                ))
                            }

                        </div>

                    </div>
                )
            }

            {/* FORM */}

            <div className="space-y-4">

                <div className="grid grid-cols-2 gap-3">

                    <div className="space-y-1">

                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">

                            Nombre

                        </label>

                        <input
                            name="nombre"

                            disabled={!isEditing}

                            value={data.nombre}

                            onChange={handleChange}

                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white disabled:opacity-70 transition-all"
                        />

                    </div>

                    <div className="space-y-1">

                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">

                            Apellidos

                        </label>

                        <input
                            name="apellido_p"

                            disabled={!isEditing}

                            value={data.apellido_p}

                            onChange={handleChange}

                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold dark:text-white disabled:opacity-70 transition-all"
                        />

                    </div>

                </div>

                {/* EMAIL */}

                <div className="space-y-1">

                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">

                        Correo Electrónico

                    </label>

                    <div className="relative">

                        <Mail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                        />

                        <input
                            disabled

                            value={data.correo}

                            className="w-full pl-12 pr-4 py-3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        />

                    </div>

                </div>

            </div>

            {/* BUTTONS */}

            <div className="flex gap-3">

                {
                    !isEditing

                        ? (

                            <button
                                onClick={() =>
                                    setIsEditing(true)
                                }

                                className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg"
                            >

                                <Edit2 size={14} />

                                Editar Perfil

                            </button>

                        ) : (

                            <div className="flex w-full gap-2">

                                <button
                                    onClick={() => {

                                        setIsEditing(false)

                                        setShowPhotoSelector(false)
                                    }}

                                    className="flex-1 py-4 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                                >

                                    Cancelar

                                </button>

                                <button
                                    onClick={handleSave}

                                    disabled={processing}

                                    className="flex-[2] flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/30 disabled:opacity-50"
                                >

                                    <Save size={14} />

                                    {
                                        processing
                                            ? 'Guardando...'
                                            : 'Guardar Cambios'
                                    }

                                </button>

                            </div>
                        )
                }

            </div>

        </div>
    )
}