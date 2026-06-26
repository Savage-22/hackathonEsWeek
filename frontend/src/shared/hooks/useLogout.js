import { useNavigate } from 'react-router'

import { clearSession } from '../../infrastructure/session.js'

export function useLogout(redirectTo) {
    const navigate = useNavigate()

    return () => {
        clearSession()
        navigate(redirectTo, { replace: true })
    }
}
