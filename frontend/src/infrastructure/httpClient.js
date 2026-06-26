import axios from 'axios'

import { getToken, clearSession } from './session.js'

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

// Request: inyecta el token; deja que el navegador fije Content-Type en multipart
httpClient.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    if (config.data instanceof FormData) delete config.headers['Content-Type']
    return config
})

// Response: cierra sesión automáticamente ante un 401
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) clearSession()
        return Promise.reject(error)
    },
)

export default httpClient
