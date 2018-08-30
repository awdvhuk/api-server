const router = require('express').Router();
const db = require('../db/mongo-db');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const serverData = require('../serverData');
const { Users } = require('../db/postgresql');

router.get('/:id', function (req, res) {
  Users
    .update({ avatar: '' }, { where: { login: req.path.slice(1) }, individualHooks: true })
    .then((user) => {
      Users.findOne({
        where: { login: req.path.slice(1) },
        attributes: {
          exclude:
            ['password', 'createdAt', 'updatedAt']
        }
      }).then((user) => {
        user = user.get();

        var token = jwt.sign(user, serverData.secretKey);
        return res.send({ cookie: `user=${token}; path=/`, user: user });
      })
    });

  // db.get(req.path.slice(1), (err, user) => {
  //   fs.unlinkSync(`public/uploads/${user.avatar}`);

  //   user.avatar = '';

  //   user.newPassword = user.password;
  //   db.update(user._id, user, (err, result) => {

  //     delete user.password;
  //     var token = jwt.sign(user, serverData.secretKey);
  //     return res.send({ cookie: `user=${token}; path=/`, user: user });
  //   });
  // })
});

module.exports = router;