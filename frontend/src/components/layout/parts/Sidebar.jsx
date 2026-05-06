import React from 'react'

import {
    Cross,
    X,
    Home,
    MapPin,
    PieChart,
    Shield,
    Users,
    LogOut,
} from 'lucide-react'

import {
    useLocation,
    useNavigate,
} from 'react-router-dom'

import NavItem from './NavItem'

import { useAuth }
from '@/modules/auth/hooks/useAuth'

export default function Sidebar({
    isOpen,
    onClose,
}) {

    const location = useLocation()

    const navigate = useNavigate()

    const { logout } = useAuth()

    const url = location.pathname

    const handleLogout = () => {

        document.documentElement
            .classList
            .remove('dark')

        logout()

        navigate('/login')
    }

    return (

        <aside className={`
            fixed inset-y-0 left-0 z-[60]
            w-72
            bg-white dark:bg-[#11141D]
            border-r border-slate-200 dark:border-slate-800
            transition-transform duration-500
            lg:translate-x-0
            lg:sticky
            lg:top-0
            lg:h-screen
            ${isOpen
                ? 'translate-x-0'
                : '-translate-x-full'
            }
        `}>

            <div className="flex flex-col h-full">

                {/* HEADER */}

                <div className="p-8 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="
                            w-10 h-10
                            bg-indigo-600
                            rounded-2xl
                            flex items-center justify-center
                            text-white
                            shadow-xl
                        ">

                            <Cross size={20} />

                        </div>

                        <div className="leading-none">

                            <span className="
                                font-black
                                text-xl
                                tracking-tighter
                                dark:text-white
                                uppercase
                                block
                            ">

                                Curia

                            </span>

                            <span className="
                                text-[9px]
                                font-bold
                                text-indigo-500
                                uppercase
                                tracking-[0.3em]
                            ">

                                Digital

                            </span>

                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className="
                            lg:hidden
                            p-2
                            text-slate-400
                        "
                    >

                        <X size={20} />

                    </button>

                </div>

                {/* NAV */}

                <nav className="
                    flex-1
                    px-6
                    space-y-2
                    overflow-y-auto
                    py-4
                ">

                    <NavItem
                        href="/"
                        icon={<PieChart size={20} />}
                        label="Panel de Control"
                        active={url === '/'}
                        onClick={onClose}
                    />

                    <div className="pt-4 pb-2">

                        <span className="
                            px-4
                            text-[9px]
                            font-black
                            text-slate-400
                            uppercase
                            tracking-[0.3em]
                        ">

                            Administración

                        </span>

                    </div>

                    <NavItem
                        href="/roles"
                        icon={<Shield size={20} />}
                        label="Roles del sistema"
                        active={url.startsWith('/roles')}
                        onClick={onClose}
                    />

                    <NavItem
                        href="/per-roles"
                        icon={<Shield size={20} />}
                        label="Roles de personas"
                        active={url.startsWith('/per-roles')}
                        onClick={onClose}
                    />

                    <NavItem
                        href="/usuarios"
                        icon={<Users size={20} />}
                        label="Usuarios"
                        active={url.startsWith('/usuarios')}
                        onClick={onClose}
                    />

                    <NavItem
                        href="/parroquias"
                        icon={<Home size={20} />}
                        label="Parroquias"
                        active={url.startsWith('/parroquias')}
                        onClick={onClose}
                    />

                    <NavItem
                        href="/centros"
                        icon={<MapPin size={20} />}
                        label="Centros"
                        active={url.startsWith('/centros')}
                        onClick={onClose}
                    />

                </nav>

                {/* LOGOUT */}

                <div className="
                    p-8
                    border-t
                    border-slate-100
                    dark:border-slate-800
                ">

                    <button
                        onClick={handleLogout}
                        className="
                            flex items-center gap-4
                            w-full p-4
                            text-rose-500
                            hover:bg-rose-50
                            dark:hover:bg-rose-500/10
                            rounded-2xl
                            transition-all
                            font-black
                            text-[10px]
                            uppercase
                            tracking-widest
                        "
                    >

                        <LogOut size={16} />

                        Salir

                    </button>

                </div>

            </div>

        </aside>
    )
}