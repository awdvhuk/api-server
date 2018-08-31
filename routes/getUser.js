const router = require('express').Router();
const db = require('../db/mongo-db');
const { Users } = require('../db/postgresql');

router.get('/:id', function (req, res) {
    Users.findOne({ where: { login: req.path.slice(1) } })
        .then(user => {
            if (user == null) {
                return res.send('no user');
            }
            delete user.password;
            return res.send(user);
        })
});

module.exports = router;