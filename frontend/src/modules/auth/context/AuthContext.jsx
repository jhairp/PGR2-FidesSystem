import {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react'

import { loginRequest } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const token = localStorage.getItem('token')

        const refresh = localStorage.getItem('refresh')

        if (token && refresh) {

            setUser({
                token,
                refresh,
            })
        }

        setLoading(false)

    }, [])

    const login = async (
        correo_usu,
        password
    ) => {

        try {

            const response = await loginRequest({
                correo_usu,
                password,
            })

            localStorage.setItem(
                'token',
                response.access
            )

            localStorage.setItem(
                'refresh',
                response.refresh
            )

            setUser({
                token: response.access,
                refresh: response.refresh,
            })

            return response

        } catch (error) {

            console.error(error)

            throw error
        }
    }

    const logout = () => {

        localStorage.removeItem('token')

        localStorage.removeItem('refresh')

        setUser(null)
    }

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                isAuthenticated: !!user,
            }}
        >

            {children}

        </AuthContext.Provider>
    )
}

export const useAuth = () => {

    return useContext(AuthContext)
}