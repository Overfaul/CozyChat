const { Message, User, Dialog } = require('../models/model')
const ErrorHandler = require('../middleware/errorhandler')

class MessageController {

    async sendMessage(req, res, next) {
        try {

            const user_id = req.user.id
            const { user_message, dialog_id, attach, repliedName, repliedMes, repliedImg } = req.body
            console.log(attach)
            const message_time = new Intl.DateTimeFormat('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hourCycle: 'h12'
            }).format(new Date())

            const checkdialog = await Dialog.findOne({ where: { id: dialog_id } })
            if (!checkdialog) {
                return next(ErrorHandler.badrequest("Диалога не существует"))
            }

            await Message.create({
                text: user_message, dialogId: dialog_id, userId: user_id, creatorId: user_id,
                sentTime: message_time,
                repliedUsername: repliedName, repliedMessage: repliedMes,
                repliedImage: repliedImg,
                attachment: attach ? attach : 'none',

            })

            // update last message
            await Dialog.update({ lastmessage: attach ? '(Photo) ' + user_message : user_message },
                { where: { id: dialog_id } });

            const message = await Message.findOne({
                where: {
                    text: user_message, dialogId: dialog_id, userId: user_id, creatorId: user_id,
                    sentTime: message_time, attachment: attach ? attach : 'none'
                },
                include: { model: User, as: 'creator' }
            });
            return res.json(message)
        } catch (e) {
            next(e)
        }
    }

    async getMessages(req, res, next) {
        try {
            const user_id = req.user.id
            const dialog_id = req.params['dialog_id']
            const checkdialog = await Dialog.findAll({
                where: { id: dialog_id },
                include: { model: Message, as: 'messages', include: { model: User, as: 'creator' } }
            })

            return res.json(checkdialog)

        } catch (e) {
            next(e)
        }
    }

    async editMessage(req, res, next) {
        try {
            const author_id = req.user.id
            const { message_id, message, edited_message, dialogid } = req.body
            const editMessage = await Message.update(
                { text: edited_message },
                { where: { id: message_id, text: message } }
            )

            // if message_id == messageid of last message -> update
            const lastmes = await Message.findAll({
                limit: 1,
                where: {
                    dialogId: dialogid
                },
                order: [['createdAt', 'DESC']]
            })

            // Update last message

            if (lastmes[0]?.dataValues && lastmes[0].dataValues.id === message_id){
                await Dialog.update({ lastmessage: lastmes[0]?.dataValues.attachment != 'none' ? '(Photo) ' + lastmes[0]?.dataValues.text : lastmes[0]?.dataValues.text },
                {
                    where: { id: dialogid }
                });
            }


            const editedMes = await Message.findOne({ where: { id: message_id, text: edited_message } })
            return res.json(editedMes)

        } catch (e) {
            next(e)
        }
    }

    async deleteMessage(req, res, next) {
        try {
            const author_id = req.user.id

            const dialogid = req.query.dialogid

            const message_id = req.params['message_id']
            const deleteMessage = await Message.destroy({
                where: { id: message_id }
            })

            const lastmes = await Message.findAll({
                limit: 1,
                where: {
                    dialogId: dialogid
                },
                order: [['createdAt', 'DESC']]
            })

            // Update last message

            if (lastmes[0]?.dataValues){
                const user_message = lastmes[0].dataValues.text
                const attach = lastmes[0].dataValues.attachment
                await Dialog.update({ lastmessage: attach != 'none' ? '(Photo) ' + user_message : user_message },
                    {
                        where: { id: dialogid }
                    });
    
            }else{
                await Dialog.update({ lastmessage: '' },
                {
                    where: { id: dialogid }
                });
            }

            return res.json(deleteMessage)
        } catch (e) {
            next(e)
        }
    }
}


module.exports = new MessageController()