const multer = require("multer");

require('dotenv').config()

const path = require("path");
let fileStorage = multer.diskStorage({
    destination: process.env.UPLOAD_PATH,
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
    }
});

exports.fileUpload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 200000000 // 1000000 Bytes = 200 MB
    },

    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(txt|xlsx|csv)$/)) {
            return cb('Please upload a proper file format')
        }

        cb(undefined, true)
    }
})