import { UnauthorizedError, ForbiddenError } from '../errors.js'

// Una sola factory que cierra sobre los roles aceptados (no N funciones por rol).
// Requiere que verifyToken (módulo auth) haya poblado req.user antes.
export const requireRoles = (...roles) => (req, res, next) => {
    if (!req.user) throw new UnauthorizedError('No autenticado')
    if (!roles.includes(req.user.role)) throw new ForbiddenError('Acceso denegado')
    next()
}
