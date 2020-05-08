import dotenv from 'dotenv';
dotenv.config();

// import { exercise1 } from './lab2/exercise1';
// import { exercise2 } from './lab2/exercise2';

import { exercise2 } from './lab3/exercise2';

async function main() {
  // await exercise1();
  // await exercise2();

  await exercise2();
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.log(error);
  }
})();
