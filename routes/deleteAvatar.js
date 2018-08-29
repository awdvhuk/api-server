const router = require('express').Router();
const db = require('../db/mongo-db');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const serverData = require('../serverData');

router.get('/:id', function (req, res) {
  db.get(req.path.slice(1), (err, user) => {
    fs.unlinkSync(`public/uploads/${user.avatar}`);

    user.avatar = '';

    user.newPassword = user.password;
    db.update(user._id, user, (err, result) => {

      delete user.password;
      var token = jwt.sign(user, serverData.secretKey);
      return res.send({cookie:`user=${token}; path=/`, user: user});
    });
  })
});

module.exports = router;