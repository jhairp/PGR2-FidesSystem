import {
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'

import MainLayout from '../components/layout/MainLayout'

import Dashboard from '../pages/Dashboard'

import UsuariosIndex from '../modules/usuarios/pages/UsuariosIndex'

import Login from '../modules/auth/pages/Login'

import ProtectedRoute from '@/modules/auth/components/ProtectedRoute'

export default function AppRoutes() {

    return (

        <Routes>

            {/* LOGIN */}

            <Route
                path="/login"
                element={<Login />}
            />

            {/* PRIVADAS */}

            <Route
                path="/"
                element={

                    <ProtectedRoute>

                        <MainLayout />

                    </ProtectedRoute>
                }
            >

                <Route
                    index
                    element={<Dashboard />}
                />

                <Route
                    path="usuarios"
                    element={<UsuariosIndex />}
                />

            </Route>

            {/* REDIRECT */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    )
}