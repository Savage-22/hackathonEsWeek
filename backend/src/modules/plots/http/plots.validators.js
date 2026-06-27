// Validadores de parcela (patrón Strategy): funciones puras { isValid, errors }.

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0
}

// Coordenada opcional, pero si llega debe ser un número en rango geográfico.
function validateCoordinate(value, { min, max, label }, errors) {
    if (value === undefined || value === null) return
    const num = Number(value)
    if (Number.isNaN(num) || num < min || num > max) {
        errors.push(`${label} debe estar entre ${min} y ${max}`)
    }
}

function validateOptionalNumber(value, label, errors) {
    if (value === undefined || value === null) return
    const num = Number(value)
    if (Number.isNaN(num) || num < 0) errors.push(`${label} debe ser un número válido`)
}

export function validatePlotCreate(body) {
    const errors = []
    if (!isNonEmptyString(body.name)) errors.push('El nombre de la parcela es requerido')
    if (!isNonEmptyString(body.crop)) errors.push('El cultivo es requerido')
    validateCoordinate(body.latitude, { min: -90, max: 90, label: 'La latitud' }, errors)
    validateCoordinate(body.longitude, { min: -180, max: 180, label: 'La longitud' }, errors)
    validateOptionalNumber(body.area_ha, 'El área', errors)
    return { isValid: errors.length === 0, errors }
}

export function validatePlotUpdate(body) {
    const errors = []
    if (body.name !== undefined && !isNonEmptyString(body.name)) {
        errors.push('El nombre no puede estar vacío')
    }
    if (body.crop !== undefined && !isNonEmptyString(body.crop)) {
        errors.push('El cultivo no puede estar vacío')
    }
    validateCoordinate(body.latitude, { min: -90, max: 90, label: 'La latitud' }, errors)
    validateCoordinate(body.longitude, { min: -180, max: 180, label: 'La longitud' }, errors)
    validateOptionalNumber(body.area_ha, 'El área', errors)
    return { isValid: errors.length === 0, errors }
}
