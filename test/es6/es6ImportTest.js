import { simpleFunc } from '../../test_functions/es6SimpleFunction';
import simpleClass from '../../test_functions/es6SimpleClass';
import assert from 'assert';

describe('Simple function', function() {
  it('Simple test that es6 import syntax works', function() {
    simpleFunc();
    assert(true);
  });

  it('Simple test that es6 class syntax works', function() {
    let x = new simpleClass();
    assert(true);
  });
});
