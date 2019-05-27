class q {
  test(value) {
    console.log('Test 1 value', value);
    let x = {};
    x.qStringEsc = value;
    console.log('Test 2 x.qStringEsc', value);
  }

  testObj(obj) {
    console.log('Obj', obj.qStringEsc);
  }
}
let x = {};
let qString = 'Is this a question?';
let qStringEsc = qString.replace('?', '\\?');
x.qStringEsc = qStringEsc;
let x2 = { qStringEsc: qStringEsc };
console.log('qString', qStringEsc);
console.log('x', x);
console.log('x.qString', x.qStringEsc);
console.log('x2', x2);
console.log(x2.qStringEsc);
let q1 = new q();
q1.test(qStringEsc);
q1.testObj(x);
