import { getJsonFromFile } from './fileUtil';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  answer: { type: String, required: true },
  distractors: { type: String, required: true }
});

const MAX_RECORDS_FETCH = 100;
export default class Question {
  constructor() {
    this.QuestionModel = undefined;
  }

  async bulkCreate(questionsJson) {
    let data = this.QuestionModel;
    return new Promise((resolve, reject) => {
      data.insertMany(questionsJson, (err, doc) => {
        const retVal = this.returnRequestForDoc(err, doc);
        resolve(retVal);
      });
    });
  }

  async closeDatabase(env) {
    mongoose.connection.close();
  }

  createQuestion(questionText, answer, distractors) {
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

  async createQuestionsFromJsonFile(fileName) {
    const json = await getJsonFromFile(fileName);
    const result = await this.deleteAllQuestions();
    const retVal = await this.bulkCreate(json);
    return new Promise((resolve, reject) => {
      resolve(retVal);
    });
  }

  async deleteAllQuestions() {
    return new Promise((resolve, reject) => {
      this.QuestionModel.deleteMany({}, (err, result) => {
        const retVal = this.returnResultOrThrowErr(err, result);
        resolve(retVal);
      });
    });
  }

  async deleteQuestionsByIds(ids) {
    return new Promise((resolve, reject) => {
      this.QuestionModel.deleteMany({ _id: ids }, (err, doc) => {
        const retVal = this.returnRequestForDoc(err, doc);
        resolve(retVal);
      });
    });
  }

  async getCountAllQuestions() {
    return new Promise((resolve, reject) => {
      this.QuestionModel.countDocuments({}, (err, count) => {
        const retVal = this.returnResultOrThrowErr(err, count);
        resolve(retVal);
      });
    });
  }

  getQuestions(filterParams) {
    let questionFilter = {};
    if (filterParams) {
      if (filterParams.questionTextContains) {
        let contains = filterParams.questionTextContains;
        // TODO: Esc the ? instead of replacing.  ? is a special character to ?
        contains = contains.replace('?', '');
        questionFilter = { questionText: new RegExp(contains, 'i') };
      }
    }
    return new Promise((resolve, reject) => {
      this.QuestionModel.find(questionFilter, (err, doc) => {
        const retVal = this.returnRequestGeneric(err, doc);
        resolve(retVal);
      }).limit(MAX_RECORDS_FETCH);
    });
  }

  async getQuestionSchema() {
    return new Promise((resolve, reject) => {
      let retVal = undefined;
      try {
        retVal = mongoose.model('Question');
        resolve(retVal);
      } catch (e) {
        if (e.name === 'MissingSchemaError') {
          let schema = QuestionSchema;
          // let schema = new Schema({
          //   questionText: { type: String, required: true },
          //   answer: { type: String, required: true },
          //   distractors: { type: String, required: true }
          // });
          retVal = mongoose.model('Question', schema);
          resolve(retVal);
        } else {
          throw e;
        }
      }
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
    mongoose.connect(dbRoute, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    const db = mongoose.connection;
    db.once('open', () => console.log('connected to the database ' + dbRoute));
    db.on(
      'error',
      console.error.bind(console, 'MongoDB connection error: ' + dbRoute)
    );
    this.QuestionModel = await this.getQuestionSchema();
  }
}
