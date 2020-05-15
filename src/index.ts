import dotenv from 'dotenv';
dotenv.config();

import { exercise1 as lab2Exercise1 } from './lab2/exercise1';
import { exercise2 as lab2Exercise2 } from './lab2/exercise2';

import { exercise2 as lab3Exercise2 } from './lab3/exercise2';

import { exercise2 as lab4Exercise2 } from './lab4/exercise2';

async function main() {
  // await lab2Exercise1();
  // await lab2Exercise2();

  // await lab3Exercise2();

  await lab4Exercise2();
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.log(error);
  }
})();
