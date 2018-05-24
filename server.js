var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  validate = require('express-validator')
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  axios = require('axios');

// importing models
var db = require("./models"),
    User = db.User,
    Coin = db.Coin;

// configure bodyParser to read form data
app.use(bodyParser.urlencoded({ extended: true, }));
// serve static files from public folder
app.use(express.static(__dirname + "/public"));
// set view engine to ejs
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// ensure user remains logged in throughout session
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


// load home page with axios call for data
app.get('/', function(req, res) {
  axios.get('https://api.coinmarketcap.com/v1/ticker/?start=0&limit=350')
    .then(function(response) {
      console.log('Home Page Refreshed');
       res.render('index', {user: req.user, coins: response.data})
     })
     .catch(function(err) {
       console.log(`Error: ${err}`);
    })
   })

// add to favorites
app.post('/addToFavorites', function(req, res) {
 var userId = req.user._id
 // find user to add the coin to their favorites
  User.findById(userId, function(err, foundUser) {
   if (err) {
     console.log(`Error: ${err}`);
   } else {
     console.log(`req.body: ${req.body}`);
    // the submitted form has a hidden input field with the coin's symbol
     Coin.findOne({symbol: req.body.symbol}, function(err, succ) {
       if (err) {
         console.log(`Error: ${err}`);
       } else {
         console.log(`Found Coin: ${succ}`);
         // if the coin we're trying to find doesn't exist, create a new one with the coin's symbol from the form
         if (succ === null) {
           var newCoin = new Coin({
             symbol: req.body.symbol
           });
           newCoin.save();
           console.log(`newCoin._id: ${newCoin._id}`);
           // push newCoin's id into user's favorites array
           foundUser.favorites.push(newCoin._id);
           foundUser.save()
           res.redirect('/')
         } else {
           foundUser.favorites.push(succ._id);
           foundUser.save()
           res.redirect('/')
         }
        }
      })
    }
  })
});

// load favorites view
app.get("/favorites/:id", function (req, res) {
  var userId = req.params.id;
  User.findById(userId, function(err, user) {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      // find the user and populate the 'symbol' attribute from the 'favorites' id
      // we pass the success from populate function to our front end
      // this allows us to retrieve the data from just the stored id reference
      User.findById(userId)
      .populate('favorites', 'symbol')
      .exec(function(err, returnedFavs) {
        console.log(`.exec fn returned: ${returnedFavs}`);
        axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=0')
          .then(function(response) {
            // passing User, API data & Favorites symbols to the ejs template
             res.render('favorites', {user: user, coinIds: response.data, favs: returnedFavs.favorites})
          })
        })
      }
    })
 });

// add coin to portfolio (mirrors add coin to favorites)
app.post('/addToPortfolio', function(req, res) {
  var userId = req.user._id
  User.findById(userId, function(err, foundUser) {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      // find coin by symbol from the hidden input field on the form body on ejs template view
      Coin.findOne({symbol: req.body.symbol}, function(err, succ) {
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          console.log(`Found Coin: ${succ}`);
          // if the coin doesn't exist in my db, create it
          if (succ === null) {
            console.log(req.body.qty);
            var newCoin = new Coin({
              symbol: req.body.symbol,
              qty: req.body.qty
            });
            newCoin.save();
            console.log(`newCoin._id: ${newCoin._id}`);
            // push the coin's _id value into the users portfolio array
            foundUser.portfolio.push(newCoin._id);
            foundUser.save()
            res.redirect('/')
          } else {
            foundUser.portfolio.push(succ._id);
            foundUser.save()
            res.redirect('/')
          }
        }
      })
    }
  })
})

// Update coin's quantity in user's portfolio
app.put('/portfolio/:id', function(req, res) {
  var userId = req.params.id;
  User.findById(userId, function(err, foundUser) {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      Coin.findOne({symbol: req.body.symbol}, function(err, succ) {
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          // updating the found coin's quantity to the quantity submitted on the form
          succ.qty = req.body.qty;
          succ.save(function(err, updateSaved) {
            if (err) {
              console.log(`Error: ${err}`);
            } else {
              User.findById(userId)
              .populate('portfolio', 'symbol qty')
              .exec(function(err, returnedPort) {
                axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=0')
                  .then(function(response) {
                    console.log(returnedPort.portfolio);
              console.log('Portfolio Saved: ' + updateSaved);
              res.render('portfolio', {user: foundUser, coinIds: response.data, portfolio: returnedPort.portfolio})
            })
          })
        }
      })
    }})
  }})
})

