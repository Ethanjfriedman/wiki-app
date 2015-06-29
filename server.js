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
    session                 = require('express-session');

//var router = express.Router();
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

var articleController = require('./controllers/articles.js');
server.use('/articles', articleController);

var userController=require('./controllers/users.js');
server.use('/users', userController);

//CATCHALL ROUTES
// server.get('/', function(req, res){
//   if (session.userId) {
//     console.log("loading user");
//     User.findById(session.userId, function (err, user) {
//       if (err) {
//         console.log ("can't find user,", err);
//       } else {
//         console.log(user);
//         res.render('welcome', {user: user});
//       }
//     });
//   } else {
//     res.render('login');
//   }
// });
server.get('/', function (req, res) {
  if (session.userId) {
    User.findById(session.userId, function (err, user) {
      res.render('welcome', {user: user});
    });
  } else {
    res.render('login');
  }
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
