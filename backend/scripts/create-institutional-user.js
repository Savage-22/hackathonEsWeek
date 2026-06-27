/**
 * Crear usuario institucional (#37)
 *
 * Inserta (o actualiza la clave de) un usuario institucional con la contraseña
 * hasheada con bcrypt. Pensado para sembrar el PRIMER acceso al panel (#24) de
 * forma reproducible, sin credenciales en el repositorio.
 *
 * Los datos vienen por argumentos --clave=valor o por variables de entorno;
 * nunca están hardcodeados. La contraseña jamás se guarda en texto plano.
 *
 * Uso:
 *   node scripts/create-institutional-user.js \
 *     --email=dra@huanuco.gob.pe --name="DRA Huánuco" \
 *     --password='claveSegura' --role=DRA --district=Huánuco
 *
 * o por entorno:
 *   IU_EMAIL=... IU_NAME=... IU_PASSWORD=... IU_ROLE=DRA IU_DISTRICT=... \
 *     node scripts/create-institutional-user.js
 *
 * Si el email ya existe, actualiza nombre/rol/distrito y restablece la clave.
 */
import 'dotenv/config'
import bcrypt from 'bcrypt'

import pool from '../db.js'

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10
const VALID_ROLES = ['DRA', 'MUNICIPALIDAD', 'COOPERATIVA']

// Lee --clave=valor de argv; cae a la variable de entorno IU_<CLAVE>.
function readArg(name) {
    const prefix = `--${name}=`
    const fromArgv = process.argv.find((arg) => arg.startsWith(prefix))
    if (fromArgv) return fromArgv.slice(prefix.length)
    return process.env[`IU_${name.toUpperCase()}`]
}

async function createInstitutionalUser() {
    const name = readArg('name')
    const email = readArg('email')
    const password = readArg('password')
    const role = readArg('role')
    const district = readArg('district') || null

    const missing = []
    if (!name) missing.push('name')
    if (!email) missing.push('email')
    if (!password) missing.push('password')
    if (!role) missing.push('role')
    if (missing.length > 0) {
        throw new Error(`Faltan datos: ${missing.join(', ')} (usa --clave=valor o IU_CLAVE).`)
    }

    if (!VALID_ROLES.includes(role)) {
        throw new Error(`Rol inválido "${role}". Debe ser uno de: ${VALID_ROLES.join(', ')}.`)
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, role, district)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE
            SET name = EXCLUDED.name,
                password_hash = EXCLUDED.password_hash,
                role = EXCLUDED.role,
                district = EXCLUDED.district,
                is_active = TRUE
         RETURNING id_user, (xmax = 0) AS inserted`,
        [name, email, passwordHash, role, district],
    )

    const { id_user, inserted } = result.rows[0]
    return { id: id_user, email, role, created: inserted }
}

createInstitutionalUser()
    .then(({ id, email, role, created }) => {
        console.log(`✓ Usuario institucional ${created ? 'creado' : 'actualizado'} (id ${id})`)
        console.log(`  ${email} · rol ${role}`)
        return pool.end()
    })
    .catch((err) => {
        console.error('✗ No se pudo crear el usuario:', err.message)
        pool.end()
        process.exit(1)
    })
