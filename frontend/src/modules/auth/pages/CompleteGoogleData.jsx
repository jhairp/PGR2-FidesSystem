import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cross, CreditCard, Phone, CheckCircle } from 'lucide-react'
import api from '@/api/axios'

export default function CompleteGoogleData() {

    const navigate = useNavigate()

    const [processing, setProcessing] = useState(false)

    const [errors, setErrors] = useState({})

    const [data, setData] = useState({
        carnet_per: '',
        cel_per: '',
    })

    const handleChange = (e) => {

        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    const submit = async (e) => {

        e.preventDefault()

        try {

            setProcessing(true)
            setErrors({})

            await api.post(
                '/auth/complete-google-data/',
                data,
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            navigate('/')

        } catch (error) {

            console.log(error)

            if (error.response?.data) {

                setErrors(error.response.data)

            } else {

                setErrors({
                    general: 'Error al completar datos'
                })
            }

        } finally {

            setProcessing(false)
        }
    }

    return (

        <div className="
            min-h-screen
            bg-slate-50
            dark:bg-[#0F111A]
            flex
            items-center
            justify-center
            p-6
        ">

            <div className="
                w-full
                max-w-md
                bg-white
                dark:bg-[#11141D]
                p-10
                rounded-[2.5rem]
                border
                border-slate-200
                dark:border-slate-800
                shadow-2xl
            ">

                {/* HEADER */}

                <div className="text-center mb-8">

                    <div className="
                        inline-flex
                        w-12
                        h-12
                        bg-indigo-600
                        rounded-2xl
                        items-center
                        justify-center
                        text-white
                        mb-4
                        shadow-lg
                        shadow-indigo-500/20
                    ">

                        <Cross size={24} />

                    </div>

                    <h2 className="
                        text-2xl
                        font-black
                        uppercase
                        tracking-tighter
                        dark:text-white
                    ">
                        Completa tu Perfil
                    </h2>

                    <p className="
                        text-[10px]
                        font-bold
                        text-slate-400
                        uppercase
                        tracking-[0.3em]
                        mt-2
                    ">
                        Solo un paso más para finalizar
                    </p>

                </div>

                {/* ERROR */}

                {errors.general && (

                    <div className="
                        bg-rose-100
                        text-rose-600
                        rounded-2xl
                        p-4
                        text-sm
                        font-bold
                        mb-5
                    ">
                        {errors.general}
                    </div>
                )}

                {/* FORM */}

                <form
                    onSubmit={submit}
                    className="space-y-5"
                >

                    {/* CARNET */}

                    <div>

                        <label className="
                            text-[9px]
                            font-black
                            text-slate-400
                            uppercase
                            tracking-widest
                            ml-2
                            mb-1
                            block
                        ">
                            Documento de Identidad (CI)
                        </label>

                        <div className="relative">

                            <CreditCard
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                                size={18}
                            />

                            <input
                                type="text"
                                name="carnet_per"
                                value={data.carnet_per}
                                onChange={handleChange}
                                placeholder="Ingresa tu carnet"
                                required
                                className="
                                    w-full
                                    bg-slate-50
                                    dark:bg-[#1A1F2B]
                                    border-none
                                    focus:ring-2
                                    focus:ring-indigo-500
                                    rounded-2xl
                                    py-3
                                    pl-12
                                    dark:text-white
                                "
                            />

                        </div>

                        {errors.carnet_per && (

                            <p className="
                                text-rose-500
                                text-[10px]
                                mt-1
                                font-bold
                            ">
                                {errors.carnet_per}
                            </p>
                        )}

                    </div>

                    {/* CELULAR */}

                    <div>

                        <label className="
                            text-[9px]
                            font-black
                            text-slate-400
                            uppercase
                            tracking-widest
                            ml-2
                            mb-1
                            block
                        ">
                            Número de Celular
                        </label>

                        <div className="relative">

                            <Phone
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                                size={18}
                            />

                            <input
                                type="text"
                                name="cel_per"
                                value={data.cel_per}
                                onChange={handleChange}
                                placeholder="Ej: 78901234"
                                required
                                className="
                                    w-full
                                    bg-slate-50
                                    dark:bg-[#1A1F2B]
                                    border-none
                                    focus:ring-2
                                    focus:ring-indigo-500
                                    rounded-2xl
                                    py-3
                                    pl-12
                                    dark:text-white
                                "
                            />

                        </div>

                        {errors.cel_per && (

                            <p className="
                                text-rose-500
                                text-[10px]
                                mt-1
                                font-bold
                            ">
                                {errors.cel_per}
                            </p>
                        )}

                    </div>

                    {/* BUTTON */}

                    <button
                        disabled={processing}
                        className="
                            w-full
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            font-black
                            text-[10px]
                            uppercase
                            tracking-[0.2em]
                            py-4
                            rounded-2xl
                            transition-all
                            shadow-lg
                            shadow-indigo-500/30
                            flex
                            items-center
                            justify-center
                            gap-2
                            group
                        "
                    >

                        {processing

                            ? 'Guardando...'

                            : (
                                <>
                                    Finalizar Registro

                                    <CheckCircle
                                        size={16}
                                        className="
                                            group-hover:scale-110
                                            transition-transform
                                        "
                                    />
                                </>
                            )
                        }

                    </button>

                </form>

            </div>

        </div>
    )
}