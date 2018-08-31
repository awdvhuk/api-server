const router = require('express').Router();
const db = require('../db/mongo-db');
const { Users } = require('../db/postgresql');

router.post('/', function (req, res) {
  let sort = [[Object.keys(req.body.sort)[0], 'DESC']];
  if (req.body.sort[sort[0][0]] === 1) {
    sort[0][1] = 'ASC';
  }
  Users.findAll(
    {
      where: makeFilter(req.body.filter),
      order: sort,
      attributes: {
        exclude:
          ['password', 'avatar', 'createdAt', 'updatedAt']
      }
    })
    .then(arr => {
      arr = JSON.parse(JSON.stringify(arr))
      return res.send(arr)
    })
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
          $iLike: `%${filter.loginName}%`
        }
      },
      {
        ['name']: {
          $iLike: `%${filter.loginName}%`
        }
      }
    ]
    // filterParams.$or = [
    //   {
    //     ['login']: {
    //       $regex: new RegExp(filter.loginName),
    //       $options: 'i'
    //     }
    //   },
    //   {
    //     ['name']: {
    //       $regex: new RegExp(filter.loginName),
    //       $options: 'i'
    //     }
    //   }];
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