import dotenv from 'dotenv';
dotenv.config();

import { exercise1 as lab2Exercise1 } from './lab2/exercise1';
import { exercise2 as lab2Exercise2 } from './lab2/exercise2';

import { exercise2 as lab3Exercise2 } from './lab3/exercise2';

import { exercise2 as lab4Exercise2 } from './lab4/exercise2';
import { exercise3 as lab4Exercise3 } from './lab4/exercise3';

import { exercise1 as lab5Exercise1 } from './lab5/exercise1';
import { exercise2 as lab5Exercise2 } from './lab5/exercise2';
import { exercise3 as lab5Exercise3 } from './lab5/exercise3';

async function main() {
  // await lab2Exercise1();
  // await lab2Exercise2();
  // await lab3Exercise2();
  // await lab4Exercise2();
  // await lab4Exercise3();
  // await lab5Exercise1();
  // await lab5Exercise2();
  // await lab5Exercise3();
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.log(error);
  }
})();
