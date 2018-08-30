const router = require('express').Router();
const db = require('../db/mongo-db');
const fs = require('fs');
const { Users } = require('../db/postgresql');

router.post('/', function (req, res) {
  Users.destroy({ where: { id: req.body.id } });

  // db.delete(req.body.id, (err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   if (req.body.avatar !== '') {
  //     fs.unlinkSync(`public/uploads/${req.body.avatar}`);
  //   }
  // });
});

module.exports = router;