import { loginInstitutionalRequest } from '../api/institutionalAuthApi.js'
import { setSession } from '../../../../infrastructure/session.js'

export async function loginInstitutional(email, password) {
    const response = await loginInstitutionalRequest(email, password)
    const { token, user } = response.data.data
    setSession(token, user)
    return user
}

export function getInstitutionalAuthErrorMessage(error) {
    if (error.response?.data?.message) {
        return error.response.data.message
    }
    if (error.response?.data?.errors?.length) {
        return error.response.data.errors.join(', ')
    }
    return 'No se pudo iniciar sesión.'
}
