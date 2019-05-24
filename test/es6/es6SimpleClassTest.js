class simpleClass {
  constructor() {}
  simple() {
    return 'simple';
  }
  tiger() {
    return 'tiger';
  }
}

module.exports = simpleClass;

console.log('Here');
let x = new simpleClass();
console.log(x);
console.log(x.simple());
