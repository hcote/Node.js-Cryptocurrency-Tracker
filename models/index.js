var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
/*add you connection somewhere here*/
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/Locals-dev');

/* adding model UserModel to index.js */
module.exports.User = require('./User');
