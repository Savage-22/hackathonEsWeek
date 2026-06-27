export function validateFarmerLogin(body) {
    const errors = []
    if (!body.dni) errors.push('El DNI es requerido')
    if (!body.password) errors.push('La contraseña es requerida')
    return { isValid: errors.length === 0, errors }
}

export function validateFarmerRegister(body) {
    const errors = []
    if (!body.name || !String(body.name).trim()) errors.push('El nombre es requerido')
    if (!body.dni || !String(body.dni).trim()) errors.push('El DNI es requerido')
    if (!body.password || String(body.password).length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres')
    }
    return { isValid: errors.length === 0, errors }
}

export function validateInstitutionalLogin(body) {
    const errors = []
    if (!body.email) errors.push('El email es requerido')
    if (!body.password) errors.push('La contraseña es requerida')
    return { isValid: errors.length === 0, errors }
}
