var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  passportLocalMongoose = require("passport-local-mongoose");

var CoinSchema = new Schema({
  symbol: String,
  name: String,
  price_usd: Number,
  price_btc: Number,
  qty: Number
});

CoinSchema.plugin(passportLocalMongoose, {usernameUnique: false});

var Coin = mongoose.model("Coin", CoinSchema);
module.exports = Coin;
