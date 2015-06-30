console.log("models/user.js loading");

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
  name: {type: String, required: true},
  title: String,
  department: String,
  articlesCreated: [],
  articlesEdited: [],
  bio: String,
  email: String,
  password: {type: String, required: true}
});

var User = mongoose.model("User", userSchema);

module.exports = User;
