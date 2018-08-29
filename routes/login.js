const router = require('express').Router();
const hash = require('../hash');
const db = require('../db/mongo-db');
const jwt = require('jsonwebtoken');
const serverData = require('../serverData');

router.post('/', (req, res) => {
    db.get(req.body.login, (err, user) => {
        if (user == null) {
            return res.send('user');
        }
        if (user.password != hash(req.body.password)) {
            return res.send('password');
        }

        delete user.password;
        var token = jwt.sign(user, serverData.secretKey);
        return res.send({ cookie: `user=${token}; path=/`, user });
    });
});

module.exports = router;