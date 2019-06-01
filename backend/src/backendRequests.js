var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
import Question from './QuestionClass';
let questionInstance = new Question();
import { getDataFiles } from './fileUtil';
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const urlDeleteDeleteAll = '/deleteDeleteAll';
const urlGetFileList = '/getFileList';
const urlPatchDelete = '/patchDeleteQ';
const urlPostCreate = '/postCreateQ';
const urlPutFetch = '/putFetchQ';
const urlPostLoad = '/postLoadQ';
const urlPostProductQuery = '/postProductQuery';

exports.urlPatchDelete = urlPatchDelete;

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();
questionInstance.startDatabase('demo');
// TODO: Understand
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.delete(urlDeleteDeleteAll, async (req, res) => {
  const retVal = await questionInstance.deleteAllQuestions();
  return res.json(retVal);
});

router.get(urlGetFileList, async (req, res) => {
  const retVal = await getDataFiles();
  return res.json(retVal);
});

router.post(urlPostProductQuery, async (req, res) => {
  console.log('REQUEST BODY: ', req.body);
  const retVal = await getProductQuery(req.body);
  return res.json(retVal);
});

async function getProductQuery(json) {
  const addressStart = 'https://api.fda.gov/drug/ndc.json?search=brand_name:"';
  const addressEnd = '"&limit=10';
  const url = addressStart + json.brandName + addressEnd;
  const result = await getRequest(url);
  console.log('JSON: ', json);
  console.log('URL: ', url);
  console.log('RESULT: ', result);
  return result;
}

async function getRequest(myUrl) {
  var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
  xmlhttp.open('GET', myUrl);
  xmlhttp.setRequestHeader('Content-type', 'application/json');
  xmlhttp.send({});
  return new Promise((resolve, reject) => {
    xmlhttp.onload = e => {
      const responseText = JSON.parse(xmlhttp.responseText);
      resolve(responseText);
    };
  });
}

// xmlhttp delete does not send body
router.patch(urlPatchDelete, async (req, res) => {
  const retVal = await questionInstance.deleteQuestionsByIds(req.body.id);
  return res.json(retVal);
});

router.post(urlPostCreate, async (req, res) => {
  const retVal = await questionInstance.createQuestion(
    req.body.name,
    req.body.code,
    req.body.dose,
    req.body.number_of_pills,
    req.body.perday
  );
  return res.json(retVal);
});

router.post(urlPostLoad, async (req, res) => {
  const retVal = await questionInstance.createQuestionsFromJsonFile(
    req.body.filename
  );
  return res.json(retVal);
});

router.post(urlPutFetch, async (req, res) => {
  const retVal = await questionInstance.getQuestions(req.body);
  return res.json(retVal);
});

app.use('/api', router);
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
