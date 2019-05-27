const assert = require('assert');
import { getDataFiles } from '../../backend/src/fileUtil';
describe('List files on backend', function() {
  describe('List files on backend', async function() {
    it('[LISTBACKENDFILES] List files on backend', async function() {
      const fileName = 'test_questions_dump.csv';
      const fileList = await getDataFiles();
      assert(fileList.includes(fileName));
    });
  });
});
