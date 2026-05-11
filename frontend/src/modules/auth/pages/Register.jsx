import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cross, Camera, ArrowRight } from 'lucide-react'
import { registerRequest, googleLoginRequest } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'

export default function Register() {

    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState({})

    const [data, setData] = useState({
        nom_per: '',
        ap_pat_per: '',
        carnet_per: '',
        cel_per: '',
        correo_usu: '',
        password: '',
        password_confirmation: '',
        foto_usu: 'default.png',
    })

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

    const handleChange = (e) => {

        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            setProcessing(true)
            setErrors({})

            const response = await registerRequest(data)

            localStorage.setItem('token', response.access)
            localStorage.setItem('refresh', response.refresh)

            const userData =
                await meRequest()

            setUser(userData)

            navigate('/')

        } catch (error) {

            console.log(error)

            if (error.response?.data) {

                setErrors(error.response.data)

            } else {

                setErrors({
                    general: 'Error al registrarse'
                })
            }

        } finally {

            setProcessing(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {

        try {

            const response = await googleLoginRequest(
                credentialResponse.credential
            )

            localStorage.setItem('token', response.access)
            localStorage.setItem('refresh', response.refresh)

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
                general: 'Error con Google Login'
            })
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
                max-w-lg
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
                        shadow-indigo-500/40
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
                        Únete a la Curia
                    </h2>

                    <p className="
                        text-[10px]
                        font-bold
                        text-indigo-500
                        uppercase
                        tracking-[0.3em]
                    ">
                        Registro de Fieles
                    </p>

                </div>

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    {errors.general && (

                        <div className="
                            md:col-span-2
                            bg-rose-100
                            text-rose-600
                            rounded-2xl
                            p-4
                            text-sm
                            font-bold
                        ">
                            {errors.general}
                        </div>
                    )}

                    {/* AVATAR */}

                    <div className="md:col-span-2 mb-4">

                        <label className="
                            text-[9px]
                            font-black
                            text-slate-400
                            uppercase
                            tracking-widest
                            ml-2
                            mb-2
                            block
                        ">
                            Selecciona tu Identidad Visual
                        </label>

                        <div className="
                            flex
                            flex-col
                            items-center
                            gap-4
                            p-5
                            bg-slate-50
                            dark:bg-[#1A1F2B]
                            rounded-[2rem]
                            border
                            border-dashed
                            border-slate-200
                            dark:border-slate-700
                        ">

                            {/* PREVIEW */}

                            <div className="relative">

                                <div className="
                                    w-20
                                    h-20
                                    rounded-[1.8rem]
                                    bg-gradient-to-tr
                                    from-indigo-500
                                    to-purple-600
                                    p-0.5
                                    shadow-md
                                ">

                                    <div className="
                                        w-full
                                        h-full
                                        rounded-[1.7rem]
                                        bg-white
                                        dark:bg-[#11141D]
                                        overflow-hidden
                                    ">

                                        <img
                                            src={`/images/perfil/${data.foto_usu}`}
                                            className="w-full h-full object-cover"
                                        />

                                    </div>

                                </div>

                                <div className="
                                    absolute
                                    -bottom-1
                                    -right-1
                                    bg-white
                                    dark:bg-slate-800
                                    p-1.5
                                    rounded-full
                                    shadow-sm
                                    border
                                    border-slate-100
                                    dark:border-slate-700
                                ">

                                    <Camera
                                        size={12}
                                        className="text-indigo-500"
                                    />

                                </div>

                            </div>

                            {/* GRID */}

                            <div className="grid grid-cols-5 gap-2">

                                {avatars.map((img) => (

                                    <button
                                        key={img}
                                        type="button"
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                foto_usu: img,
                                            })
                                        }
                                        className={`
                                            w-10
                                            h-10
                                            rounded-xl
                                            overflow-hidden
                                            border-2
                                            transition-all
                                            hover:scale-110
                                            active:scale-95

                                            ${data.foto_usu === img
                                                ? `
                                                    border-indigo-500
                                                    shadow-lg
                                                    shadow-indigo-500/20
                                                    scale-105
                                                `
                                                : `
                                                    border-transparent
                                                    opacity-40
                                                    hover:opacity-100
                                                `
                                            }
                                        `}
                                    >

                                        <img
                                            src={`/images/perfil/${img}`}
                                            className="w-full h-full object-cover"
                                        />

                                    </button>
                                ))}

                            </div>

                        </div>

                    </div>

                    <Input
                        label="Nombre"
                        name="nom_per"
                        value={data.nom_per}
                        onChange={handleChange}
                        error={errors.nom_per}
                    />

                    <Input
                        label="Apellidos"
                        name="ap_pat_per"
                        value={data.ap_pat_per}
                        onChange={handleChange}
                        error={errors.ap_pat_per}
                    />

                    <Input
                        label="Carnet / CI"
                        name="carnet_per"
                        value={data.carnet_per}
                        onChange={handleChange}
                        error={errors.carnet_per}
                    />

                    <Input
                        label="Celular"
                        name="cel_per"
                        value={data.cel_per}
                        onChange={handleChange}
                        error={errors.cel_per}
                    />

                    <div className="md:col-span-2">

                        <Input
                            label="Correo Electrónico"
                            type="email"
                            name="correo_usu"
                            value={data.correo_usu}
                            onChange={handleChange}
                            error={errors.correo_usu}
                        />

                    </div>

                    <Input
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <Input
                        label="Confirmar"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={handleChange}
                    />

                    {/* SUBMIT */}

                    <button
                        disabled={processing}
                        className="
                            md:col-span-2
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
                            mt-4
                            flex
                            items-center
                            justify-center
                            gap-2
                            disabled:opacity-50
                        "
                    >

                        {processing
                            ? 'Procesando...'
                            : (
                                <>
                                    Crear mi Cuenta
                                    <ArrowRight size={14} />
                                </>
                            )
                        }

                    </button>

                </form>

                {/* GOOGLE */}

                <div className="mt-8">

                    <div className="relative mb-6">

                        <div className="absolute inset-0 flex items-center">

                            <div className="
                                w-full
                                border-t
                                border-slate-100
                                dark:border-slate-800
                            " />

                        </div>

                        <div className="
                            relative
                            flex
                            justify-center
                            text-[9px]
                            uppercase
                            font-black
                            tracking-[.2em]
                        ">

                            <span className="
                                bg-white
                                dark:bg-[#11141D]
                                px-4
                                text-slate-400
                            ">
                                O también puedes
                            </span>

                        </div>

                    </div>

                    <div className="flex justify-center">

                        <div
                            onClick={() => {
                                document
                                    .querySelector('[role="button"]')
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
                                Registrarme con Google
                            </span>

                        </div>

                        <div className="hidden">

                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.log('Google Login Error')
                                }}
                            />

                        </div>

                    </div>

                    {/* LOGIN */}

                    <p className="
                        text-center
                        text-[10px]
                        font-bold
                        text-slate-400
                        uppercase
                        tracking-widest
                        mt-6
                    ">

                        ¿Ya tienes cuenta?{' '}

                        <Link
                            to="/login"
                            className="
                                text-indigo-500
                                hover:underline
                            "
                        >
                            Inicia Sesión
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    )
}

function Input({ label, error, ...props }) {

    return (

        <div>

            <label className="
                text-[9px]
                font-black
                text-slate-400
                uppercase
                tracking-widest
                ml-2
            ">
                {label}
            </label>

            <input
                {...props}
                className="
                    w-full
                    bg-slate-50
                    dark:bg-[#1A1F2B]
                    border-none
                    rounded-2xl
                    py-3
                    px-4
                    dark:text-white
                    mt-1
                    focus:ring-2
                    focus:ring-indigo-500/20
                    transition-all
                "
            />

            {error && (

                <p className="
                    text-rose-500
                    text-[10px]
                    mt-1
                    ml-2
                ">
                    {error}
                </p>
            )}

        </div>
    )
}