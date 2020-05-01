import dotenv from 'dotenv';
dotenv.config();

import test from 'ava';
import { exercise1 } from './exercise1';

test('exercise1', t => {
  t.notThrows(exercise1);
});
