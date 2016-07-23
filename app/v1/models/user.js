var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
});

module.exports = mongoose.model('User', userSchema);