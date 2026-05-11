import React, { useState } from 'react'

import {
    Link,
    useNavigate,
} from 'react-router-dom'

import {
    Cross,
    Lock,
    Mail,
    ArrowRight,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

import {
    GoogleLogin,
} from '@react-oauth/google'

import {
    googleLoginRequest,
    meRequest,
} from '../services/authService'

export default function Login() {

    const navigate = useNavigate()

    const {
        login,
        setUser,
    } = useAuth()

    const [data, setData] = useState({

        correo_usu: '',

        password: '',
    })

    const [processing, setProcessing] =
        useState(false)

    const [errors, setErrors] =
        useState({})

    const handleGoogleSuccess =
    async (credentialResponse) => {

        try {

            const response =
                await googleLoginRequest(
                    credentialResponse.credential
                )

            localStorage.setItem(
                'token',
                response.access
            )

            localStorage.setItem(
                'refresh',
                response.refresh
            )

            const userData =
                await meRequest()

            setUser(userData)

            if (response.needs_completion) {

                navigate('/complete-google-data')

                return
            }

            navigate('/')

        } catch (error) {

            console.log(error)

            setErrors({
                general:
                    'Error con Google Login'
            })
        }
    }
    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            setProcessing(true)

            setErrors({})

            await login(
                data.correo_usu,
                data.password
            )

            navigate('/')

        } catch (err) {

            setErrors({
                general:
                    'Credenciales incorrectas'
            })

        } finally {

            setProcessing(false)
        }
    }

    return (

        <div className="min-h-screen bg-slate-50 dark:bg-[#0F111A] flex items-center justify-center p-4">

            <div className="w-full max-w-md">

                {/* LOGO */}

                <div className="flex flex-col items-center mb-10">

                    <div className="w-16 h-16 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 mb-4">

                        <Cross size={32} />

                    </div>

                    <div className="text-center">

                        <h1 className="font-black text-3xl tracking-tighter dark:text-white uppercase block">

                            Curia

                        </h1>

                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-[0.4em]">

                            Digital

                        </span>

                    </div>

                </div>

                {/* CARD */}

                <div className="bg-white dark:bg-[#11141D] p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* ERROR */}

                        {errors.general && (

                            <div className="bg-rose-100 text-rose-600 text-sm font-bold rounded-2xl p-4">

                                {errors.general}

                            </div>
                        )}

                        {/* EMAIL */}

                        <div>

                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">

                                Correo Electrónico

                            </label>

                            <div className="relative">

                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={18}
                                />

                                <input
                                    type="email"

                                    value={data.correo_usu}

                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            correo_usu:
                                                e.target.value,
                                        })
                                    }

                                    className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl py-3 pl-12 pr-4 dark:text-white transition-all"

                                    placeholder="ejemplo@gmail.com"
                                />

                            </div>

                        </div>

                        {/* PASSWORD */}

                        <div>

                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">

                                Contraseña

                            </label>

                            <div className="relative">

                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={18}
                                />

                                <input
                                    type="password"

                                    value={data.password}

                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            password:
                                                e.target.value,
                                        })
                                    }

                                    className="w-full bg-slate-50 dark:bg-[#1A1F2B] border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl py-3 pl-12 pr-4 dark:text-white transition-all"

                                    placeholder="••••••••"
                                />

                            </div>

                        </div>

                        {/* BOTÓN */}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >

                            {processing

                                ? 'Iniciando...'

                                : (

                                    <>

                                        Entrar al Sistema

                                        <ArrowRight
                                            size={16}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />

                                    </>
                                )}

                        </button>

                        <div className="flex justify-center">

    {/* BOTON CUSTOM */}

    <div
        onClick={() => {
            document
                .querySelector(
                    '[role="button"]'
                )
                ?.click()
        }}
        className="
            w-full
            max-w-[320px]

            mx-auto

            flex
            items-center
            justify-center
            gap-3

            bg-white
            border
            border-slate-200

            rounded-full

            py-3
            px-5

            shadow-md
            shadow-slate-200/50

            hover:scale-[1.01]
            hover:shadow-lg

            transition-all
            duration-300

            cursor-pointer
        "
    >

        <div className="
            w-9
            h-9
            rounded-full
            bg-white

            flex
            items-center
            justify-center

            border
            border-slate-200
        ">
            <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
            />
        </div>

        <span className="
            text-slate-700
            font-semibold
            tracking-wide
            text-sm
        ">
            Continuar con Google
        </span>

    </div>

    {/* GOOGLE REAL OCULTO */}

    <div className="hidden">

        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
                console.log(
                    'Google Login Error'
                )
            }}
        />

    </div>

</div>

                    </form>

                    {/* FOOTER */}

                    <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">

                        ¿No tienes cuenta?

                        {' '}

                        <Link
                            to="/register"
                            className="text-indigo-500 hover:text-indigo-600 transition-colors"
                        >

                            crea tu cuenta aquí

                        </Link>

                    </p>

                </div>

            </div>

        </div>
    )
}