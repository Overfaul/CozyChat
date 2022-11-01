class ErrorHandler extends Error{
    constructor (status, message){
        super()
        this.status = status
        this.message = message
    }

    static badrequest(message){
        return new ErrorHandler(404, message)
    }

    static unauthorizedError(message){
        return new ErrorHandler(401, message)
    }

    static internal(message){
        return new ErrorHandler(500, message)
    }
    
    static forbidden(message){
        return new ErrorHandler(403, message)
    }

}


module.exports = ErrorHandler