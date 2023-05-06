const controller = require("../controllers/service.controller");
const {fileUploader} = require("../middlewares");
let router = require('express').Router();


router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});

router.route('/').get((req, res, next) => {
    res.render('user/upload', {title: 'Upload file page'});
});


router.route('/form-submit').post(fileUploader.fileUpload.single('upload-file'), controller.serviceFormUpload);


//API method should be put but for easy to use here using Get
router.route('/data-migration').get( controller.migrateValidCustomerData);


module.exports = router;
