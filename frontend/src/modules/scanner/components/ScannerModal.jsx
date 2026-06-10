import { X } from 'lucide-react'

import {
    AnimatePresence,
    motion
} from 'framer-motion'

import DocumentScanner from './DocumentScanner'

export default function ScannerModal({

    show,
    onClose,

    createBautizo,
    usuarios,
    centros,

    loading,

}) {

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
                            scale: 0.95
                        }}

                        animate={{
                            opacity: 1,
                            scale: 1
                        }}

                        exit={{
                            opacity: 0,
                            scale: 0.95
                        }}

                        className="
                            relative

                            w-full
                            max-w-7xl

                            h-[90vh]

                            bg-white
                            rounded-[2.8rem]

                            overflow-hidden
                        "
                    >

                        <button
                            onClick={onClose}
                            className="
                                absolute
                                top-6
                                right-6
                                z-50
                            "
                        >

                            <X />

                        </button>

                        <div
                            className="
                                h-full
                                overflow-y-auto
                                p-10
                            "
                        >

                            <DocumentScanner

                                createBautizo={createBautizo}

                                usuarios={usuarios}

                                centros={centros}

                                loading={loading}

                                onClose={onClose}

                            />

                        </div>

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>
    )
}