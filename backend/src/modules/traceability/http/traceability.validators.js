// Validador de generación de lote (patrón Strategy).
function isPositiveInt(value) {
    const num = Number(value)
    return Number.isInteger(num) && num > 0
}

export function validateBatchCreate(body) {
    const errors = []
    if (!isPositiveInt(body.id_plot)) errors.push('La parcela (id_plot) es requerida y válida')
    if (!body.local_id) errors.push('local_id es requerido (idempotencia offline)')
    return { isValid: errors.length === 0, errors }
}
