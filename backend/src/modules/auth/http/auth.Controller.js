import AuthService from '../application/auth.Service.js'

class AuthController {
    static async loginFarmer(req, res, next) {
        try {
            const result = await AuthService.loginFarmer(req.body.dni, req.body.password)
            return res.status(200).json({ success: true, message: 'Sesión iniciada', data: result })
        } catch (error) {
            next(error)
        }
    }

    static async loginInstitutional(req, res, next) {
        try {
            const result = await AuthService.loginInstitutional(req.body.email, req.body.password)
            return res.status(200).json({ success: true, message: 'Sesión iniciada', data: result })
        } catch (error) {
            next(error)
        }
    }

    static async me(req, res) {
        return res.status(200).json({ success: true, data: req.user })
    }
}

export default AuthController
