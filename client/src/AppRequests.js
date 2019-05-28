const urlPatchDelete = '/patchDeleteQ';
const urlGetFileList = '/getFileList';
const urlPostCreate = '/postCreateQ';
const urlPostLoad = '/postLoadQ';
const urlPutFetch = '/putFetchQ';

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

export async function getFileListRequest() {
  const json = {};
  const response = await sendRequest('GET', urlGetFileList, json);
  console.log('response ============>', response);
  return response;
}

export async function loadFromFileRequest(filename) {
  const json = { filename: filename };
  const response = await sendRequest('POST', urlPostLoad, json);
  return response;
}

export async function deleteByIdReqest(idsToDelete) {
  const json = { id: idsToDelete };
  const response = await sendRequest('PATCH', urlPatchDelete, json);
  return response;
}

export async function createQuestionRequest(questionText, answer, distractors) {
  const json = {
    questionText: questionText,
    answer: answer,
    distractors: distractors
  };
  const response = await sendRequest('POST', urlPostCreate, json);
  return response;
}

// TODO: Change to use sendRequest?
export async function getQuestionDataToRender(questionTextContains) {
  const json = { questionTextContains: questionTextContains };
  const response = await sendRequest('POST', urlPutFetch, json);
  return response['data'];
}
