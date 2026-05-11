import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './parts/Sidebar';
import Navbar from './parts/Navbar';
import Modal from '../UI/Modal';
//import UserProfileContent from './Parts/UserProfileContent';
import TopAlert from '@/Components/UI/TopAlert';

import {
    Outlet,
} from 'react-router-dom'
import UserProfileContent from './parts/UserProfileContent'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export default function MainLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [alert, setAlert] = useState({
        show: false,
        type: 'creado',
        message: '',
    });
    const triggerAlert = (type, message) => {
        setAlert({ show: true, type, message });

        setTimeout(() => {
            setAlert(a => ({ ...a, show: false }));
        }, 3000);
    };

    // 🔹 Exponerla globalmente (ESTO ES LO CORRECTO)
    useEffect(() => {
        window.triggerAlert = triggerAlert;
    }, []);

    const { user } = useAuth()

    const [showProfile,
    setShowProfile] =
    useState(false)

    useEffect(() => {

        if (user?.tema_usu === 'dark') {

            document.documentElement
                .classList.add('dark')

        } else {

            document.documentElement
                .classList.remove('dark')
        }

    }, [user?.tema_usu])

    return (
        <>
            <TopAlert
                show={alert.show}
                type={alert.type}
                message={alert.message}
            />

            <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] transition-colors duration-500 font-sans">
                <div className="flex relative">
                    {/* SIDEBAR */}
                    <Sidebar 
                        isOpen={isMobileMenuOpen} 
                        onClose={() => setIsMobileMenuOpen(false)} 
                    />

                    <div className="flex-1 min-w-0">
                        {/* NAVBAR */}
                        <Navbar 
                            onOpenMenu={() => setIsMobileMenuOpen(true)} 
                            onOpenProfile={() => setIsProfileOpen(true)}
                        />

                        {/* CONTENIDO PRINCIPAL CON ANIMACIONES */}
                        <main className="relative">
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={window.location.pathname}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto"
                                >
                                    <Outlet />
                                </motion.div>
                            </AnimatePresence>
                        </main>
                    </div>

                    {/* MODAL DE PERFIL (REUTILIZABLE) */}
                    <Modal 
                        show={isProfileOpen} 
                        onClose={() => setIsProfileOpen(false)}
                        title="Configuración de Perfil"
                    >
                        {/* <UserProfileContent auth={auth} /> */}
                        <UserProfileContent />
                    </Modal>

                    {/* OVERLAY PARA MÓVIL (SIDEBAR) */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-md z-[55] lg:hidden"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
    
}