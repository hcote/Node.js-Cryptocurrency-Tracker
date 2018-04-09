// require express and other modules
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  validate = require('express-validator')
  //  NEW ADDITIONS
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;



// require Post model
var db = require("./models"),
  User = db.User;
// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true, }));

// serve static files from public folder
app.use(express.static(__dirname + "/public"));

// set view engine to ejs
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(cookieParser());
app.use(session({
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(validate());

// Login system wont work without these
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// HOMEPAGE ROUTE
app.get("/", function (req, res) {
      console.log(req.user);
      User.find(function(err, users) {
        if (err) {
          console.log(err);
        } else {
          res.render("index", {user: users});
        }
      })

  });

app.get("/portfolio", function (req, res) {
  console.log(req.user);
  User.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("portfolio", {user: users});
    }
  })
  });

 app.get("/favorites", function (req, res) {
   console.log(req.user);
   User.find(function(err, users) {
     if (err) {
       console.log(err);
     } else {
       res.render("favorites", {user: users});
     }
   })
  });

 app.get("/forums", function (req, res) {
   console.log(req.user);
   User.find(function(err, users) {
     if (err) {
       console.log(err);
     } else {
       res.render("forums", {user: users});
     }
   })
  });

 app.get("/news", function (req, res) {
   console.log(req.user);
   User.find(function(err, users) {
     if (err) {
       console.log(err);
     } else {
       res.render("news", {user: users});
     }
   })
  });

// Render signup page
app.get("/signup", function (req, res) {
    res.render("signup");
  });

// Render login page
app.get("/login", function (req, res) {
  res.render("login");
});

// Render Map & allow it to access User model to populate div
app.get('/feed', function(req, res) {
  User.find(function(err, allUsers) {
    if (err) {
      console.log("Error getting all Users: " +  err);
    } else {
      console.log(req);
      var Id = req.user._id;
      User.findById(Id, function(err, succ) {
        if (err) {
          console.log(err);
        } else {
          res.render('feed', {users: allUsers, user: succ})
        }
      })

    }
  })
})

// See all users
app.get('/all', function(req, res) {
  User.find(function(err, allUsers) {
    if (err) {
      console.log("Error getting all Users: " +  err);
    } else {
      res.json({users: allUsers})
    }
  })
})

// SIGNUP WORKING
app.post("/signup", function (req, res) {
  console.log(req.body);
  User.register(new User({ username: req.body.username,
                           password: req.body.password,
                           name: req.body.name,
                           isLocal: req.body.isLocal,
                           age: req.body.age,
                           city: req.body.city,
                           bio: req.body.bio}), req.body.password,
      function () {
        passport.authenticate("local")(req, res, function() {
          // If a traveler signs up, redirect to the feed
          if (req.body.isLocal === 'Traveler') {
          res.redirect('/feed');
        } else {
          // If a local signs up, redirect to their profile
          res.redirect(`/user/${req.user._id}`);
        }
      })
    }
  )
});

// CRUD Routes - all functional

// SHOW (user profile) - working
app.get('/user/:id', function(req, res) {
  console.log(userId);
  console.log(req.user);
  var Id = req.user._id;
  var userId = req.params.id;
  User.findById(userId, function(err, succ) {
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log(userId + " " + succ._id);
      res.render('profile', {user: succ, req: userId, id: Id})
    }})
  })

// UPDATE PAGE FOR USER PROFILE
app.get('/user/:id/update', function(req, res) {
  var Id = req.user._id;
  var userId = req.params.id;
  console.log(userId);
  User.findById(userId, function(err, succ) {
    if (err) {
      console.log("Error: " + err);
    } else {
      res.render('update_profile', {user: succ, req: userId, id: Id})
    }})
})

// SAVE UPDATES FOR USER PROFILE
app.put('/user/:id', function(req, res) {
  console.log("Hello, you just tried to update");
  var Id = req.user._id;
  var userId = req.params.id;
  User.findById(userId, function(err, foundUser) {
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log("found user " + foundUser);
      foundUser.username = req.body.username,
      foundUser.name = req.body.name,
      foundUser.isLocal = req.body.isLocal,
      foundUser.age = req.body.age,
      foundUser.city = req.body.city,
      foundUser.bio = req.body.bio;
      foundUser.save(function(err, updatedUserSaved) {
        if (err) {
          console.log(err);
        } else {
          console.log('User is Saved: ' + updatedUserSaved);
          res.render('profile', {user: updatedUserSaved, req: userId, id: Id})
        }
      })
    }})
  })

// DELETE
app.delete('/user/:id', function(req, res) {
  console.log(req);
  User.findByIdAndRemove(req.params.id, function(err, deletedUser) {
    if (err) {
      console.log("Error trying to delete post: " + err);
    } else {
    console.log("User Deleted Sucessfully");
    res.redirect('/');
  }
  })
})

// LOGIN login
app.post("/login", passport.authenticate("local"), function (req, res) {
  console.log(req);
  User.findOne({username: req.body.username}, function(err, succ){
    console.log("Error is: " + err);
    console.log("Success is: " + succ);
    if(req.body.password === succ.password) {
      res.redirect(`/user/${req.user._id}`);
    }
    else{
      res.sendStatus(404);
    }
  })
})

// STILL NEED A LOGOUT BUTTON
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("server started");
});
