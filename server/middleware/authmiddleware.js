const tokenservice = require('../services/token-service')
const ErrorHandler = require('./errorhandler')

module.exports = function(req, res, next) {
    try {
        const accessToken = req.headers.authorization.replace("Bearer ","")
        console.log(accessToken)

        if (!accessToken){
            return next(ErrorHandler.unauthorizedError('Пользователь не авторизован а'))
        }

        const userData = tokenservice.validateAccessToken(accessToken)
        if(!userData){
            return next(ErrorHandler.unauthorizedError('Пользователь не авторизован ааа'))
        }

        req.user = userData //put userdata(that we pulled from the token) into the request's user field 
        next()
    }
    catch(e){
        console.log(e)
        return next(ErrorHandler.unauthorizedError('Пользователь не авторизован ааа'))
    }
}