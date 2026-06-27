/**
 * Subida de archivos (multer)
 *
 * Almacenamiento simple en disco bajo `uploads/`. La URL pública resultante se
 * guarda en la columna correspondiente (p. ej. applications.photo_url). Para la
 * demo basta el disco local; en producción se cambiaría por un bucket.
 */
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'

import multer from 'multer'

import { ValidationError } from '../errors.js'

// Carpeta de subidas en la raíz del backend; se crea si no existe.
export const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads')
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        // Nombre opaco + extensión original: evita colisiones y path traversal.
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, `${randomUUID()}${ext}`)
    },
})

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])

function fileFilter(req, file, cb) {
    if (ALLOWED.has(file.mimetype)) return cb(null, true)
    cb(new ValidationError('Validación fallida', ['La foto debe ser JPG, PNG o WEBP']))
}

// 5 MB es suficiente para una foto de campo y acota el almacenamiento.
export const uploadPhoto = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
})

// URL pública servida por express.static (ver app.js).
export function publicUrlFor(filename) {
    return `/uploads/${filename}`
}

// Middleware para un único campo `photo`. Normaliza los errores de multer
// (tamaño, tipo) a ValidationError 400 para que no caigan como 500.
export const uploadSinglePhoto = (req, res, next) => {
    uploadPhoto.single('photo')(req, res, (error) => {
        if (!error) return next()
        if (error instanceof multer.MulterError) {
            return next(new ValidationError('Validación fallida', [
                error.code === 'LIMIT_FILE_SIZE' ? 'La foto supera el tamaño máximo (5 MB)' : 'Archivo inválido',
            ]))
        }
        next(error)
    })
}
