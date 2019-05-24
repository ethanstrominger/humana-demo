const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  answer: { type: String, required: true },
  distractors: { type: String, required: true }
});
// ToDo: Is there a better way to do this?
let QuestionModel;

async function closeDatabase(env) {
  mongoose.connection.close();
}
exports.closeDatabase = closeDatabase;

function createQuestion(questionText, answer, distractors) {
  // TODO: See if I can substitute variable above
  let data = mongoose.model('Questions', QuestionSchema)();
  data.questionText = questionText;
  data.answer = answer;
  data.distractors = distractors;
  return new Promise((resolve, reject) => {
    data.save((err, doc) => {
      const retVal = returnRequestForDoc(err, doc);
      resolve(retVal);
    });
  });
}
exports.createQuestion = createQuestion;

async function deleteAllQuestions() {
  return new Promise((resolve, reject) => {
    QuestionModel.remove({}, (err, result) => {
      const retVal = returnResultOrThrowErr(err, result);
      resolve(retVal);
    });
  });
}
exports.deleteAllQuestions = deleteAllQuestions;

async function deleteQuestionById(id) {
  return new Promise((resolve, reject) => {
    QuestionModel.findByIdAndRemove(id, (err, doc) => {
      const retVal = returnRequestForDoc(err, doc);
      resolve(retVal);
    });
  });
}
exports.deleteQuestionById = deleteQuestionById;

async function getCountAllQuestions() {
  return new Promise((resolve, reject) => {
    QuestionModel.count({}, (err, count) => {
      const retVal = returnResultOrThrowErr(err, count);
      resolve(retVal);
    });
  });
}
exports.getCountAllQuestions = getCountAllQuestions;

function getQuestions() {
  return new Promise((resolve, reject) => {
    QuestionModel.find((err, doc) => {
      retVal = returnRequestGeneric(err, doc);
      resolve(retVal);
    });
  });
}
exports.getQuestions = getQuestions;

function returnRequestForDoc(err, doc) {
  if (err) {
    return {
      success: false,
      message: err.message,
      errorDetail: err
    };
  } else if (!doc) {
    return { success: false, message: 'No record found.' };
  } else {
    const message = 'Doc ' + doc.questionText + ' processed.';
    return { success: true, message: message, data: doc };
  }
}

function returnRequestGeneric(err, docs) {
  if (err) {
    return {
      success: false,
      message: err.message,
      errorDetail: err
    };
  } else {
    message = 'Request processed.';
    return { success: true, message: message, data: docs };
  }
}

function returnResultOrThrowErr(err, result) {
  if (err) {
    throw err;
  } else {
    return result;
  }
}
async function startDatabase(env) {
  const dbRoute = 'mongodb://localhost/ethanstromingerdb' + env;
  mongoose.connect(dbRoute, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.once('open', () => console.log('connected to the database ' + dbRoute));
  db.on(
    'error',
    console.error.bind(console, 'MongoDB connection error: ' + dbRoute)
  );
  QuestionModel = mongoose.model('Question', QuestionSchema);
}
exports.startDatabase = startDatabase;
