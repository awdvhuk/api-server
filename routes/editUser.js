const router = require('express').Router();
const hash = require('../hash');
const db = require('../db/mongo-db');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const serverData = require('../serverData');
const uniqueLogin = require('../middlewares/uniqueLogin');
const upload = multer({ dest: './public/uploads/' });
const { Users } = require('../db/postgresql');

router.post('/', upload.single('avatarIMG'), uniqueLogin, async function (req, res) {
  req.body.age = +req.body.age;
  db.get(req.body.oldLogin, (err, user) => {
    if (hash(req.body.oldPassword) !== user.password) {
      return res.send('wrong password');
    }

    if (req.body.newPassword === '') {
      req.body.newPassword = req.body.oldPassword;
    }
    req.body.newPassword = hash(req.body.newPassword);

    user.login = req.body.login;
    user.name = req.body.name;
    user.age = req.body.age;
    delete user.password;
    delete req.body.cookie;

    if (req.file !== undefined) {
      if (user.avatar !== '') {
        fs.unlinkSync(`public/uploads/${user.avatar}`);
      }
      user.avatar = req.file.filename;
    }
    req.body.avatar = user.avatar;

    db.update(user._id, req.body, (err, result) => {
      
      req.body.admin = user.admin;
      req.body.registered = user.registered;
      req.body._id = user._id;
      delete req.body.oldLogin;
      delete req.body.oldPassword;
      delete req.body.newPassword;

      var token = jwt.sign(user, serverData.secretKey);
      return res.send({cookie:`user=${token}; path=/`, user:req.body});
    })
  })
});

module.exports = router;