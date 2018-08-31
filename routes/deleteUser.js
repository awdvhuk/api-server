const router = require('express').Router();
const db = require('../db/mongo-db');
const fs = require('fs');
const { Users } = require('../db/postgresql');

router.post('/', function (req, res) {
  Users.destroy({ where: { id: req.body.id } });
});

module.exports = router;