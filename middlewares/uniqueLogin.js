const db = require('../db/mongo-db');

module.exports = (req, res, next) => {
    if (req.body.login === '' || req.body.login === req.body.oldLogin ) {
        req.body.login = req.body.oldLogin;
        return next();
    }
    
    db.get(req.body.login, (err, user) => {
        if (user == null) {
            return next();
        }
        return res.send('login error');
    })
}