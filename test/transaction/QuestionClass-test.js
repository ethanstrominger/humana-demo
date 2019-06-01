const assert = require('assert');
import Question from '../../backend/src/QuestionClass';
import { getJsonFromFile } from '../../backend/src/fileUtil';
import { makeQuestionJsonArray } from '../../test_functions/testFunctions';
let questionInstance = new Question();

('use strict');

function questionsEqual(q1, q2) {
  return (
    String.toString(q1._id) == String.toString(q2.__id) &&
    q1.code == q2.code &&
    q1.name == q2.name &&
    q1.dose == q2.dose &&
    q1.number_of_pills == q2.number_of_pills &&
    q1.perday == q2.perday
  );
}

describe('Question Database Tests', function() {
  before(async function(done) {
    questionInstance.startDatabase('Test');
    done();
  });

  beforeEach(function() {
    // deleteAllQuestion returns a promise, which is why this works
    return questionInstance.deleteAllQuestions();
  });

  describe('Test delimited text load', async function() {
    it('[GETJSONFROMFILE] Convert question dump into json', async function() {
      const fileName = 'basic_meds.csv';
      const jsonContents = await getJsonFromFile(fileName);
      const firstQuestion = jsonContents[0];
      assert(firstQuestion.name != undefined);
      assert(firstQuestion.code != undefined);
      assert(firstQuestion.dose != undefined);
      assert(firstQuestion.number_of_pills != undefined);
      assert(firstQuestion.perday != undefined);
    });

    // it('[CREATEBULK][COUNTALL] Insert array of json into database', async function() {
    //   const bulkJson = makeQuestionJsonArray([
    //     ['What is 1*7? ', '7', '8, 6, 17'],
    //     ['What is 2*7? ', '14', '9, 5, 27'],
    //     ['What is 3*7? ', '21', '10, 4, 37']
    //   ]);
    //   const result = await questionInstance.bulkCreate(bulkJson);
    //   const questionCount = await questionInstance.getCountAllQuestions();
    //   assert(questionCount == 3);
    // });

    it('[CREATEFROMJSONFILE] Read delimited file into database', async function() {
      const fileName = 'basic_meds.csv';
      const jsonContents = await getJsonFromFile(fileName);
      const retval = await questionInstance.createQuestionsFromJsonFile(
        fileName
      );
      const questionCount = await questionInstance.getCountAllQuestions();
      assert(questionCount > 0);
      assert.equal(questionCount, jsonContents.length);
      // assert (questionsContentsEqual(jsonContents,dbContents));
    });
  });

  describe('Test beforeEach does what is expected', function() {
    it('[CREATE] Insert one record, in next test, ensure deleted', async function() {
      const createResult = await questionInstance.createQuestion(
        'What is 5*5?',
        '25',
        '0, 10, 1'
      );
    });

    it('[GET] Record count is 0 before start of a test', async function() {
      const startCount = await questionInstance.getCountAllQuestions();
      assert(startCount == 0);
    });
  });

  describe('Basic CRUD tests', function() {
    it('[CREATE][DELETE] Create and delete same reord', async function() {
      const createResult = await questionInstance.createQuestion(
        'What is 5*5?',
        '25',
        '0, 10, 1',
        '100',
        '4'
      );
      const _id = createResult.data._id;
      const startCount = await questionInstance.getCountAllQuestions();
      assert.equal(startCount, 1);
      const deleteResult = await questionInstance.deleteQuestionsByIds([_id]);
      const endCount = await questionInstance.getCountAllQuestions();
      assert.equal(endCount, 0);
    });

    it('[CREATE][DELETE][GET] Create 3 and delete 2', async function() {
      const createResult1 = await questionInstance.createQuestion(
        'What is 5*5?',
        '25',
        '0, 10, 1',
        '100',
        '4'
      );
      const createResult2 = await questionInstance.createQuestion(
        'What is 6*5?',
        '25',
        '0, 10, 1',
        '100',
        '4'
      );
      const createResult3 = await questionInstance.createQuestion(
        'What is 7*5?',
        '25',
        '0, 10, 1',
        '100',
        '4'
      );
      const _id1 = createResult1.data._id;
      const _id2 = createResult2.data._id;
      const _id3 = createResult3.data._id;
      const startCount = await questionInstance.getCountAllQuestions();
      assert.equal(startCount, 3);
      const deleteResult = await questionInstance.deleteQuestionsByIds([
        _id1,
        _id3
      ]);
      const endCount = await questionInstance.getCountAllQuestions();
      assert.equal(endCount, 1);
      const getResults = await questionInstance.getQuestions();
      const data = getResults.data;
      assert(data[0]._id.equals(_id2));
    });

    it('[CREATE][DELETEALL]Create and Delete All Questions', async function() {
      await questionInstance.createQuestion(
        'What is 5*5?',
        '25',
        '0, 10, 1',
        '100',
        '4'
      );
      const startCount = await questionInstance.getCountAllQuestions();
      assert(startCount > 0);
      const createResult = await questionInstance.deleteAllQuestions();
      const endCount = await questionInstance.getCountAllQuestions();
      assert(endCount == 0);
    });

    // it('[CREATEBULK][GET] Get test: Insert array of json into database, then get', async function() {
    //   const bulkJson = makeQuestionJsonArray([
    //     ['What is 1*7? ', '7', '8, 6, 17'],
    //     ['What is 2*7? ', '14', '9, 5, 27'],
    //     ['What is 3*7? ', '21', '10, 4, 37']
    //   ]);
    //   const insertResult = await questionInstance.bulkCreate(bulkJson);
    //   const getResult = await questionInstance.getQuestions();
    //   const data = getResult.data;
    //   assert.equal(data.length, 3);
    // });

    // WIP
    // it('[CREATEBULK][GET] Get test with filter: Insert array of json into database, then get', async function() {
    //   const bulkJson = makeQuestionJsonArray([
    //     ['What is 1*7? ', '7', '8, 6, 17'],
    //     ['What is 2*7? ', '14', '9, 5, 27'],
    //     ['What is 3*9?', '27', '12, 6, 39'],
    //     ['What is 3*90?', '270', '93, 87, 390']
    //   ]);
    //   const insertResult = await questionInstance.bulkCreate(bulkJson);

    //   let getResult = await questionInstance.getQuestions({
    //     codeContains: '3*9'
    //   });
    //   let data = getResult.data;
    //   assert.equal(data.length, 2);
    //   // assert.equal(data[0].code, 'What is 3*9?');
    // });
  });

  after(async function(done) {
    // TODO: Consider having flag if you want to clean up database
    // TODO: mongoose.connection.db.dropDatabase(function() {
    questionInstance.closeDatabase();
    done();
  });
});
