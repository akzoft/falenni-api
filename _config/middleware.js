const jwt = require("jsonwebtoken")
const { isEmpty } = require("./functions")
const UserModel = require("../_models/user.model")
const { upload_files_constants } = require("./constants")
const multer = require("multer")
const path = require('path')

exports.secure = async (req, res, next) => {
    try {
        let token = req.header("token")

        if (isEmpty(token)) throw "Veuillez-vous authentifier."

        const data = jwt.verify(token, process.env.JWT_SECRET)

        if (isEmpty(data.id)) throw "Veuillez-vous authentifier."

        const user = await UserModel.findById(data.id)
        if (isEmpty(user)) throw "Authentification echouée."

        req.id = user
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error })
    }
}

//middleware for upload files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destFolder = ''
        if (file.mimetype.startsWith('image/')) {
            destFolder = `${__dirname}/../public/images`
        } else if (file.mimetype.startsWith('video/')) {
            destFolder = `${__dirname}/../public/videos`
        }

        cb(null, destFolder)
    },

    filename: function (req, file, cb) {
        let name = ''
        if (file.mimetype.startsWith('image/')) {
            name = 'image' + '-' + Date.now() + path.extname(file.originalname)
        } else if (file.mimetype.startsWith('video/')) {
            name = 'video' + '-' + Date.now() + path.extname(file.originalname)
        }

        cb(null, name)
    }
})

const fileFilter = (req, file, cb) => {
    if (!upload_files_constants.FILES_ALLOW_TYPES.includes(file.mimetype)) {
        return cb(new Error('Seuls les fichiers JPEG, PNG, MP4 et MOV sont autorisés'))
    }

    cb(null, true)
}

const limits = {
    fileSize: upload_files_constants.MAX_SIZE,
    files: upload_files_constants.MAX_FILES_TO_UPLOAD
}

exports.upload = multer({ storage, fileFilter, limits })

