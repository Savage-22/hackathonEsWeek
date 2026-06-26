import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '../errors.js'

const JWT_SECRET = process.env.JWT_SECRET

// Verifica el Bearer token y puebla req.user para requireRoles y los controllers
export function verifyToken(req, res, next) {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
        throw new UnauthorizedError('No autenticado')
    }

    let payload
    try {
        payload = jwt.verify(header.slice(7), JWT_SECRET)
    } catch {
        throw new UnauthorizedError('Token inválido o expirado')
    }

    req.user = payload
    next()
}
