function makeQuestionJson(questionText, answer, distractors) {
  return {
    questionText: questionText,
    answer: answer,
    distractors: distractors
  };
}
export function makeQuestionJsonArray(questionValuesArray) {
  const retValArray = [];
  let index = 0;
  while (index < questionValuesArray.length) {
    const arrayElem = questionValuesArray[index];
    const questionText = arrayElem[0];
    const answer = arrayElem[1];
    const distractors = arrayElem[2];
    const questionJson = makeQuestionJson(questionText, answer, distractors);
    retValArray.push(questionJson);
    index = index + 1;
  }
  return retValArray;
}
