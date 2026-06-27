/**
 * Auth Model
 *
 * Acceso a datos para autenticación: lee credenciales de farmers y users y da de
 * alta agricultores en el registro. Sin lógica de negocio (vive en el Service).
 */

import pool from '../../../../db.js'

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

    // Alta de agricultor con credenciales (registro #11). Solo devuelve lo que
    // necesita el token; nunca el password_hash.
    static async createFarmer({ name, dni, password_hash, community, district, province, phone, association }) {
        const result = await pool.query(
            `INSERT INTO farmers (name, dni, password_hash, community, district, province, phone, association)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id_farmer, name, dni`,
            [
                name,
                dni,
                password_hash,
                community ?? null,
                district ?? null,
                province ?? null,
                phone ?? null,
                association ?? null,
            ],
        )
        return result.rows[0]
    }
}

export default AuthModel
