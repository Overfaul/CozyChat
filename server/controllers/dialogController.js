const { User_Dialog, Dialog, User, Message } = require('../models/model')
const { Op } = require("sequelize");
const ErrorHandler = require('../middleware/errorhandler');
const { user } = require('pg/lib/defaults');

class DialogController {
    async createDialog(req, res, next) {
        try {
            const { partner_phone } = req.body
            const author_id = req.user.id

            const authordata = await User.findOne({ where: author_id })
            const partner = await User.findOne({ where: { phone: partner_phone } })

            const checkdialog = await Dialog.findOne({
                where: {
                    [Op.or]: [
                        { authorId: authordata.id, partnerId: partner.id },
                        { authorId: partner.id, partnerId: authordata.id }
                    ]
                }
            })


            if (checkdialog) {
                return next(ErrorHandler.badrequest("Такой диалог уже существует"))
            }

            const userData = await Dialog.create({ authorId: authordata.id, partnerId: partner.id })
            await userData.addUser(authordata)
            await userData.addUser(partner)

            const dialog = await Dialog.findOne({
                include: { model: User, as: 'users' },
                where: {
                    authorId: author_id
                }
            })

            return res.json(dialog)

        } catch (e) {
            next(e)
        }
    }

    async showDialogs(req, res, next) {
        try {
            const user_id = req.user.id
            const dialogs = await Dialog.findAll({
                include: { model: User, as: 'users' },
                where: {
                    [Op.or]: {
                        partnerId: user_id,
                        authorId: user_id
                    }
                }
            })

            return res.json(dialogs)
        } catch (e) {
            next(e)
        }
    }

    async deleteDialog(req, res, next) {
        try {
            const dialog_id = req.params['dialog_id']

            await Message.destroy({
                where: { dialogId: dialog_id }
            })

            const checkdialog = await User_Dialog.destroy({
                where: { dialogId: dialog_id }
            })
            await Dialog.destroy({
                where: { id: dialog_id }
            })

            return res.json(checkdialog)
        } catch (e) {
            next(e)
        }
    }
}


module.exports = new DialogController()