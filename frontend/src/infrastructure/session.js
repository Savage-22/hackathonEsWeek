// Claves prefijadas con 'ag_' para no colisionar con otras apps del mismo origen
const TOKEN_KEY = 'ag_token'
const USER_KEY = 'ag_user'

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
}

export function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
}
