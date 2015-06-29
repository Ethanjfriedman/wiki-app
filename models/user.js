console.console.log("models/user.js loading");

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
  name: {type: String, required: true},
  title: String,
  department: String,
  articlesCreated: [],
  articlesEdited: []
});

var User = mongoose.model("User", userSchema);

module.exports = User;
