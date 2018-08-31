const router = require('express').Router();
const jwt = require('jsonwebtoken');
const serverData = require('../serverData');
const db = require('../db/mongo-db');
const { Users } = require('../db/postgresql');

router.post('/', (req, res) => {

    if (!req.body.cookie) {
        return res.send([false]);
    }

    let decoded = jwt.verify(req.body.cookie, serverData.secretKey);

    if (!decoded) {
        return res.send(false);
    }

    Users.findOne({ where: { login: decoded.login } })
        .then(user => {
            if (user === null) {
                return res.send(false);
            }
            user = user.get();
            if (
                decoded.name == user.name &&
                decoded.age == user.age &&
                decoded.avatar == user.avatar &&
                decoded.id == (user.id + '')
            ) {
                delete decoded.iat;
                return res.send([true, decoded]);
            }

            return res.send([false]);
        });
})

module.exports = router;