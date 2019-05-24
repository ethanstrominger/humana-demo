// const {
//   startDatabase: startDatabase,
//   closeDatabase: closeDatabase,
//   createQuestion: createQuestion,
//   deleteQuestionById: deleteQuestionById,
//   getCountAllQuestions: getCountAllQuestions,
//   deleteAllQuestions: deleteAllQuestions,
//   loadFile: loadFile,
//   getJsonFromFile: getJsonFromFile,
//   QuestionTransactions: QuestionTransactions
// } = require('../../backend/src/dbTransactions');
const assert = require('assert');
import Question from '../../backend/src/QuestionClass';
import { getJsonFromFile } from '../../backend/src/fileConversionUtil';
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
    it('Read delimited file into database', async function() {
      const fileName = './data/test_questions_dump.csv';
      const jsonContents = await getJsonFromFile(fileName);
      console.log('Contents', jsonContents);
      const firstQuestion = jsonContents[0];
      console.log('First', firstQuestion);
      assert(firstQuestion.questionText != undefined);
      console.log('json', jsonContents);
      // await questionInstance.loadFile(fileName);
      // const questionCount = await questionInstance.getCountAllQuestions();
      // assert (questionCount > 0 );
      // const dbContents = await questionInstance.getQuestions();
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
      console.log('ID');
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

    it('Delete all questions', async function() {
      await questionInstance.createQuestion('What is 5*5?', '25', '0, 10, 1');
      const start_count = await questionInstance.getCountAllQuestions();
      assert(start_count > 0);
      const createResult = await questionInstance.deleteAllQuestions();
      const end_count = await questionInstance.getCountAllQuestions();
      assert(end_count == 0);
    });
  });

  after(async function(done) {
    // TODO: Consider having flag if you want to clean up database
    // TODO: mongoose.connection.db.dropDatabase(function() {
    questionInstance.closeDatabase();
    done();
  });
});
