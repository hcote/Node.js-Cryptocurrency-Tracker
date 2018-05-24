// run `node seed.js` in console to wipe data from db

var db=require('./models');

db.User.remove({}, function(err, succ){
  console.log(succ);
});

db.Coin.remove({}, function(err, succ){
  console.log(succ);
});
