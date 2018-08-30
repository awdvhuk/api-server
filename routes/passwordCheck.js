const router = require('express').Router();
const hash = require('../hash');
const db = require('../db/mongo-db');
const { Users } = require('../db/postgresql');

router.post('/', (req, res) => {
  Users
    .findOne({ where: { login: req.body.login } })
    .then(user => {
      if (hash(req.body.password) === user.password) {
        return res.send('good');
      }
      return res.send('error');
    });

  // db.get(req.body.login, (err, user) => {
  //   if (err) {
  //     return res.send('error');
  //   }
  //   if (hash(req.body.password) === user.password) {
  //     return res.send('good');
  //   }
  //   return res.send('error');
  // });
})

module.exports = router;