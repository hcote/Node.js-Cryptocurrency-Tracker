
var db=require('./models');

db.User.remove({}, function(err, succ){
  console.log(succ);
});

db.Coin.remove({}, function(err, succ){
  console.log(succ);

});
