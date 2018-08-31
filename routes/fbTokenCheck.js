const router = require('express').Router();
const jwt = require('jsonwebtoken');
const serverData = require('../serverData');
const db = require('../db/mongo-db');
const axios = require('axios');
const { Users } = require('../db/postgresql');

router.post('/', (req, res) => {
  axios.post('https://graph.facebook.com/me?fields=name,email',
    { access_token: req.body.token, scope: 'email, name' })
    .then(((fbRes) => {
      Users
        .findOne({
          where: { login: fbRes.data.email },
          attributes: {
            exclude:
              ['password', 'createdAt', 'updatedAt']
          }
        })
        .then((user) => {
          if (user !== null) {
            user = wser.get();
            var token = jwt.sign(user, serverData.secretKey);
            return res.send({ cookie: `user=${token}; path=/`, user });
          }
          let date = new Date();
          date.setHours(0, 0, 0, 0);
          let newUser = {
            login: fbRes.data.email,
            name: fbRes.data.name,
            age: 0,
            avatar: `http://graph.facebook.com/${fbRes.data.id}/picture?width=500&height=500`,
            admin: false,
            registered: date,
            password: ''
          };

          Users
            .create(newUser)
            .then((addedUser) => {
              newUser._id = addedUser.get().id;
              delete newUser.password;

              var token = jwt.sign(newUser, serverData.secretKey);
              return res.send({ cookie: `user=${token}; path=/`, user: newUser });
            })
        });
    }))
    .catch(function (error) {
      console.log(error);
    });
})

module.exports = router;