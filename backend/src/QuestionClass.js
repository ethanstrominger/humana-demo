import { getJsonFromFile } from '../../backend/src/fileConversionUtil';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CSVToJSON = require('csvtojson');

// TODO: Use QuestionSchema in getQuestionSchema function
const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  answer: { type: String, required: true },
  distractors: { type: String, required: true }
});

export default class Question {
  constructor() {
    this.QuestionModel = undefined;
  }

  async bulkCreate(questionsJson) {
    // TODO: Clarify when to use QuestionModel vs QuestionModel()
    let data = this.QuestionModel;
    return new Promise((resolve, reject) => {
      data.insertMany(questionsJson, (err, doc) => {
        const retVal = this.returnRequestForDoc(err, doc);
        resolve(retVal);
      });
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
          let schema = new Schema({
            questionText: { type: String, required: true },
            answer: { type: String, required: true },
            distractors: { type: String, required: true }
          });
          retVal = mongoose.model('Question', schema);
          resolve(retVal);
        } else {
          throw e;
        }
      }
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
    console.log('json', json);
    const retVal = await this.bulkCreate(json);
    return new Promise((resolve, reject) => {
      resolve(retVal);
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
    this.QuestionModel = await this.getQuestionSchema();
  }
}
