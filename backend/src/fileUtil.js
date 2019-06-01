const csvtojson = require('csvtojson');
const fs = require('fs');
export { getJsonFromFile, getDataFiles };

async function getDataFiles() {
  var files = fs.readdirSync('./data');
  return new Promise((resolve, reject) => {
    resolve(files);
  });
}

async function getJsonFromFile(fileName) {
  const converter = csvtojson({ delimiter: ',' });
  const fileJson = await converter.fromFile('./data/' + fileName);
  return new Promise((resolve, reject) => {
    const jsonWithStandardFieldNames = standardizeFieldNamesOfJson(fileJson);
    resolve(jsonWithStandardFieldNames);
  });
}

// TODO: Change header of file instead of changing all the json
function standardizeFieldNamesOfJson(json) {
  let str = JSON.stringify(json);
  str = str.replace(/\"question\":/g, '"":');
  const returnJson = JSON.parse(str);
  return returnJson;
}
