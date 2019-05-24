var { DELIM } = require('./question_constants');

function get_question_json_from_delim_question(delim_question) {
  const field_array = delim_question.split(DELIM);
  const return_json = {
    text: field_array[0],
    answer: field_array[1],
    distractor: field_array[2]
  };
  return return_json;
}

module.exports = {
  get_question_json_from_delim_question: get_question_json_from_delim_question
};
