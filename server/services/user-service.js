const { User, Contacts, Dialog } = require('../models/model')
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const tokenservice = require('../services/token-service')
const ErrorHandler = require('../middleware/errorhandler');

class UserService {
    async registration(phone, password, fullname) {
        let checkuser = await User.findOne({ where: { phone } })
        if (checkuser) {
            throw ErrorHandler.badrequest('Такой пользователь уже существует')
        }

        let encrypted = await bcrypt.hash(password, 10)
        let user = await User.create({ phone, password: encrypted, fullname })


        //let tokens = tokenservice.generateToken({ phone, password, fullname});
        //await tokenservice.saveToken(user.id, tokens.refreshToken)
        return user
    }

    async login(phone, password) {
        let checkuser = await User.findOne({ where: { phone } })
        if (!checkuser) {
            throw ErrorHandler.badrequest('Такой пользователь уже существует')
        }
        const isPassEquals = await bcrypt.compare(password, checkuser.password);
        if (!isPassEquals) {
            throw ErrorHandler.badrequest('Неправильный логин или пароль')
        }
        let tokens = tokenservice.generateToken({ id: checkuser.id, phone, password, fullname: checkuser.fullname });
        console.log(tokens)
        await tokenservice.saveToken(checkuser.id, tokens.refreshToken)
        return { ...tokens }
    }

    async logout(refreshToken) {
        const token = await tokenservice.deleteToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ErrorHandler.unauthorizedError('Пользователь не авторизован')
        }
        const userData = tokenservice.validateRefreshToken(refreshToken)
        if (!userData) {
            throw ErrorHandler.unauthorizedError('Пользователь не авторизован')
        }

        let checkuser = await User.findOne({ where: userData.id })

        let { phone, password } = userData
        let tokens = tokenservice.generateToken({ id: checkuser.id, phone, password, fullname: checkuser.fullname });

        await tokenservice.saveToken(checkuser.id, tokens.refreshToken)
        return { ...tokens }
    }

    async getAllUsers(id) {
        const meid = id
        const userData = await User.findAll({
            include: { model: Dialog, as: 'dialogs' },
            where: {
                id: {
                    [Op.ne]: meid
                }
            }
        })
        return userData
    }

    async getMe(id) {
        const meid = id
        const me = await User.findOne({ where: meid })
        return me
    }

    async getUser(friendphone) {
        console.log(friendphone)
        const user = await User.findOne({ where: { phone: friendphone } })
        return user
    }
}

module.exports = new UserService()