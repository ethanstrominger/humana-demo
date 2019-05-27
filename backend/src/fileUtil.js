const csvtojson = require('csvtojson');
const fs = require('fs');
export { getJsonFromFile, getDataFiles };

// TODO: Better way to do this
function standardizeFieldNamesOfJson(json) {
  let str = JSON.stringify(json);
  str = str.replace(/\"question\":/g, '"questionText":');
  const returnJson = JSON.parse(str);
  return returnJson;
}

async function getDataFiles() {
  var files = fs.readdirSync('./data');
  return new Promise((resolve, reject) => {
    resolve(files);
  });
}

async function getJsonFromFile(fileName) {
  const converter = csvtojson({ delimiter: '|' });
  const fileJson = await converter.fromFile('./data/' + fileName);
  return new Promise((resolve, reject) => {
    const jsonWithStandardFieldNames = standardizeFieldNamesOfJson(fileJson);
    resolve(jsonWithStandardFieldNames);
  });
}

async function insertJsonFromFile() {}
