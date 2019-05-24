const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionSchema = new Schema({
  question_text: { type: String, required: true },
  answer: { type: String, required: true },
  distractors: { type: String, required: true }
});
exports.questionSchema = questionSchema;

// TODO: This could be prettied
function makeQuestionJson(question_text, answer, distractors) {
  var json_text =
    '{"question_text": "' +
    question_text +
    '","answer": "' +
    answer +
    '","distractors": "' +
    distractors +
    '"}';
  var obj = JSON.parse(json_text);
  return obj;
}
exports.makeQuestionJson = makeQuestionJson;

function createQuestion(
  questionModelToInsert,
  question_text,
  answer,
  distractors,
  done
) {
  var questionJson = makeQuestionJson(question_text, answer, distractors);
  var testName = questionModelToInsert({ questionJson });
  var testName = questionModelToInsert(questionJson);
  testName.save(done);
}
exports.createQuestion = createQuestion;

function deleteAllRecords(questionModelToDelete, done) {
  questionModelToDelete.deleteMany({}, function(err, res) {
    if (err) {
      throw err;
    }
    return done();
  });
}
exports.deleteAllRecords = deleteAllRecords;
