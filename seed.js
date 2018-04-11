
var db=require('./models');

db.User.remove({}, function(err, succ){
  console.log(succ);

});

var user=
  {
    'email': 'Hunter@gmail.com',
    'password': '123',
    'portfolio': [
      {_id: "5ace42d2fd7bacf8fa68849c"},
      {_id: "5ace42d2fd7bacf8fa68849a"}
    ]
  };

  db.User.create(user, function(err, succ) {
    console.log(succ);
  })
