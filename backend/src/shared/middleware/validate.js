import { ValidationError } from '../errors.js'

// Aplica el validador del dominio antes del controller (patrón Strategy).
// Cada validador es una función pura que devuelve { isValid, errors }.
export const validate = (validator) => (req, res, next) => {
    const result = validator(req.body)
    if (!result.isValid) throw new ValidationError('Validación fallida', result.errors)
    next()
}
