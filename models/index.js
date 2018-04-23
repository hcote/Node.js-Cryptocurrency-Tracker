var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

mongoose.Promise = global.Promise;
/*add you connection somewhere here*/
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/crypto-tracker5');

/* adding model UserModel to index.js */
module.exports.User = require('./User');
module.exports.Coin = require('./Coin');
