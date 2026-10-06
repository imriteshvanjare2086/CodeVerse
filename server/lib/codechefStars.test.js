import test from 'node:test';
import assert from 'node:assert/strict';
import { codechefStars } from './codechefStars.js';

test('CodeChef stars respect rating boundaries and unknown ratings', () => {
  for (const [rating, stars] of [[0,0], [null,0], ['bad',0], [1399,1], [1400,2], [1454,2], [1599,2], [1600,3], [1800,4], [2000,5], [2200,6], [2500,7]]) {
    assert.equal(codechefStars(rating), `${stars}★`);
  }
});
