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
  Users
    .findOne({ where: { login: req.body.oldLogin } })
    .then((user) => {
      if (hash(req.body.oldPassword) !== user.get().password) {
        return res.send('wrong password');
      }

      let newData = {
        login: req.body.login,
        name: req.body.name,
        age: +req.body.age,
        password: hash(req.body.newPassword)
      }

      if (req.body.newPassword === '') {
        newData.password = hash(req.body.oldPassword);
      }

      if (req.file) {
        newData.avatar = `http://localhost:4000/public/uploads/${req.file.filename}`;
      }

      Users
        .update(newData, { where: { login: req.body.oldPassword }, individualHooks: true })
        .then(() => {
          if (!newData.avatar) {
            newData.avatar = user.get().avatar;
          }
          newData.id = user.get().id;
          newData.admin = user.get().admin;
          delete newData.password;
          var token = jwt.sign(newData, serverData.secretKey);
          return res.send({ cookie: `user=${token}; path=/`, user: newData });
        });
    });
});

module.exports = router;