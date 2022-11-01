const Router = require('express')
const router = new Router()
const userRouter = require('../routes/userRouter')


router.use('/', userRouter)


module.exports = router



