import { loginFarmerRequest } from '../api/farmerAuthApi.js'
import { setSession } from '../../../../infrastructure/session.js'

export async function loginFarmer(dni, password) {
    const response = await loginFarmerRequest(dni, password)
    const { token, user } = response.data.data
    setSession(token, user)
    return user
}

export function getFarmerAuthErrorMessage(error) {
    if (error.response?.data?.message) {
        return error.response.data.message
    }
    if (error.response?.data?.errors?.length) {
        return error.response.data.errors.join(', ')
    }
    return 'No se pudo iniciar sesión.'
}
