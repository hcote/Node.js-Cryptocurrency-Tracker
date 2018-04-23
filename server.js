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
  LocalStrategy = require("passport-local").Strategy,
  axios = require('axios');

var findOrCreate = require('mongoose-findoneorcreate')

// require Post model
var db = require("./models"),
  User = db.User,
  Coin = db.Coin;
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

// CHECK - cron npm
app.get('/', function(req, res) {
  axios.get('https://api.coinmarketcap.com/v1/ticker/')
    .then(function(response) {
      // for (i = 0; i < response.data.length; i++) {
      //   Coin.findOneAndUpdate({id: response.data[i].id}, {price_usd: response.data[i].price_usd}, function(err, updated) {
      //     if (err) {
      //       console.log(err);
      //     } else {
      //       console.log(`updated: ${updated}`);
      //       console.log('Hello');
      //     }
      //     console.log('hello3');
      //   })
      //   console.log('hello4');
      // }
      // console.log('Hello 2');
      // res.render('index', {user: req.user, coins: updated})

       // Coin.create(response.data, function(err, coinsCreated) {
       //    if (err) {
       //     console.log(err);
       //   } else {
       //     Coin.find(function(err, allCoins) {
       //       if (err) {
       //         console.log(err);
       //       } else {
       //           res.render('index', {user: req.user, coins: allCoins})
       //       }
       //     })
       //   }
       // })
       res.render('index', {user: req.user, coins: response.data})

     })
     .catch(function(err) {
       console.log(err);
    })
   })

// Bittrex API
// app.get('/home', function(req, res) {
//   axios.get('https://bittrex.com/api/v1.1/public/getmarketsummaries')
//     .then(function(response) {
//        console.log(response.data);
//      })
//      .catch(function(err) {
//        console.log(err);
//     })
//    })

// Add favorites
app.post('/addToFavorites', function(req, res) {
 var userId = req.user._id
  User.findById(userId, function(err, foundUser) {
   if (err) {
     console.log(`Err: ${err}`);
   } else {
     console.log('hello: ' + req.body);
     Coin.findOne({symbol: req.body.symbol}, function(err, succ) {
       if  (err) {
         console.log(`ERROR: ${err}`);
       } else {
         console.log(`Succ: ${succ}`);
         if (succ === null) {
           var newCoin = new Coin(coinId);
           newCoin.save();
           console.log('newCoin._id: ' + newCoin._id);
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

// Get favorites tab
app.get("/favorites/:id", function (req, res) {
  var userId = req.params.id;
  console.log(userId);
  User.findById(userId, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      User.find()
      .populate('favorites', 'symbol')
      .exec(function(err, returnedFavs) {
        console.log(`.exec fn returned: ${returnedFavs}`);

        axios.get('https://api.coinmarketcap.com/v1/ticker/')
          .then(function(response) {
            console.log(returnedFavs[0].favorites[0]);
            console.log(returnedFavs[0].favorites[0].symbol);
             res.render('favorites', {user: user, coinIds: response.data, favs: returnedFavs[0].favorites})
           })
          // res.render('favorites', {user: user, coinIds: returnedFavs[0].favorites});
      })
    }
  })
});

// View forums
app.get("/forums", function (req, res) {
      res.render("forums");
    });

// Get news
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

// View all data in db
app.get('/all', function(req, res) {
  User.find(function(err, allUsers) {
    if (err) {
      console.log("Error getting all Users: " +  err);
    } else {
      Coin.find(function(err, allCoins) {
        if (err) {
          console.log(err);
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
          res.redirect(`/user/${req.user._id}`);
      })
    }
  )
});


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

  // Coin show page
  app.get('/:symbol', function(req, res) {
    var coinId = req.params.symbol;
    Coin.find({symbol: coinId}, function(err, succ) {
      if (err) {
        console.log(err);
      } else {
        User.find(function(err, users) {
          if (err) {
            console.log(err);
          } else {
            console.log(succ);
            res.render('coin_show', {coin: succ, user: users})
          }
        })
      }
    })
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

app.post('/addCoin', function(req, res) {
  var userId = req.user._id
  User.findById(userId, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      Coin.find({symbol: req.body.symbol}, function(err, foundCoin) {
        // console.log(`foundCoin: ${foundCoin}`);
        console.log(`foundCoin: ${foundCoin[0].name}` );
        console.log(`req.body.symbol: ${req.body.symbol}`);
        var newCoin = new Coin ({
          rank: foundCoin[0].rank,
          market_cap_usd: foundCoin[0].market_cap_usd,
          percent_change_7d: foundCoin[0].percent_change_7d,
          percent_change_24h: foundCoin[0].percent_change_24h,
          symbol: foundCoin[0].symbol,
          name: foundCoin[0].id,
          price_usd: foundCoin[0].price_usd,
          price_btc: foundCoin[0].price_btc,
          qty: req.body.qty
        })
        newCoin.save(function(err, saved) {
          if (err) {
            (`Error saving: ${err}`)
          } else {
            console.log(`newCoin saved: ${newCoin}`);
            foundUser.portfolio.push(newCoin.id);
            console.log(`foundUser portfolio: ${foundUser.portfolio}`);
            foundUser.save()
            res.redirect('/')
          }
        })
      })
    }
  })
})

// CHECK
app.get("/portfolio/:id", function (req, res) {
  var userId = req.params.id;
  console.log(userId);
  User.findById(userId, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      User.find()
      .populate('portfolio', 'rank name symbol price_btc price_usd market_cap_usd percent_change_7d percent_change_24h qty')
      .exec(function(err, returnedPort) {
        console.log(`.exec fn returned: ${returnedPort}`);
          res.render('portfolio', {user: user, coinIds: returnedPort[0].portfolio});
      })
    }
  })
});

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
      console.log("Error trying to delete profile: " + err);
    } else {
    console.log("User Deleted Sucessfully");
    res.redirect('/');
  }
  })
})

// Login
app.post("/login", passport.authenticate("local"), function (req, res) {
  User.findOne({email: req.body.email}, function(err, succ){
    console.log("Error is: " + err);
    console.log("Success is: " + succ);
    if(req.body.password === succ.password) {
      res.redirect(`/user/${req.user._id}`);
    }
    else{
      console.log(err);
      res.sendStatus(404);
    }
  })
})

// Logout does not work yet
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log("server started");
});
