const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');
const serverData = require('../serverData');
let connectionInstance;

module.exports = mongo;

module.exports.add = add;

module.exports.get = get;

module.exports.update = update;

module.exports.targetUpdate = targetUpdate;

module.exports.getArr = getArr;

module.exports.delete = deleteUser;

function mongo(callback) {
  if (connectionInstance) {
    callback(connectionInstance);
    return;
  }
  MongoClient.connect(serverData.adresForDB, function (err, database) {
    if (err) { return console.log(err); }

    connectionInstance = database.db(serverData.dbCategory);
    callback(database);
  })
};

function add(newUser, callback) {
  mongo(function (db) {
    db.collection(serverData.dbName).insert(newUser, function (err, result) {
      callback(err, result.ops[0]._id);
    })
  });
};

function get(login, callback) {
  mongo(function (db) {
    db.collection(serverData.dbName).findOne({ login: login }, function (err, user) {
      callback(err, user);
    });
  })
}

function update(id, newData, callback) {
  mongo(function (db) {
    db.collection(serverData.dbName).updateOne(
      { _id: ObjectID(id) },
      {
        $set: {
          login: newData.login,
          name: newData.name,
          age: newData.age,
          password: newData.newPassword,
          avatar: newData.avatar
        }
      },
      { upsert: true },
      function (err, result) {
        callback(err, result);
      });
  });
}

function targetUpdate(login, fieldName, newData, callback) {
  mongo(function (db) {
    db.collection(serverData.dbName).updateOne(
      { login: login },
      {
        $set: {
          [fieldName]: newData,
        }
      },
      { upsert: true },
      function (err, result) {
        callback(err, result);
      });
  });
}

function getArr(filter = {}, sort = {}, callback = () => { }) {
  mongo(function (db) {
    db.collection(serverData.dbName).find(filter).sort(sort).toArray(function (err, users) {
      callback(err, users);
    });
  });
}

function deleteUser(id, callback) {
  mongo(function (db) {
    db.collection(serverData.dbName).deleteOne(
      { _id: ObjectID(id) },
      function (err, result) {
        callback(err, result);
      });
  })
}