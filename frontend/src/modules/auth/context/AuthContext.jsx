import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

import {
    loginRequest,
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

        const token =
            localStorage.getItem('token')

        if (token) {

            setUser({
                token,
            })
        }

        setLoading(false)

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

        setUser({
            token: response.access,
        })

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