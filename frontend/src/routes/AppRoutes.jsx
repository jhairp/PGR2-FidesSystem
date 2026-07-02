// ARCHIVO COMPLETO — reemplaza frontend/src/routes/AppRoutes.jsx
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

import RequireRol from '@/modules/auth/components/RequireRol'

import Register from '../modules/auth/pages/Register'

import CompleteGoogleData from '../modules/auth/pages/CompleteGoogleData'

import BautizosIndex from '../modules/bautizos/pages/BautizosIndex'

import CertificadoEditorPage from '../modules/bautizos/pages/CertificadoEditorPage'

import CentrosIndex from "../modules/centros/pages/CentrosIndex";

import CentroCreate from "../modules/centros/pages/CentroCreate";

import CentroEdit from "../modules/centros/pages/CentroEdit";

import IglesiasMapPage from '@/modules/iglesias/pages/IglesiasMapPage'

import CalendarioPage from '@/modules/eventos/pages/CalendarioPage'

import EventoPage from '@/modules/eventos/pages/EventoPage';

import CalendarioGeneralPage from '@/modules/eventos/pages/CalendarioGeneralPage';

import ScannerIndex from '../modules/scanner/pages/ScannerIndex'

// ── NUEVO ──
import DocumentosIndex from '../modules/documentos/pages/DocumentosIndex'

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
                    element={<RequireRol mod="usuarios"><UsuariosIndex /></RequireRol>}
                />

                <Route
                    path="/bautizos"
                    element={<RequireRol mod="bautizos"><BautizosIndex /></RequireRol>}
                />

                <Route
                    path="/bautizos/certificado-editor"
                    element={<RequireRol mod="bautizos"><CertificadoEditorPage /></RequireRol>}
                />

                <Route
                    path="/scanner"
                    element={<RequireRol mod="scanner"><ScannerIndex /></RequireRol>}
                />

                <Route path="/centros" element={<RequireRol mod="centros"><CentrosIndex /></RequireRol>} />

                <Route path="/centros/create" element={<RequireRol mod="centros"><CentroCreate /></RequireRol>} />

                <Route path="/centros/edit/:id" element={<RequireRol mod="centros"><CentroEdit /></RequireRol>} />

                <Route path="/iglesias" element={<RequireRol mod="iglesias"><IglesiasMapPage /></RequireRol>} />

                <Route path="/calendario/:id" element={<CalendarioPage />} />

                <Route path="/evento" element={<RequireRol mod="calendario" editar><EventoPage /></RequireRol>}/>

                {/* ── NUEVA RUTA ── */}
                <Route path="/documentos" element={<RequireRol mod="documentos"><DocumentosIndex /></RequireRol>} />

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
