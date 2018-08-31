const db = require('../db/mongo-db');
const { Users } = require('../db/postgresql');

module.exports = (req, res, next) => {
    if (req.body.login === '' || req.body.login === req.body.oldLogin ) {
        req.body.login = req.body.oldLogin;
        return next();
    }
    
    Users.findOne({ where: { login: req.body.login } })
    .then(user => {
        if (user == null) {
            return next();
        }
        return res.send('login error');
    });
}