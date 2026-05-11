import { X } from 'lucide-react'

import {
    AnimatePresence,
    motion
} from 'framer-motion'

import BautizoForm from './BautizoForm'

export default function BautizoEditModal({

    show,
    onClose,

    onSubmit,

    loading,

    bautizo,

    usuarios,

}) {

    if (!bautizo) return null

    return (

        <AnimatePresence>

            {show && (

                <motion.div

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}

                    className="
                        fixed inset-0
                        z-[9999]

                        flex items-center justify-center

                        bg-black/50
                        backdrop-blur-sm

                        p-6
                    "
                >

                    <motion.div

                        initial={{
                            opacity: 0,
                            scale: 0.96,
                            y: 20
                        }}

                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}

                        exit={{
                            opacity: 0,
                            scale: 0.96,
                            y: 20
                        }}

                        transition={{
                            duration: 0.25
                        }}

                        className="
                            relative

                            w-full
                            max-w-6xl

                            h-[88vh]

                            bg-white
                            dark:bg-[#0F172A]

                            rounded-[2.8rem]

                            overflow-hidden

                            border border-slate-200
                            dark:border-slate-800

                            shadow-[0_20px_100px_rgba(0,0,0,0.22)]
                        "
                    >

                        {/* CERRAR */}

                        <button

                            onClick={onClose}

                            className="
                                absolute top-6 right-6
                                z-50

                                w-12 h-12

                                rounded-2xl

                                bg-white/10
                                hover:bg-white/20

                                backdrop-blur-md

                                flex items-center justify-center

                                transition-all
                            "
                        >

                            <X
                                size={24}
                                className="text-white"
                            />

                        </button>

                        {/* HEADER */}

                        <div className="
                            px-14 py-8

                            bg-gradient-to-r
                            from-amber-500
                            via-yellow-500
                            to-orange-500
                        ">

                            <h1 className="
                                text-3xl xl:text-4xl
                                font-black

                                uppercase

                                tracking-[0.18em]

                                text-white
                            ">

                                Editar Bautizo

                            </h1>

                        </div>

                        {/* CONTENIDO */}

                        <div className="
                            h-[calc(88vh-120px)]

                            overflow-y-auto

                            px-14
                            py-10
                        ">

                            <BautizoForm

                                initialData={bautizo}

                                onSubmit={onSubmit}

                                loading={loading}

                                usuarios={usuarios}

                            />

                        </div>

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>
    )
}