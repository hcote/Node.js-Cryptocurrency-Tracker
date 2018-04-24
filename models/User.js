var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new Schema({
  email: String,
  password: String,
  portfolio: [{
    type: Schema.Types.ObjectId,
    ref: 'Coin'
  }],
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Coin'
  }]
});

// UserSchema.virtual('portfolio', {
//   ref: 'Coin',
//   localField: 'name',
//   foreignField: 'name',
//   justOne: false
// })

UserSchema.plugin(passportLocalMongoose, {usernameUnique: false});

var User = mongoose.model("User", UserSchema);
module.exports = User;
