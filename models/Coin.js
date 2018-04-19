var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  passportLocalMongoose = require("passport-local-mongoose");

var CoinSchema = new Schema({
  id: String,
  symbol: String,
  name: String,
  rank: String,
  price_usd: String,
  price_btc: String,
  market_cap_usd: String,
  percent_change_7d: String,
  percent_change_24h: String,
  qty: Number
});

CoinSchema.plugin(passportLocalMongoose, {usernameUnique: false});

var Coin = mongoose.model("Coin", CoinSchema);
module.exports = Coin;
