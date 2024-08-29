const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const TodoSchema = new Schema({
  text: {
    type: String,
  },
  id: {
    type: String,
    required: true,
    // unique: true, 
  },
  completed: {
    type: Boolean,
    default: false,
  }
});

// Define the User schema with an array of todos
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  todos: [TodoSchema]  // Array of todo items using the TodoSchema
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
