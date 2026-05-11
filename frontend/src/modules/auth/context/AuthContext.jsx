import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

import {
    loginRequest,
    meRequest
} from '../services/authService'

export const AuthContext =
    createContext()

export const AuthProvider = ({
    children,
}) => {

    const [user, setUser] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {

    const loadUser = async () => {

        try {

            const token =
                localStorage.getItem('token')

            if (!token) {

                setLoading(false)

                return
            }

            const userData =
                await meRequest()

            setUser(userData)

        } catch (error) {

            console.log(error)

            localStorage.clear()

            setUser(null)

        } finally {

            setLoading(false)
        }
    }

    loadUser()

}, [])
    // LOGIN

    const login = async (
        correo_usu,
        password
    ) => {

        const response =
            await loginRequest({
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

        // 👇 CARGAR USUARIO REAL

        const userData =
            await meRequest()

        setUser(userData)

        return response
    }

    // LOGOUT

    const logout = () => {

        localStorage.clear()

        setUser(null)
    }

    return (

        <AuthContext.Provider
            value={{

                user,

                setUser,
                
                loading,

                login,

                logout,
            }}
        >

            {children}

        </AuthContext.Provider>
    )
}

export const useAuth = () =>
    useContext(AuthContext)
