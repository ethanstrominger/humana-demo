export { getJsonFromFile, simple2 };

function simple2() {
  return 'simple';
}

async function getJsonFromFile(fileName) {
  return await converter.fromFile(fileName);
}

async function insertJsonFromFile() {}
