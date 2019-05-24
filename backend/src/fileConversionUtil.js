const csvtojson = require('csvtojson');
const converter = csvtojson({ delimiter: '|' });
export { getJsonFromFile };

function standardizeFieldNamesOfJson(json) {
  let str = JSON.stringify(json);
  str = str.replace(/\"question\":/g, '"questionText":');
  const returnJson = JSON.parse(str);
  return returnJson;
}
async function getJsonFromFile(fileName) {
  const fileJson = await converter.fromFile(fileName);
  const jsonWithStandardFieldNames = standardizeFieldNamesOfJson(fileJson);
  return jsonWithStandardFieldNames;
}

async function insertJsonFromFile() {}
