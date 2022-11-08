const { User } = require('../models/model')
const ErrorHandler = require('../middleware/errorhandler')
const userService = require('../services/user-service')

class UserController {
    async registration(req, res, next) {
        try {
            let { phone, password, fullname } = req.body
            if (phone.length === 0 || password.length === 0) {
                return next(ErrorHandler.badrequest('Ошибка при валидации'))
            }

            const userData = await userService.registration(phone, password, fullname)
            //res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            let { phone, password } = req.body
            console.log(phone)

            if (phone.length === 0 || password.length === 0) {
                return next(ErrorHandler.badrequest('Ошибка при валидации'))
            }
            const userData = await userService.login(phone, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)

        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken');
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const id = req.user.id
            const users = await userService.getAllUsers(id)
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getMe(req, res, next) {
        try {
            const id = req.user.id
            const userData = await userService.getMe(id)
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async changeUserData(req, res, next) {
        try {
            const userid = req.user.id
            const {username, userbio} = req.body
            console.log(username)
            const userData = await User.update(
                { fullname: username, bio: userbio },
                { where: { id: userid } }
            );
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
}


module.exports = new UserController()