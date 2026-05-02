import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react'

const AuthContext = createContext()

export function AuthProvider({
    children,
}) {

    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const token =
            localStorage.getItem('access')

        if (token) {

            setUser({
                authenticated: true,
            })
        }

        setLoading(false)

    }, [])

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
            }}
        >

            {children}

        </AuthContext.Provider>
    )
}

export const useAuthContext = () =>
    useContext(AuthContext)