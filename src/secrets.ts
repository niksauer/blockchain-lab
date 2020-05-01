import { assert } from 'console';

const EXTENDED_PRIVATE_KEY = process.env.EXTENDED_PRIVATE_KEY!;
const SEED_PHRASE = process.env.SEED_PHRASE!;

assert(EXTENDED_PRIVATE_KEY != undefined, 'EXTENDED_PRIVATE_KEY env required');
assert(SEED_PHRASE != undefined, 'SEED_PHRASE env required');

export { EXTENDED_PRIVATE_KEY, SEED_PHRASE };
