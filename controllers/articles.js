console.log("Articles controller loading");

var express = require('express');
var router = express.Router();
var Article = require('../models/article.js');
var User = require('../models/user.js');
var session = require('express-session');
var marked = require('marked');

// INDEX --show all articles
// router.get('/', function(req, res) {
//
//   var users = User.find({}, function (err, usersArray) {
//     if (err) {
//       console.log(err);
//     } else {
//       Article.find({}, function(err, articlesArray) {
//         if (err) {
//           console.log(err);
//         } else {
//           res.render('articles/index', {articles: articlesArray, users: usersArray});
//         }
//       });
//     }
//   });

router.get('/', function (req, res) {
  User.find({}, function (err, usersArray) {
    if (err) {
      console.log("Error pulling up users database", err);
    } else {
      Article.find({}, function(err, articlesArray) {
        if (err) {
          console.log("Error pulling up articles database", err);
        } else {
          res.render('articles/index', {articles: articlesArray, users: usersArray});
        }
      });
    }
  });
});

//NEW --form to make new one
router.get('/new', function(req, res) {
  //TEST HERE TO SEE IF SESSION EXISTS AND USER IS AVAILABLE IF SO:
  User.findById(req.session.userId, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render('articles/new');
    }

  });
  //if not redirect to login page
})

//CREATE --create the new one
router.post('/new', function(req, res) {
  //console.log("session id", session.userId);
  var submission = req.body.article;
  submission.editors = [];
  User.findById(req.session.userId, function (err, user) {
    submission.editors.push(user._id);
    submission.author = user._id;
    var newArticle = new Article(submission);
    newArticle.save(function(err, article){
      if (err) {
        console.log(err);
      } else {
        //console.log(article);
        User.findByIdAndUpdate(req.session.userId, {articlesCreated: article}, function (err, user) {
          if (err) {
            console.log(err);
          } else {
            res.redirect(301, '/articles');
          }
        });
      }
    });
  });
});

//SHOW -- detail view of one article
router.get('/:id/show', function (req, res) {
  Article.findById(req.params.id, function(err, article) {
    if (err) {
      console.log("dagnabbit", err);
    } else {
      User.findById(article.author, function (err, user) {
        console.log("author of article is", user); 
        res.render('articles/show', {article: article, user: user});
      });
    }
  });
});

//DELETE

// EDIT -- form to edit an article
router.get('/:id/edit', function(req, res) {

});

//UPDATE -- update the article

module.exports = router;
