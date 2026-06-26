export function validateFarmerLogin(body) {
    const errors = []
    if (!body.dni) errors.push('El DNI es requerido')
    if (!body.password) errors.push('La contraseña es requerida')
    return { isValid: errors.length === 0, errors }
}

export function validateInstitutionalLogin(body) {
    const errors = []
    if (!body.email) errors.push('El email es requerido')
    if (!body.password) errors.push('La contraseña es requerida')
    return { isValid: errors.length === 0, errors }
}
