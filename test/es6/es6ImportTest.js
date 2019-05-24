// TODO: Pretty this up
import { simpleFunc } from './es6SimpleFunction';
import QuestionTransaction from '../../backend/src/demoQuestionTransactionClass';
// import { simpleClass } from './es6SimpleClassTest';
// class simpleClass {
//   constructor() {}
//   simple() {
//     return 'simple';
//   }
//   tiger() {
//     return 'tiger';
//   }
// }

// let x = new simpleClass();
// let y = x.tiger();
describe('Simple function', function() {
  it('********* Simple test of import function', function() {
    const helloNow = QuestionTransaction.hello();
    console.log(simpleFunc(), 'xxx', helloNow);
  });

  it('Simple test of a class', function() {
    // let x = new simpleClass();
    // console.log(x.tiger());
  });
});
