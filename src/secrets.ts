import { assert } from 'console';

const EXTENDED_PRIVATE_KEY = process.env.EXTENDED_PRIVATE_KEY!;
const SEED_PHRASE = process.env.SEED_PHRASE!;

const MULTISIG_WIF_1 = process.env.MULTISIG_WIF_1!;
const MULTISIG_WIF_2 = process.env.MULTISIG_WIF_2!;

const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY!;
const ETH_GET_SET_CONTRACT_ADDRESS = process.env.ETH_GET_SET_CONTRACT_ADDRESS!;

assert(EXTENDED_PRIVATE_KEY != undefined, 'EXTENDED_PRIVATE_KEY env required');
assert(SEED_PHRASE != undefined, 'SEED_PHRASE env required');

assert(MULTISIG_WIF_1 != undefined, 'MULTISIG_WIF_1 env required');
assert(MULTISIG_WIF_2 != undefined, 'MULTISIG_WIF_2 env required');

assert(ETH_PRIVATE_KEY != undefined, 'ETH_PRIVATE_KEY env required');
assert(
  ETH_GET_SET_CONTRACT_ADDRESS != undefined,
  'ETH_GET_SET_CONTRACT_ADDRESS env required'
);

export {
  EXTENDED_PRIVATE_KEY,
  SEED_PHRASE,
  MULTISIG_WIF_1,
  MULTISIG_WIF_2,
  ETH_PRIVATE_KEY,
  ETH_GET_SET_CONTRACT_ADDRESS
};
