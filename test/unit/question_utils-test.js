var { DELIM } = require('../../src/question_constants');
var {
  get_question_json_from_delim_question
} = require('../../src/question_utils');
var assert = require('assert');
('use strict');
// TODO: Make below simpler to read by having a string
describe('Get question json from a delimited question', function() {
  const question_text = 'What is 1754 - 3936?';
  const answer = '-2182';
  const distractor = '3176, 6529, 6903';
  const sample_delim_record =
    question_text + DELIM + answer + DELIM + distractor;
  const question_json = get_question_json_from_delim_question(
    sample_delim_record
  );
  it('json should be set to values specified', function() {
    assert.equal(question_json.text, question_text);
    // expect(question_json.answer).toEqual(answer);
    // expect(question_json.distractor).toEqual(distractor);
  });
});
