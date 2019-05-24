const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// TODO: Use constant below
const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  answer: { type: String, required: true },
  distractors: { type: String, required: true }
});
// let QuestionModel;

export default class QuestionTransaction {
  constructor() {
    this.QuestionModel = undefined;
  }
  static hello() {
    console.log('Hello');
    return 'hello';
  }

  async getQuestionSchema() {
    return new Promise((resolve, reject) => {
      let retVal = undefined;
      console.log('Here');
      try {
        console.log('A');
        retVal = mongoose.model('Question');
        console.log('M1', retVal);
        resolve(retVal);
      } catch (e) {
        console.log('B', e.name);
        if (e.name === 'MissingSchemaError') {
          console.log('C');
          let schema = new Schema({
            questionText: { type: String, required: true },
            answer: { type: String, required: true },
            distractors: { type: String, required: true }
          });
          console.log('M2', retVal);
          retVal = mongoose.model('Question', schema);
          resolve(retVal);
        }
      }
    });
  }

  async closeDatabase(env) {
    mongoose.connection.close();
  }

  createQuestion(questionText, answer, distractors) {
    // TODO: See if I can substitute variable above
    // let data = mongoose.model('Questions', QuestionSchema)();
    let data = this.QuestionModel();
    data.questionText = questionText;
    data.answer = answer;
    data.distractors = distractors;
    return new Promise((resolve, reject) => {
      data.save((err, doc) => {
        const retVal = this.returnRequestForDoc(err, doc);
        resolve(retVal);
      });
    });
  }

  async deleteAllQuestions() {
    return new Promise((resolve, reject) => {
      this.QuestionModel.remove({}, (err, result) => {
        const retVal = this.returnResultOrThrowErr(err, result);
        resolve(retVal);
      });
    });
  }

  async deleteQuestionById(id) {
    return new Promise((resolve, reject) => {
      this.QuestionModel.findByIdAndRemove(id, (err, doc) => {
        const retVal = this.returnRequestForDoc(err, doc);
        resolve(retVal);
      });
    });
  }

  async getCountAllQuestions() {
    return new Promise((resolve, reject) => {
      this.QuestionModel.count({}, (err, count) => {
        const retVal = this.returnResultOrThrowErr(err, count);
        resolve(retVal);
      });
    });
  }

  getQuestions() {
    return new Promise((resolve, reject) => {
      this.QuestionModel.find((err, doc) => {
        const retVal = this.returnRequestGeneric(err, doc);
        resolve(retVal);
      });
    });
  }

  returnRequestForDoc(err, doc) {
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

  returnRequestGeneric(err, docs) {
    if (err) {
      return {
        success: false,
        message: err.message,
        errorDetail: err
      };
    } else {
      const message = 'Request processed.';
      return { success: true, message: message, data: docs };
    }
  }

  returnResultOrThrowErr(err, result) {
    if (err) {
      throw err;
    } else {
      return result;
    }
  }

  async startDatabase(env) {
    console.log('Starting database');
    const dbRoute = 'mongodb://localhost/ethanstromingerdb' + env;
    mongoose.connect(dbRoute, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.once('open', () => console.log('connected to the database ' + dbRoute));
    db.on(
      'error',
      console.error.bind(console, 'MongoDB connection error: ' + dbRoute)
    );
    console.log('About to initiate model');
    this.QuestionModel = await this.getQuestionSchema();
    // try {
    //   this.QuestionModel = mongoose.model('Question', QuestionSchema);
    //   console.log('xxxx', this.QuestionModel);
    // } catch (err) {
    //   console.log('Error', err);
    // }
    console.log('Q', this.QuestionModel);
  }
}
console.log('XXXX');
