import { getPublicTraceabilityRequest } from '../api/publicTraceabilityApi.js'

// Devuelve { status: 'ok' | 'notfound' | 'error', data }. La página decide qué
// estado renderizar sin tener que interpretar excepciones.
export async function loadTraceability(code) {
    try {
        const response = await getPublicTraceabilityRequest(code)
        return { status: 'ok', data: response.data.data }
    } catch (error) {
        if (error.response?.status === 404) return { status: 'notfound' }
        return { status: 'error' }
    }
}

// Las fotos del backend son relativas (/uploads/..): se sirven desde el API.
export function photoSrc(photoUrl) {
    if (!photoUrl) return null
    return `${import.meta.env.VITE_API_URL}${photoUrl}`
}
