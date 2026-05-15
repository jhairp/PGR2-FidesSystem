import {
    Outlet,
} from 'react-router-dom'

export default function UserLayout() {

    return (

        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14]">

            <div className="p-10">

                <h1 className="text-4xl font-black dark:text-white">

                    Vista Usuario

                </h1>

                <Outlet />

            </div>

        </div>
    )
}