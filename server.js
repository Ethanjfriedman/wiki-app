/*-------------------------------------------
-     Mock Internal Corporate Wiki app      -
-Ethan Friedman, GA Web Dev Intensive Course-
-                 June 2015                 -
-      Contact at ethanjf99@gmail.com       -
---------------------------------------------*/

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

//setting the port to either the process PORT if defined, otherwise it'll
//default to 3000
var PORT = process.env.PORT || 3000;

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

server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(express.static('./public'));
server.use(methodOverride('_method'));
server.use(morgan('short'));
server.use(expressLayouts);

//ROUTE FOR CHECKING THE SUBMITTED USERNAME AND PASSWORD AGAINST STORED VALUES
//TODO MOVE TO SESSION CONTROLLER
//WITH BCRYPT ENABLED
server.post('/', function (req, res) {
  var userEntered = req.body.user;
  User.findOne({name: userEntered.name}, function (err, user) {
      bcrypt.compare(userEntered.password, user.password, function (err, result) {
        if (result) {
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

//CREATING A NEW USER
server.post('/new', function(req, res) {
  var userEntered = req.body.user;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(userEntered.password, salt, function (err, hash) {
      userEntered.password = hash;
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
  User.findById(req.session.userId, function (err, user) {
    if (err) {
      console.log(err);
    } else {
    res.render('welcome', {user: user});
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
  server.listen(PORT, function(){
    console.log("Server UP AND RUNNING ON PORT", PORT);
  });
});
