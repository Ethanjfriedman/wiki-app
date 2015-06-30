console.log("models/article.js loading");

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = Schema({
  author: {type: Object, required: true},
  editDates: [{type: Date}],
  editors: [],
  title:  {type: String, required: true},
  category: {type: String, required: true},
  content: {type: String, required: true}
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;
