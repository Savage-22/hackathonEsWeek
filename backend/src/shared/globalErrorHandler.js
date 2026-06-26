/**
 * Manejador global de errores
 *
 * Único lugar donde se mapea una excepción a una respuesta HTTP. Lee err.status
 * (fallback 500). En errores 5xx no se filtran detalles internos al cliente.
 */

// next es obligatorio: Express reconoce el error handler por su aridad de 4
export function globalErrorHandler(err, req, res, _next) {
    const status = err.status || 500

    if (status >= 500) {
        console.error(err)
        return res.status(status).json({
            success: false,
            message: 'Error interno del servidor',
        })
    }

    const body = { success: false, message: err.message }
    if (err.errors?.length) {
        body.errors = err.errors
    }
    return res.status(status).json(body)
}
