import Web3 from 'web3';
import path from 'path';
import { loadContractCompilationResult } from '../lab4/exercise3';
import {
  ETH_ERC20EXAMPLE_CONTRACT_ADDRESS,
  METAMASK_ADDRESS
} from '../secrets';

export async function exercise3(): Promise<void> {
  const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
  const web3 = new Web3(provider);

  // Get unlocked accounts
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0]; // any address can deploy contract provided that it has enough funds

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

  // Transfer 15 tokens from deployer to Metamask
  const transaction = await deployedContract.methods
    .transfer(METAMASK_ADDRESS, 15)
    .send({ from: deployer });
  // console.log(transaction);

  // Check receivers token balance
  const balance = await deployedContract.methods
    .balanceOf(METAMASK_ADDRESS)
    .call();
  console.log(`Current Metamask token balance: ${balance}`);

  provider.disconnect(0, 'Finished'); // Process won't exit because websocket is kept open
}