// Remove a coin from portfolio
app.put('/deleteFromPortfolio', function(req, res) {
  var userId = req.user._id
  User.findById(userId, function(err, foundUser) {
    if (err) {
      console.log("Error: " + err);
    } else {
      Coin.findById(req.body._id, function(err, succ) {
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          console.log(`Coin id: ${succ._id}`);
          var idToRemove = succ._id
          // here we have the user & ID of the coin we want to remove
          // use .find() to iterate through our user's portfolio array
          // if there's a match, we use .splice() to remove that ID
          foundUser.portfolio.find(function(value, index) {
            if (value.toString() === idToRemove.toString()) {
              return foundUser.portfolio.splice(index, 1);
            }
          });
          // need to save user or else deletion will not work
          foundUser.save(function(err, success) {
            if (err) {
              console.log(`Error: ${err}`);
            } else {
              User.findById(userId)
              .populate('portfolio', 'symbol qty')
              .exec(function(err, returnedPort) {
                axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=0')
                  .then(function(response) {
                    res.render('portfolio', {user: foundUser, coinIds: response.data, portfolio: returnedPort.portfolio})
                  })
                })
              }
            })
          }
        })
      }
    })
  })

// Delete from favorites (same as delete from portfolio)
app.put('/deleteFromFavorites', function(req, res) {
var userId = req.user._id
User.findById(userId, function(err, foundUser) {
  if (err) {
      console.log(`Error: ${err}`);
  } else {
    Coin.findById(req.body._id, function(err, succ) {
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        var idToRemove = succ._id
        foundUser.favorites.find(function(value, index) {
          if (value.toString() === idToRemove.toString()) {
            return foundUser.favorites.splice(index, 1);
          }
        });
        foundUser.save(function(err, success) {
          if (err) {
            console.log(`Error: ${err}`);
          } else {
            User.findById(userId)
            .populate('favorites', 'symbol')
            .exec(function(err, returnedFavs) {
              axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=0')
                .then(function(response) {
                  res.render('favorites', {user: foundUser, coinIds: response.data, favs: returnedFavs.favorites})
                })
              })
            }
          })
        }
      })
    }
  })
})


// view user's portfolio
app.get("/portfolio/:id", function (req, res) {
  var userId = req.params.id;
  console.log(userId);
  User.findById(userId, function(err, user) {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      User.findById(userId)
      .populate('portfolio', 'symbol qty')
      .exec(function(err, returnedPort) {
        axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=0')
          .then(function(response) {
            console.log(returnedPort.portfolio);
             res.render('portfolio', {user: user, coinIds: response.data, portfolio: returnedPort.portfolio})
           })
         })
       }
     })
   });

// a user's view if they are not signed in
app.get('/portfolio', function(req, res) {
  res.render('portfolio', {user: req.user})
})

// a user's view if they are not signed in
app.get('/favorites', function(req, res) {
  res.render('favorites', {user: req.user})
})

// Get news
app.get("/news", function (req, res) {
    res.render("news", {user: req.user});
  });

// signup page
app.get("/signup", function (req, res) {
    res.render("signup");
  });

// login page
app.get("/login", function (req, res) {
  res.render("login");
});

//view all data in db
app.get('/all', function(req, res) {
  User.find(function(err, allUsers) {
    if (err) {
      console.log("Error getting all Users: " +  err);
    } else {
      Coin.find(function(err, allCoins) {
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          res.json({users: allUsers, coins: allCoins})
        }
      })
    }
  })
})

// Register new user and redirect to profile
app.post("/signup", function (req, res) {
  console.log(req.body);
  User.register(new User({ username: req.body.username}), req.body.password,
      function () {
        passport.authenticate("local")(req, res, function() {
          req.user.save();
          res.redirect('/');
        })
      }
    )
  });

// user's profile page
app.get('/user/:id', function(req, res) {
  var userId = req.params.id;
  User.findById(userId, function(err, succ) {
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log(userId + " " + succ._id);
      res.render('profile', {user: succ, req: userId})
    }
  })
})

// page for user to update profile
app.get('/user/:id/update', function(req, res) {
  var Id = req.user._id;
  var userId = req.params.id;
  User.findById(userId, function(err, succ) {
    if (err) {
      console.log("Error: " + err);
    } else {
      res.render('update_profile', {user: succ, req: userId, id: Id})
    }
  })
})


// save changes to profile update
app.put('/user/:id', function(req, res) {
  var Id = req.user._id;
  var userId = req.params.id;
  User.findById(userId, function(err, foundUser) {
    if (err) {
      console.log("Error: " + err);
    } else {
      console.log("found user " + foundUser);
      foundUser.username = req.body.username;
      foundUser.save(function(err, updatedUserSaved) {
        if (err) {
          console.log(`Error: ${err}`);
        } else {
          console.log('User is Saved: ' + updatedUserSaved);
          res.render('profile', {user: updatedUserSaved, req: userId, id: Id})
        }
      })
    }
  })
})

// delete user
app.delete('/user/:id', function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, deletedUser) {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
    console.log("User Deleted Sucessfully");
    res.redirect('/');
    }
  })
})

// login
app.post("/login", passport.authenticate("local"), function (req, res) {
  User.findOne({email: req.body.email}, function(err, succ){
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      if (req.body.password) {
        res.redirect('/');
      } else {
        res.sendStatus(404);
      }
    }
  })
});

// logout (broken)
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("server started");
});
