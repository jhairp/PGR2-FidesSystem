import { Routes, Route } from 'react-router-dom'

import MainLayout from '../components/layout/MainLayout'

import Dashboard from '../pages/Dashboard'

import UsuariosIndex from '../modules/usuarios/pages/UsuariosIndex'

import Login from '../modules/auth/pages/Login'

export default function AppRoutes() {

    return (

        <Routes>

            <Route
                path="/login"
                element={<Login />}
            />
            
            <Route
                path="/"
                element={
                    <MainLayout>
                        <Dashboard />
                    </MainLayout>
                }
            />

            <Route
                path="/usuarios"
                element={
                    <MainLayout>
                        <UsuariosIndex />
                    </MainLayout>
                }
            />

        </Routes>
    )
}