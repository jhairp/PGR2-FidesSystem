import {
    Navigate,
} from 'react-router-dom'

import { useAuth }
from '../hooks/useAuth'

export default function ProtectedRoute({
    children,
}) {

    const {
        user,
        loading,
    } = useAuth()

    // esperando auth
    if (loading) {

        return (
            <div>
                Cargando...
            </div>
        )
    }

    // SIN LOGIN
    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        )
    }

    // CON LOGIN
    return children
}