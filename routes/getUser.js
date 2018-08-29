const router = require('express').Router();
const db = require('../db/mongo-db');

router.get('/:id', function (req, res) {
    db.get(req.path.slice(1), (err, user) => {
        if (err || user == null) {
            return res.send('no user');
        }
        delete user.password;
        return res.send(user);
    })
});

module.exports = router;