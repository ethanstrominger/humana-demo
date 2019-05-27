const assert = require('assert');
import Question from '../../backend/src/QuestionClass';
import { getJsonFromFile } from '../../backend/src/fileConversionUtil';
import { makeQuestionJsonArray } from '../../test_functions/testFunctions';
let questionInstance = new Question();

('use strict');

function questionsEqual(q1, q2) {
  return (
    String.toString(q1._id) == String.toString(q2.__id) &&
    q1.questionText == q2.questionText &&
    q1.answer == q2.answer &&
    q1.distractors == q2.distractors
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
    it('Convert question dump into json', async function() {
      const fileName = './data/test_questions_dump.csv';
      const jsonContents = await getJsonFromFile(fileName);
      const firstQuestion = jsonContents[0];
      assert(firstQuestion.questionText != undefined);
      assert(firstQuestion.answer != undefined);
      assert(firstQuestion.distractors != undefined);
    });

    it('Insert array of json into database', async function() {
      const bulkJson = makeQuestionJsonArray([
        ['What is 1*7? ', '7', '8, 6, 17'],
        ['What is 2*7? ', '14', '9, 5, 27'],
        ['What is 3*7? ', '21', '10, 4, 37']
      ]);
      const result = await questionInstance.bulkCreate(bulkJson);
      const questionCount = await questionInstance.getCountAllQuestions();
      assert(questionCount == 3);
    });

    it('Read delimited file into database', async function() {
      const fileName = './data/test_questions_dump.csv';
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

  describe('*** Test beforeEach does what is expected', function() {
    it('*** Insert one record, ensure deleted before next text', async function() {
      const createResult = await questionInstance.createQuestion(
        'What is 5*5?',
        '25',
        '0, 10, 1'
      );
    });

    it('*** Record count is 0 before start of a test', async function() {
      const start_count = await questionInstance.getCountAllQuestions();
      assert(start_count == 0);
    });
  });

  describe('Basic CRUD tests', function() {
    it('Insert and Delete same reord', async function() {
      const createResult = await questionInstance.createQuestion(
        'What is 5*5?',
        '25',
        '0, 10, 1'
      );
      const _id = createResult.data._id;
      assert(_id, 'Id generated');
      const deleteResult = await questionInstance.deleteQuestionById(_id);
      assert(questionsEqual(createResult.data, deleteResult.data));
    });

    it('Create and get questions', async function() {
      await questionInstance.createQuestion('What is 5*5?', '25', '0, 10, 1');
      const start_count = await questionInstance.getCountAllQuestions();
      assert(start_count > 0);
      const createResult = await questionInstance.deleteAllQuestions();
      const end_count = await questionInstance.getCountAllQuestions();
      assert(end_count == 0);
    });

    it('Delete all questions', async function() {
      await questionInstance.createQuestion('What is 5*5?', '25', '0, 10, 1');
      const start_count = await questionInstance.getCountAllQuestions();
      assert(start_count > 0);
      const createResult = await questionInstance.deleteAllQuestions();
      const end_count = await questionInstance.getCountAllQuestions();
      assert(end_count == 0);
    });

    it('Get test: Insert array of json into database, then get', async function() {
      const bulkJson = makeQuestionJsonArray([
        ['What is 1*7? ', '7', '8, 6, 17'],
        ['What is 2*7? ', '14', '9, 5, 27'],
        ['What is 3*7? ', '21', '10, 4, 37']
      ]);
      const insertResult = await questionInstance.bulkCreate(bulkJson);
      // TODO: Error handing in case insertResult does not succeed
      const getResult = await questionInstance.getQuestions();
      const data = getResult.data;
      assert.equal(data.length, 3);
    });

    // WIP
    it('xxxxxxxxxxGet test with filter: Insert array of json into database, then get', async function() {
      const bulkJson = makeQuestionJsonArray([
        ['What is 1*7? ', '7', '8, 6, 17'],
        ['What is 2*7? ', '14', '9, 5, 27'],
        ['What is 3*9?', '27', '12, 6, 39'],
        ['What is 3*90?', '270', '93, 87, 390']
      ]);
      const insertResult = await questionInstance.bulkCreate(bulkJson);

      let getResult = await questionInstance.getQuestions({
        questionTextContains: '3*9'
      });
      let data = getResult.data;
      assert.equal(data.length, 2);
      // assert.equal(data[0].questionText, 'What is 3*9?');
    });
  });

  after(async function(done) {
    // TODO: Consider having flag if you want to clean up database
    // TODO: mongoose.connection.db.dropDatabase(function() {
    questionInstance.closeDatabase();
    done();
  });
});
