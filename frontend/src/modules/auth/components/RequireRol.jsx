import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { puedeVer, puedeEditar } from '../roles'

// Guarda una ruta por rol. Si el usuario no cumple, redirige a "/".
// `editar`: exige permiso de escritura (p.ej. /evento crea); por defecto basta con ver.
// UX (oculta lo que el menú ya oculta); la seguridad real es backend.
export default function RequireRol({ mod, editar = false, children }) {

    const { user } = useAuth()

    const ok = editar ? puedeEditar(user, mod) : puedeVer(user, mod)

    if (!ok) {
        return <Navigate to="/" replace />
    }

    return children
}
