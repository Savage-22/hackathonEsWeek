// Validadores de agricultor (patrón Strategy): funciones puras { isValid, errors }.

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0
}

export function validateFarmerCreate(body) {
    const errors = []
    if (!isNonEmptyString(body.name)) errors.push('El nombre es requerido')
    if (!isNonEmptyString(body.dni)) errors.push('El DNI es requerido')
    return { isValid: errors.length === 0, errors }
}

// En la actualización los campos son opcionales, pero si llegan no pueden venir vacíos.
export function validateFarmerUpdate(body) {
    const errors = []
    if (body.name !== undefined && !isNonEmptyString(body.name)) {
        errors.push('El nombre no puede estar vacío')
    }
    if (body.dni !== undefined && !isNonEmptyString(body.dni)) {
        errors.push('El DNI no puede estar vacío')
    }
    return { isValid: errors.length === 0, errors }
}
