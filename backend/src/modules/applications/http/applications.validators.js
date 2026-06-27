// Validador de aplicación (patrón Strategy). Los campos llegan como texto
// (multipart), así que se coercionan con Number antes de evaluarlos.

function isPositiveInt(value) {
    const num = Number(value)
    return Number.isInteger(num) && num > 0
}

function isPositiveNumber(value) {
    const num = Number(value)
    return !Number.isNaN(num) && num > 0
}

export function validateApplicationCreate(body) {
    const errors = []
    if (!isPositiveInt(body.id_plot)) errors.push('La parcela (id_plot) es requerida y válida')
    if (!isPositiveInt(body.id_pesticide)) errors.push('El pesticida (id_pesticide) es requerido y válido')
    if (!body.applied_at || Number.isNaN(new Date(body.applied_at).getTime())) {
        errors.push('La fecha/hora de aplicación es requerida y válida')
    }
    if (!isPositiveNumber(body.dose)) errors.push('La dosis debe ser un número mayor que 0')
    if (body.quantity !== undefined && body.quantity !== '' && !isPositiveNumber(body.quantity)) {
        errors.push('La cantidad debe ser un número mayor que 0')
    }
    return { isValid: errors.length === 0, errors }
}
