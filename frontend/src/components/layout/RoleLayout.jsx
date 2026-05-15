import MainLayout
from './MainLayout'

import UserLayout
from './UserLayout'

import { useAuth }
from '@/modules/auth/hooks/useAuth'

export default function RoleLayout() {

    const { user } = useAuth()

    const isAdmin =

        [1,2,3].includes(
            user?.id_rol_1
        )

    return (

        isAdmin

            ? <MainLayout />

            : <UserLayout />
    )
}