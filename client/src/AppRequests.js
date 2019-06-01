const urlDeleteDeleteAll = '/deleteDeleteAll';
const urlGetFileList = '/getFileList';
const urlPatchDelete = '/patchDeleteQ';
const urlPostCreate = '/postCreateQ';
const urlPostLoad = '/postLoadQ';
const urlPutFetch = '/putFetchQ';

export async function createQuestionRequest(code, name, dose) {
  const json = {
    code: code,
    name: name,
    dose: dose
  };
  const response = await sendRequest('POST', urlPostCreate, json);
  return response;
}

export async function deleteAllRequest() {
  const json = {};
  const response = await sendRequest('DELETE', urlDeleteDeleteAll, json);
  return response;
}

export async function deleteByIdsReqest(idsToDelete) {
  const json = { id: idsToDelete };
  const response = await sendRequest('PATCH', urlPatchDelete, json);
  return response;
}

export async function getFileListRequest() {
  const json = {};
  const response = await sendRequest('GET', urlGetFileList, json);
  return response;
}

export async function getQuestionDataToRender(codeContains) {
  const json = { codeContains: codeContains };
  const response = await sendRequest('POST', urlPutFetch, json);
  return response['data'];
}

export async function loadFromFileRequest(filename) {
  const json = { filename: filename };
  const response = await sendRequest('POST', urlPostLoad, json);
  return response;
}

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
