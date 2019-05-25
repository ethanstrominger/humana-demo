import Question from '../../backend/src/QuestionClass';
let questionInstance = new Question();
const {
  deleteQuestionById,
  createQuestion,
  startDatabase,
  getQuestions
} = require('./dbTransactions');

const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const urlPatchDelete = '/patchDeleteQ';
const urlPutUpdate = '/putUpdateQ';
const urlPostCreate = '/postCreateQ';
const urlGetGet = '/getGetQ';
exports.urlPatchDelete = urlPatchDelete;

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();
questionInstance.startDatabase('prod');
// TODO: Understand
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// for logging
app.use(logger('dev'));

router.get('/getData', async (req, res) => {
  const retVal = await questionInstance.getQuestions();
  return res.json(retVal);
});

// xmlhttp delete does not send body
router.patch(urlPatchDelete, async (req, res) => {
  const retVal = await questionInstance.deleteQuestionById(req.body.id);
  return res.json(retVal);
});

router.post(urlPostCreate, async (req, res) => {
  const retVal = await questionInstance.createQuestion(
    req.body.questionText,
    req.body.answer,
    req.body.distractors
  );
  return res.json(retVal);
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
