const Router = require('express')
const router = new Router()
// Controllers
const userController = require('../controllers/userController')
const dialogController = require('../controllers/dialogController')
const uploadController = require('../controllers/uploadController')
const messageController = require('../controllers/messageController')
// Middlewares
const authmiddleware = require('../middleware/authmiddleware')
const uploadmiddleware = require('../middleware/uploadmiddleware')

// User
router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)
router.get('/me', authmiddleware, userController.getMe)
router.get('/users', authmiddleware, userController.getAllUsers)

router.post('/userstatus', authmiddleware, userController.userStatus)
router.post('/edituser', authmiddleware, userController.changeUserData)
// Dialogs
router.post('/dialogs', authmiddleware, dialogController.createDialog)
router.get('/dialogs', authmiddleware, dialogController.showDialogs)
router.delete('/dialogs/:dialog_id', authmiddleware, dialogController.deleteDialog)

// Uploads
router.post('/upload', authmiddleware, uploadmiddleware.single("avatar"), uploadController.uploadAvatar)
router.post('/attachment', authmiddleware, uploadmiddleware.single("attachment"), uploadController.uploadAttachment)
// Messages
router.post('/messages', authmiddleware, messageController.sendMessage)
router.get('/messages/:dialog_id', authmiddleware, messageController.getMessages)


router.post('/messages/edit', authmiddleware, messageController.editMessage)
router.delete('/messages/:message_id', authmiddleware, messageController.deleteMessage)

// router.delete('/dialogs/:d_id' dialogController.deleteDialog)

// router.get('/messages' messageController.index)
//
// router.delete('/messages' messageController.deleteMessage)


module.exports = router