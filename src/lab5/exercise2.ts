import Web3 from 'web3';
import path from 'path';
import { loadContractCompilationResult } from '../lab4/exercise3';
import { ETH_ERC20EXAMPLE_CONTRACT_ADDRESS } from '../secrets';
import { assert } from '../lib/assert';

export async function exercise2(): Promise<void> {
  const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
  const web3 = new Web3(provider);

  // Get unlocked accounts
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0]; // any address can deploy contract provided that it has enough funds
  const receiver = accounts[1]; // any address can interact with contract

  // Get compilation results
  // For interaction, only ABI is required
  const contractCompilation = await loadContractCompilationResult(
    path.resolve(__dirname, `../../../bin/src/lab5/ERC20Example.json`)
  );

  // Interact with deployed contract
  const deployedContract = new web3.eth.Contract(
    contractCompilation.abi,
    ETH_ERC20EXAMPLE_CONTRACT_ADDRESS
  );
  console.log(deployedContract.options.address);

  // Check deployers token balance
  const deployerBalance = await deployedContract.methods
    .balanceOf(deployer)
    .call();
  console.log(`Current deployer token balance: ${deployerBalance}`);

  // Check receivers token balance
  const oldReceiverBalance = await deployedContract.methods
    .balanceOf(receiver)
    .call();
  console.log(`Current receiver token balance: ${oldReceiverBalance}`);

  // Transfer 10 tokens from deployer to receiver
  const transaction = await deployedContract.methods
    .transfer(receiver, 10)
    .send({ from: deployer });
  //   console.log(transaction);

  // Check receivers token balance
  const newReceiverBalance = await deployedContract.methods
    .balanceOf(receiver)
    .call();
  console.log(`New receiver token balance: ${newReceiverBalance}`);

  assert(
    newReceiverBalance > oldReceiverBalance,
    'Expected receiver balance to have increased'
  );

  provider.disconnect(0, 'Finished'); // Process won't exit because websocket is kept open
}
