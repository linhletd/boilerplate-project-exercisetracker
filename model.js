let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// let ObjectId = Schema.Types.ObjectId;

let UserSchema = new Schema({
  username: {type: String},
  userid: {type: String}
});

let ExerciseSchema = new Schema({
  userid: {type: String},
  description: {type: String},
  duration:{type: Number},
  date: {type: Date, 'default': Date.now}
})

module.exports = {
  UserModel: mongoose.model('User',UserSchema),
  ExerciseModel: mongoose.model('Exercise', ExerciseSchema)
}
