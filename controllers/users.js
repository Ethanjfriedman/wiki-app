console.log("Users controller loading...");

var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

// INDEX --show all users
router.get('/', function(req, res) {
  User.find({}, function(err, usersArray) {
    if (err) {
      console.log(err);
    } else {
      res.render('users/index', {users: usersArray});
    }
  });
});

//NEW --form to make new one
router.get('/new', function(req, res) {
  res.render('users/new');
})

//CREATE --create the new one
router.post('/new', function(req, res) {
  var newUser = new User(req.body.user);

  newUser.save(function(err, user){
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      Users.find({}, function(err, usersArray) {
        if (err) {
          console.log(err);
        } else {
          res.render('index', {users: usersArray});
        }
      }); //WHERE DO I WANT THIS TO REDIRECT TO? FIXME
    }
  });
});

//SHOW -- detail view of one user
router.get('/:id/show', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log("whoopsie", err);
    } else {
      console.log(user);
      res.render('users/show', {user: user});
    }
  });
});

//DELETE -- delete user

// EDIT -- form to edit your user profile

//UPDATE -- update the user

module.exports = router;
