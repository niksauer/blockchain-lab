import Web3 from 'web3';
import {
  loadContractCompilationResult,
  deployContract
} from '../lab4/exercise3';
import path from 'path';

export async function exercise1(): Promise<void> {
  const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
  const web3 = new Web3(provider);

  // Get unlocked accounts
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0]; // any address can deploy contract provided that it has enough funds

  // Get compilation results with helper function from lab 4
  const compiledContract = await loadContractCompilationResult(
    path.resolve(__dirname, `../../../bin/src/lab5/ERC20Example.json`)
  );

  // Deploy contract
  const deployedContractAddress = await deployContract(
    web3,
    compiledContract.abi,
    compiledContract.bytecode,
    deployer,
    100
  );
  console.log(deployedContractAddress); // store in ETH_ERC20EXAMPLE_CONTRACT_ADDRESS env variable

  provider.disconnect(0, 'Finished'); // Process won't exit because websocket is kept open
}
