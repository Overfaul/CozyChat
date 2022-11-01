const jwt = require('jsonwebtoken')
const { Token } = require('../models/model')

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, 'secret1', { expiresIn: '24h' })
        const refreshToken = jwt.sign(payload, 'secret2', { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(accessToken) { //checks if accessToken is valid
        const userData = jwt.verify(accessToken, 'secret1')
        return userData
    }

    validateRefreshToken(refreshToken) { //checks if refreshToken is valid
        const userData = jwt.verify(refreshToken, 'secret2')
        return userData

    }

    //save our refreshToken to the DB
    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { userId } })
        if (tokenData) {
            console.log('it works')
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await Token.create({ refreshToken, userId })
        return token;
    }

    async deleteToken(refreshToken) {
        const deleteToken = await Token.destroy({ where: { refreshToken } })
        return deleteToken
    }

    async findToken(refreshToken) {
        const findToken = await Token.findOne({ where: { refreshToken } })
        return findToken
    }

}


module.exports = new TokenService()