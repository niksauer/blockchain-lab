import Web3 from 'web3';
import { ETH_PRIVATE_KEY } from '../secrets';
import { assert } from '../lib/assert';

export async function exercise2(): Promise<void> {
  const web3 = new Web3('ws://localhost:8545');

  // get pre-funded, unlocked accounts (Ganache-only)
  // funding amount configured in docker-compose config
  const unlockedAccounts = await web3.eth.getAccounts();
  assert(unlockedAccounts.length == 10, '10 unlocked accounts expected'); // should match docker-compose config

  // create new account
  //   const account = web3.eth.accounts.create();
  //   console.log(account.address);
  //   console.log(account.privateKey); // store in ETH_PRIVATE_KEY env variable

  // load previously created account
  const account = web3.eth.accounts.privateKeyToAccount(ETH_PRIVATE_KEY);
  console.log(account.address);

  // check balance before funding
  const oldBalance = await web3.eth.getBalance(account.address);

  // fund account with pre-funded, unlocked account
  const fundAmount = web3.utils.toWei('1', 'ether');

  await web3.eth.sendTransaction({
    from: unlockedAccounts[0],
    to: account.address,
    value: web3.utils.toWei('1', 'ether')
  });

  // check balance after funding
  const newBalance = await web3.eth.getBalance(account.address);
  assert(newBalance > oldBalance, 'Expected balance to increase');

  // create new transaction that previously received amount into void
  // all account objects have signTransaction method attached
  const signedTransaction = await account.signTransaction({
    to: '0x0000000000000000000000000000000000000000',
    value: fundAmount,
    gas: 21000 // default used for sending only ether
  });
  assert(
    signedTransaction.rawTransaction != undefined,
    'Raw transaction expected'
  );
  assert(
    signedTransaction.transactionHash != undefined,
    'Transaction hash expected'
  );

  const transactionResult = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );

  if (transactionResult instanceof Error) {
    console.log('Failed to send signed transaction', transactionResult);
  } else {
    const minedBlock = await web3.eth.getBlock(transactionResult.blockHash);
    assert(
      minedBlock.transactions.includes(signedTransaction.transactionHash),
      'Transaction was not included in block'
    );
    console.log(minedBlock);
  }
}
