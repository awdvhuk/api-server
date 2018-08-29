const router = require('express').Router();
const hash = require('../hash');
const db = require('../db/mongo-db');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const serverData = require('../serverData');
const uniqueLogin = require('../middlewares/uniqueLogin');
const upload = multer({ dest: './public/uploads/' });

router.post('/', upload.single('avatarIMG'), uniqueLogin, function (req, res) {
    let newUser = req.body;

    newUser.registered = new Date(newUser.registered);
    newUser.age = +newUser.age;
    newUser.password = hash(newUser.password)
    newUser.admin = false;
    
    if (req.file) {
        newUser.avatar = req.file.filename;
    }

    db.add(newUser, function (err, id) {

        newUser._id = id;
        delete newUser.password;

        var token = jwt.sign(newUser, serverData.secretKey);
        return res.send({ cookie: `user=${token}; path=/`, user: newUser });
    });
});

module.exports = router;