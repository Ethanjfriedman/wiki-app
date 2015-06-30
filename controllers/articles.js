console.log("Articles controller loading");

var express = require('express');
var router = express.Router();
var Article = require('../models/article.js');
var User = require('../models/user.js');
var session = require('express-session');
var marked = require('marked');

//INDEX -- display all articles
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
  //testing here is unneccessary since I moved it to server.js (see the checkUserLogin() function )
  User.findById(req.session.userId, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect(404, '/login');
    } else {
      res.render('articles/new');
    }
  });
})

//CREATE --create the new one
router.post('/new', function(req, res) {
  var submission = req.body.article;
  submission.editors = [];
  console.log("session.userId:", req.session.userId);
  User.findById(req.session.userId, function (err, user) {
    submission.editors.push(user);
    submission.author = user;
    console.log("subission",submission);
    var newArticle = new Article(submission);
    newArticle.save(function(err, article){
      if (err) {
        console.log(err);
      } else {
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
      console.log("ID: ", article.author._id);
      User.findById(article.author._id, function (err, user) {
        res.render('articles/show', {article: article, user: user});
      });
    }
  });
});

//DELETE

// EDIT -- form to edit an article
router.get('/:id/edit', function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    res.render('articles/edit', {article: article});
  });
});

//UPDATE -- update the article
router.post('/:id/edit', function (req, res) {
  var submission = req.body.article;
    User.findById(req.session.userId,function (err, user) {
      if (err) {
        console.log(err);
        res.redirect(301, '/');
      } else {
        submission.editors.push(user);
        Article.findByIdAndUpdate(req.params.id, {
          title: submission.title,
          category: submission.category,
          editors: submission.editors,
          editDates: submission.editDates,
          content: submission.content
        }, function (err, article) {
          if (err) {
            console.log(err);
          } else {
            console.log('req params id:', req.params.id);
              res.redirect(301, '/articles/' + req.params.id + '/show');
          }
      });
    }
  });
});


module.exports = router;
