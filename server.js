console.log("Server.js for wiki app is loading...");
//GLOBAL VARS
var express                 = require('express'),
    server                  = express(),
    ejs                     = require('ejs'),
    bodyParser              = require('body-parser'),
    methodOverride          = require('method-override'),
    mongoose                = require('mongoose'),
    morgan                  = require('morgan'),
    expressLayouts          = require('express-ejs-layouts'),
    marked                  = require('marked'),
    bcrypt                  = require('bcrypt'),
    session                 = require('express-session');

var User = require('./models/user.js');
var Article = require('./models/article.js');

//SET
server.set('views', './views');
server.set('view engine', 'ejs');

//USE
//setting up session
server.use(session({
  secret: "Iamawikiapp",
  resave: true,
  saveUninitialized: false
}));

//TODO GET RID OF THIS TEST CODE
//session.userId = "559161b69096189e55061d73"

server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(express.static('./public'));
server.use(methodOverride('_method'));
server.use(morgan('short'));
server.use(expressLayouts);

//ROUTE FOR CHECKING THE SUBMITTED USERNAME AND PASSWORD AGAINST STORED VALUES
//TODO MOVE TO SESSION CONTROLLER

// //THIS IS FAKE LOGIN CODE WITHOUT ENCRYPTION
// server.post('/', function (req, res) {
//   var userEntered = req.body.user;
//   console.log("user entered:",userEntered);
//   User.findOne({name: userEntered.name, password: userEntered.password}, function (err, user) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("user is",user);
//       req.session.userId = user._id;
//       console.log(req.session);
//       res.render('welcome', {user: user});
//     }
//   });
// });

//WITH BCRYPT
server.post('/', function (req, res) {
  var userEntered = req.body.user;
  User.findOne({name: userEntered.name}, function (err, user) {
    //console.log(user);
      bcrypt.compare(userEntered.password, user.password, function (err, result) {
        //console.log(result);
        if (result) {
          //console.log("user is", user);
          req.session.userId = user._id;
          res.render('welcome', {user: user});
        } else {
          console.log("WRONG PASSWORD");
          res.render('login');
        }
      });
    // });
  });
});

server.post('/new', function(req, res) {
  var userEntered = req.body.user;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(userEntered.password, salt, function (err, hash) {
      userEntered.password = hash;
      console.log(hash);
      var newUser = new User(userEntered);
      newUser.save(function(err, user){
        if (err) {
          console.log(err);
        } else {
          console.log("new user is", newUser);
          res.redirect(301, '/');
        }
      });
    });
  });
});

var checkUserLogin = function(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.render('login');
  }
};

var articleController = require('./controllers/articles.js');
server.use('/articles', checkUserLogin, articleController);

server.get('/users/new', function (req, res) {
  console.log("let's make a new user!");
  res.render('users/new');
});

var userController=require('./controllers/users.js');
server.use('/users', checkUserLogin, userController);

server.get('/', checkUserLogin, function (req, res) {
  User.findById(session.userId, function (err, user) {
    if (err) {
      console.log(err);
    } else {
    res.render('welcome');
    }
  });
});

server.get('/logout', function (req, res) {
  res.render('logout');
});

// DATABASE + SERVER
mongoose.connect('mongodb://localhost:27017/ecorp');
var db = mongoose.connection;

db.on('error', function(){
  console.log("Database error!");
});

db.once('open', function(){
  console.log("Database UP AND RUNNING!");
  server.listen(3000, function(){
    console.log("Server UP AND RUNNING ON PORT 3000!")
  });
});
