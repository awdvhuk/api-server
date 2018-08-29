const router = require('express').Router();
const db = require('../db/mongo-db');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const serverData = require('../serverData');
const upload = multer({ dest: './public/uploads/' });

router.post('/', upload.single('avatarIMG'), async function (req, res) {
  let { login, field, newValue, tokenRequest } = req.body;

  if (!tokenRequest) {
    db.targetUpdate(login, field, newValue, (err) => {
      if (err) {
        console.log(err);
        return res.send('faild');
      }
      return res.send('success');
    });
  }
  else {
    db.get(login, (err, user) => {
      if (err) {
        console.log(err);
        return res.send('faild');
      }
      db.targetUpdate(login, field, newValue, (err) => {
        if (err) {
          console.log(err);
          return res.send('faild');
        }
        user[field] = newValue;
        delete user.password;

        var token = jwt.sign(user, serverData.secretKey);
        return res.send({ cookie: `user=${token}; path=/`, user: user });
      })
    })
  }
});

module.exports = router;