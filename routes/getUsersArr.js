const router = require('express').Router();
const db = require('../db/mongo-db');

router.post('/', function (req, res) {
  db.getArr(makeFilter(req.body.filter), req.body.sort, (err, users) => {
    for (let i = 0; i < users.length; i++) {
      delete users[i].password;
    }
    return res.send(users);
  });
});

const makeFilter = (filter) => {
  if (!filter.age) {
    return {};
  }

  let filterParams = {};

  if (filter.loginName != '') {
    filterParams.$or = [
      {
        ['login']: {
          $regex: new RegExp(filter.loginName),
          $options: 'i'
        }
      },
      {
        ['name']: {
          $regex: new RegExp(filter.loginName),
          $options: 'i'
        }
      }];
  }

  if (filter.age.min != '18') {
    filterParams['age'] = {};
    filterParams['age'].$gte = +filter.age.min;
  }

  if (filter.age.max != '150') {
    if (filterParams['age'] == undefined) {
      filterParams['age'] = {};
    }
    filterParams['age'].$lte = +filter.age.max;
  }

  if (filter.registerDate === '' || filter.registerDate === '0001-01-01') {
    return filterParams;
  }
  
  let date = new Date(filter.registerDate)
  date.setHours(0, 0, 0, 0);

  filterParams.registered = date;

  return filterParams;
}

module.exports = router;