import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function SuccessAnimation({ show, onClose }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-lg"
                >
                    <motion.div 
                        initial={{ scale: 0.5, y: 100 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.5, y: 100 }}
                        className="text-center p-8"
                    >
                        <div className="relative flex justify-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="bg-indigo-500 p-6 rounded-full shadow-2xl shadow-indigo-500/50"
                            >
                                <Mail size={60} className="text-white" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 40 }}
                                transition={{ delay: 0.5 }}
                                className="absolute top-0 right-0 bg-emerald-500 rounded-full p-2 border-4 border-slate-900"
                            >
                                <CheckCircle2 size={30} className="text-white" />
                            </motion.div>
                        </div>

                        <motion.h2 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-3xl font-black text-white mb-2 tracking-tight"
                        >
                            ¡USUARIO CREADO!
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-slate-400 font-medium text-lg max-w-xs mx-auto"
                        >
                            Las credenciales de acceso han sido enviadas al correo electrónico.
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            onClick={onClose}
                            className="mt-8 px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                        >
                            Entendido
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}