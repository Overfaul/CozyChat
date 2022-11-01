const multer = require('multer')
var path = require('path')
// validation of types we can upload
const types = ['image/png', 'image/jpeg', 'image/jpg']

const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const storage = multer.diskStorage({
    destination : "./server/images",
    filename : (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


module.exports = multer({
    storage : storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})