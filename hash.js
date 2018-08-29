const serverData = require('./serverData');
const crypto = require('crypto');

module.exports = function (password) {
    return crypto.createHmac(serverData.hashType, serverData.hashKey).update(password).digest('hex');
}