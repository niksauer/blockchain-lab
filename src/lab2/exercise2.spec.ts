import dotenv from 'dotenv';
dotenv.config();

import test from 'ava';
import { exercise2 } from './exercise2';

test('exercise2', t => {
  t.notThrows(exercise2);
});
