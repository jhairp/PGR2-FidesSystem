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

import BautizosIndex from '../modules/bautizos/pages/BautizosIndex'

import CentrosIndex from "../modules/centros/pages/CentrosIndex";

import CentroCreate from "../modules/centros/pages/CentroCreate";

import CentroEdit from "../modules/centros/pages/CentroEdit";

import IglesiasMapPage from '@/modules/iglesias/pages/IglesiasMapPage'

import CalendarioPage from '@/modules/eventos/pages/CalendarioPage'

import EventoPage from '@/modules/eventos/pages/EventoPage';

import CalendarioGeneralPage from '@/modules/eventos/pages/CalendarioGeneralPage';

import ScannerIndex from '../modules/scanner/pages/ScannerIndex'

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
                    element={<CalendarioGeneralPage />}
                />

                <Route
                    path="usuarios"
                    element={<UsuariosIndex />}
                />

                <Route
                    path="/bautizos"
                    element={<BautizosIndex />}
                />

                <Route
                    path="/scanner"
                    element={<ScannerIndex />}
                />

                <Route path="/centros" element={<CentrosIndex />} />

                <Route path="/centros/create" element={<CentroCreate />} />

                <Route path="/centros/edit/:id" element={<CentroEdit />} />

                <Route path="/iglesias" element={<IglesiasMapPage />} />

                <Route path="/calendario/:id" element={<CalendarioPage />} />

                <Route path="/evento" element={<EventoPage />}/>

                

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