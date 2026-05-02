import { useState } from 'react'

import { login } from '../services/authService'

export default function useAuth() {

    const [loading, setLoading] = useState(false)

    const handleLogin = async (data) => {

        try {

            setLoading(true)

            const response = await login(data)

            localStorage.setItem(
                'access',
                response.access
            )

            localStorage.setItem(
                'refresh',
                response.refresh
            )

            return true

        } catch (error) {

            console.log(error)

            return false

        } finally {

            setLoading(false)
        }
    }

    return {
        loading,
        handleLogin,
    }
}