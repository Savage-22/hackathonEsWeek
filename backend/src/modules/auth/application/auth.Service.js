import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import AuthModel from '../infrastructure/auth.Model.js'
import { UnauthorizedError } from '../../../shared/errors.js'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Rol del agricultor en el token; los institucionales usan su rol de la BD
const FARMER_ROLE = 'FARMER'

function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

class AuthService {
    static async loginFarmer(dni, password) {
        const farmer = await AuthModel.findFarmerByDni(dni)
        // Mismo error ante DNI inexistente o sin clave: no se filtra qué falló
        if (!farmer || !farmer.password_hash) {
            throw new UnauthorizedError('Credenciales inválidas')
        }

        const isValid = await bcrypt.compare(password, farmer.password_hash)
        if (!isValid) throw new UnauthorizedError('Credenciales inválidas')

        const user = { id: farmer.id_farmer, name: farmer.name, role: FARMER_ROLE, kind: 'farmer' }
        return { token: signToken(user), user }
    }

    static async loginInstitutional(email, password) {
        const account = await AuthModel.findUserByEmail(email)
        if (!account) throw new UnauthorizedError('Credenciales inválidas')

        const isValid = await bcrypt.compare(password, account.password_hash)
        if (!isValid) throw new UnauthorizedError('Credenciales inválidas')

        const user = { id: account.id_user, name: account.name, role: account.role, kind: 'institutional' }
        return { token: signToken(user), user }
    }
}

export default AuthService
