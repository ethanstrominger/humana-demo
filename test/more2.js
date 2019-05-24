const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  answer: { type: String, required: true },
  distractors: { type: String, required: true }
});
let QuestionModel;

export default class User {
  constructor() {}

  sayHi() {
    return 'Boat';
  }
}

// Usage:
let user = new User();
console.log(user.sayHi());
