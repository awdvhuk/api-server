const router = require('express').Router();
const jwt = require('jsonwebtoken');
const serverData = require('../serverData');
const db = require('../db/mongo-db');
const axios = require('axios');

router.post('/', (req, res) => {
  axios.post('https://graph.facebook.com/me?fields=name,email',
    { access_token: req.body.token, scope: 'email, name' })
    .then(((fbRes) => {
      db.get(fbRes.data.email, (err, user) => {
        if (user !== null) {
          delete user.password;
          var token = jwt.sign(user, serverData.secretKey);
          return res.send({ cookie: `user=${token}; path=/`, user });
        }
        let date = new Date()
        date.setHours(0, 0, 0, 0);
        let newUser = {
          login: fbRes.data.email,
          name: fbRes.data.name,
          age: 0,
          avatar: req.body.avatar,
          admin: false,
          registered: date,
          password: ''
        };
        db.add(newUser, function (err, id) {

          newUser._id = id;
          delete newUser.password;

          var token = jwt.sign(newUser, serverData.secretKey);
          return res.send({ cookie: `user=${token}; path=/`, user: newUser });
        });
      });
    }))
    .catch(function (error) {
      console.log(error);
    });
})

module.exports = router;