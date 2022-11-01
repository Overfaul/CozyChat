const { User, Message } = require('../models/model')
const ErrorHandler = require('../middleware/errorhandler')

class uploadController {
    async uploadAvatar(req, res, next) {
        try {
            const userid = req.user.id

            const image = req.file.path
            const userData = await User.update(
                {avatar : image},
                {where : {id : userid}}
                );
                
            return res.json(image)
        }catch(e){
            next(e)
        }
    }
    async uploadAttachment(req,res,next){
        const userid = req.user.id

        const image = req?.file?.path
        //const userData = await Message.create({attachment : image, text: ''});
            
        return res.json(image)
    }
}


module.exports = new uploadController()