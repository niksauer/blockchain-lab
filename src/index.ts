import dotenv from 'dotenv';
dotenv.config();

import { exercise1 } from './lab2/exercise1';

async function main() {
  await exercise1();
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.log(error);
  }
})();
