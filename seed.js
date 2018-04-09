
var db=require('./models');

db.User.remove({}, function(err, succ){
  console.log(succ);

});

var user=
  {
    'email': 'Hunter@gmail.com',
    'password': '123'
  };

  db.User.create(user, function(err, succ) {
    console.log(succ);
  })
