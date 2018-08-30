const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://awdvhuk:asd@localhost:5432/react');
const Op = Sequelize.Op;

const Users = sequelize.define('react', {
  login: Sequelize.STRING,
  password: Sequelize.STRING,
  name: Sequelize.STRING,
  age: Sequelize.INTEGER,
  avatar: Sequelize.STRING,
  registered: Sequelize.DATE,
  admin: Sequelize.BOOLEAN
});

module.exports = {
  sequelize,
  Users,
  Op
}

// /*
// Users
  // .create(newUser).then((user => { user.get(); 'do something' }))
  // .findOne({ where: { field: 'value' } }).then((user => { 'do something' }))
  // .update({ field: 'new value' }, { where: { field_to_find: 'value' }, individualHooks: true }).then((user) => {'do something'})
  // .findAll().then((usersArr) => { 'do something' })
  // .destroy({ where: { field: 'value' } })
// */