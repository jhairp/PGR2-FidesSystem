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

import Register from '../modules/auth/pages/Register'

import CompleteGoogleData from '../modules/auth/pages/CompleteGoogleData'

export default function AppRoutes() {

    return (

        <Routes>

            {/* LOGIN */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/complete-google-data"
                element={<CompleteGoogleData />}
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