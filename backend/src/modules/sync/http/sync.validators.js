// Valida el batch de sincronización antes del controller (patrón Strategy).
export function validateSyncPush(body) {
    const errors = []

    if (!Array.isArray(body.operations)) {
        errors.push('operations debe ser un arreglo')
        return { isValid: false, errors }
    }

    body.operations.forEach((op, index) => {
        if (!op || typeof op !== 'object') {
            errors.push(`Operación ${index}: formato inválido`)
            return
        }
        if (!op.entity) errors.push(`Operación ${index}: entity es requerido`)
        if (op.localId === undefined || op.localId === null) {
            errors.push(`Operación ${index}: localId es requerido`)
        }
        if (!op.payload || typeof op.payload !== 'object') {
            errors.push(`Operación ${index}: payload es requerido`)
        }
    })

    return { isValid: errors.length === 0, errors }
}
