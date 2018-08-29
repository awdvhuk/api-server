const router = require('express').Router();
const jwt = require('jsonwebtoken');
const serverData = require('../serverData');
const db = require('../db/mongo-db');

router.post('/', (req, res) => {
    if (!req.body.cookie) {
        return res.send([false]);
    }

    let decoded = jwt.verify(req.body.cookie, serverData.secretKey);

    if (!decoded) {
        return res.send(false);
    }


    db.get(decoded.login, (err, user) => {
        if (err) {
            return res.send(false);
        }
        if (user === null) {
            return res.send(false);
        }
        if (
            decoded.name == user.name &&
            decoded.age == user.age &&
            decoded.avatar == user.avatar &&
            decoded._id == (user._id + '')
        ) {
            delete decoded.iat;
            return res.send([true, decoded]);
        }

        return res.send([false]);
    })
})

module.exports = router;