import {
    Cross,
    X,
    MapPin,
    Calendar,
    Users,
    LogOut,
    BookOpen,
    FolderOpen,
    ScanLine,
    Church,
} from 'lucide-react'

import {
    useLocation,
    useNavigate,
} from 'react-router-dom'

import NavItem from './NavItem'

import { useAuth } from '@/modules/auth/hooks/useAuth'

import { puedeVer } from '@/modules/auth/roles'

// Items del menú. `mod` decide la visibilidad por rol (ver roles.js).
const NAV_ITEMS = [
    { href: '/',            icon: Calendar,   label: 'Calendario', mod: 'calendario' },
    { href: '/usuarios',    icon: Users,      label: 'Usuarios',   mod: 'usuarios' },
    { href: '/centros',     icon: MapPin,     label: 'Centros',    mod: 'centros' },
    { href: '/bautizos',    icon: BookOpen,   label: 'Bautizos',   mod: 'bautizos' },
    { href: '/documentos',  icon: FolderOpen, label: 'Documentos', mod: 'documentos' },
    { href: '/scanner',     icon: ScanLine,   label: 'Scanner',    mod: 'scanner' },
    { href: '/iglesias',    icon: Church,     label: 'Iglesias',   mod: 'iglesias' },
]

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

    const handleNavClick = () => {

        if (window.innerWidth < 1024) {

            onClose()
        }
    }
    
    const { user } = useAuth()

    return (

        <aside className={`
    fixed inset-y-0 left-0 z-[60]
    w-72
    bg-white dark:bg-[#11141D]
    border-r border-slate-200 dark:border-slate-800
    transition-transform duration-500
    top-0
    h-screen
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
                        onClick={handleNavClick}
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
                    {
                        NAV_ITEMS
                            .filter(item => puedeVer(user, item.mod))
                            .map(({ href, icon: Icon, label, mod }) => (
                                <NavItem
                                    key={mod}
                                    href={href}
                                    icon={<Icon size={20} />}
                                    label={label}
                                    active={
                                        href === '/'
                                            ? url === '/'
                                            : url.startsWith(href)
                                    }
                                    onClick={handleNavClick}
                                />
                            ))
                    }

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
