const router = require('express').Router();
const db = require('../db/mongo-db');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const serverData = require('../serverData');
const upload = multer({ dest: './public/uploads/' });
const { Users } = require('../db/postgresql');

router.post('/', upload.single('avatarIMG'), async function (req, res) {
  let { login, field, newValue, tokenRequest } = req.body;

  if (!tokenRequest) {
    Users
      .update({ [field]: newValue }, { where: { login: login }, individualHooks: true })
      .then(() => {
        return res.send('success');
      });
  }
  else {
    Users
      .findOne({
        where: { login: login },
        attributes: {
          exclude:
            ['password', 'createdAt', 'updatedAt']
        }
      })
      .then((user) => {
        user = user.get();
        Users
          .update({ [field]: newValue }, { where: { login: login }, individualHooks: true })
          .then(() => {
            user[field] = newValue;
            var token = jwt.sign(user, serverData.secretKey);
            return res.send({ cookie: `user=${token}; path=/`, user: user });
          })
      })
  }
});

module.exports = router;