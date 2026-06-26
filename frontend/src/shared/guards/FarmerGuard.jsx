import { Navigate, Outlet } from 'react-router'

import { getToken, getUser } from '../../infrastructure/session.js'

// Lee la sesión local (sin red): la PWA del agricultor debe funcionar offline
export default function FarmerGuard() {
    const token = getToken()
    const user = getUser()

    if (!token || user?.role !== 'FARMER') {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
