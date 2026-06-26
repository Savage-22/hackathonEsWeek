/**
 * Auth Model
 *
 * Acceso a datos para autenticación. Solo lee credenciales de farmers y users;
 * sin lógica de negocio.
 */

import pool from '../../../db.js'

class AuthModel {
    static async findFarmerByDni(dni) {
        const result = await pool.query(
            'SELECT id_farmer, name, dni, password_hash FROM farmers WHERE dni = $1 AND is_active = TRUE',
            [dni],
        )
        return result.rows[0]
    }

    static async findUserByEmail(email) {
        const result = await pool.query(
            'SELECT id_user, name, email, password_hash, role FROM users WHERE email = $1 AND is_active = TRUE',
            [email],
        )
        return result.rows[0]
    }
}

export default AuthModel
