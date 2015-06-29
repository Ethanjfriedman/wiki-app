console.log("Articles controller loading");

var express = require('express');
var router = express.Router();
var Article = require('../models/article.js');

// INDEX --show all todos
router.get('/', function(req, res) {
  Article.find({}, function(err, articlesArray) {
    if (err) {
      console.log(err);
    } else {
      res.render('articles/index', {articles: articlesArray});
    }
  });
});

//NEW --form to make new one
router.get('/new', function(req, res) {
  res.render('articles/new');
})

//CREATE --create the new one
router.post('/new', function(req, rest) {
  var newArticle = new Article(req.body.article);

  newArticle.save(function(err, article){
    if (err) {
      console.log(err);
    } else {
      console.log(article);
      res.redirect(301, '/articles');
    }
  });
});

//SHOW -- detail view of one article

//DELETE

// EDIT -- form to edit an article

//UPDATE -- update the article

module.exports = router;
