function makeQuestionJson(code, name, dose, number_of_pills, perday) {
  return {
    code: code,
    name: name,
    dose: dose,
    number_of_pills: number_of_pills,
    perday: perday
  };
}
export function makeQuestionJsonArray(questionValuesArray) {
  const retValArray = [];
  let index = 0;
  while (index < questionValuesArray.length) {
    const arrayElem = questionValuesArray[index];
    const code = arrayElem[0];
    const name = arrayElem[1];
    const dose = arrayElem[2];
    const number_of_pills = arrayElem[3];
    const perday = arrayElem[4];
    const questionJson = makeQuestionJson(
      code,
      name,
      dose,
      number_of_pills,
      perday
    );
    retValArray.push(questionJson);
    index = index + 1;
  }
  return retValArray;
}
