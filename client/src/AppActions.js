// TODO: Put this in common f ile
const urlPatchDelete = '/patchDeleteQ';
const urlPutUpdate = '/putUpdateQ';
const urlPostCreate = '/postCreateQ';
const urlGetGet = '/getGetQ';

async function sendRequest(method, urlEnding, json) {
  const jsonString = JSON.stringify(json);
  const theUrl = 'http://localhost:3001/api' + urlEnding;
  var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
  xmlhttp.open(method, theUrl);
  xmlhttp.setRequestHeader('Content-type', 'application/json');
  xmlhttp.send(jsonString);
  return new Promise((resolve, reject) => {
    xmlhttp.onload = e => {
      const responseText = JSON.parse(xmlhttp.responseText);
      resolve(responseText);
    };
  });
}

export async function deleteByIdReqest(idToDelete) {
  const json = { id: idToDelete };
  const response = await sendRequest('PATCH', urlPatchDelete, json);
  return response;
}

export async function createQuestionRequest(questionText, answer, distractors) {
  // TODO: Make into a function?
  const json = {
    questionText: questionText,
    answer: answer,
    distractors: distractors
  };
  const response = await sendRequest('POST', urlPostCreate, json);
  return response;
}

// TODO: Can this use sendRequest also?
export async function getQuestionDataToRender() {
  const Http = new XMLHttpRequest();
  Http.open('GET', 'http://localhost:3001/api/getData');
  await Http.send();
  return new Promise((resolve, reject) => {
    Http.onload = e => {
      const questionData = JSON.parse(Http.responseText)['data'];
      resolve(questionData);
    };
  });
}
