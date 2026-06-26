import { Navigate, Outlet } from 'react-router'

import { getToken, getUser } from '../../infrastructure/session.js'

const INSTITUTIONAL_ROLES = ['DRA', 'MUNICIPALIDAD', 'COOPERATIVA']

export default function InstitutionalGuard() {
    const token = getToken()
    const user = getUser()

    // Un agricultor (rol FARMER) no puede entrar al panel institucional
    if (!token || !INSTITUTIONAL_ROLES.includes(user?.role)) {
        return <Navigate to="/panel/login" replace />
    }

    return <Outlet />
}
