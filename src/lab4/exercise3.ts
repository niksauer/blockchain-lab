import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { ETH_GET_SET_CONTRACT_ADDRESS } from '../secrets';
import { assert } from '../lib/assert';

export async function exercise3(): Promise<void> {
  const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
  const web3 = new Web3(provider);

  // Get unlocked accounts
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0]; // any address can deploy contract provided that it has enough funds
  const calle = accounts[1]; // any address can interact with contract

  // Get compilation results
  // For interaction, only ABI is required
  const contractCompilation = await loadContractCompilationResult();

  // Deploy contract
  // const deployedContractAddress = await deployContract(
  //   web3,
  //   contractCompilation.abi,
  //   contractCompilation.bytecode,
  //   deployer
  // );
  // console.log(deployedContractAddress); // store in ETH_GET_SET_CONTRACT_ADDRESS env variable

  // Interact with deployed contract
  const deployedContract = new web3.eth.Contract(
    contractCompilation.abi,
    ETH_GET_SET_CONTRACT_ADDRESS
  );

  const oldValue = await deployedContract.methods.getValue().call(); // calling can not alter the smart contract state.
  // console.log(oldValue);

  const randomValue = `hello ${Math.random() * 10}`;
  const transaction = await deployedContract.methods
    .setValue(randomValue)
    .send({ from: calle });
  console.log(transaction);

  const minedBlocked = await web3.eth.getBlock(transaction['blockHash']);
  console.log(minedBlocked);

  const newValue = await deployedContract.methods.getValue().call();
  // console.log(newValue);

  assert(newValue == randomValue, 'Expected contract value to match set value');

  provider.disconnect(0, 'Finished'); // Process won't exit because websocket is kept open
}

export async function loadContractCompilationResult(): Promise<{
  abi: any;
  bytecode: string;
}> {
  // Load contract compilation result
  const source = fs.readFileSync(
    path.resolve(__dirname, '../../../bin/src/lab4/GetSetValue.json'),
    { encoding: 'utf8' }
  );
  const compiledContract = JSON.parse(source);

  // Get Application Binary Interface detailing which functions/properties exist on contract
  const abi = compiledContract['abi'];

  // Get contract's EVM bytecode
  const bytecode = `0x${compiledContract['bytecode']}`;

  return {
    abi,
    bytecode
  };
}

export async function deployContract(
  web3: Web3,
  abi: any,
  bytecode: string,
  deployerAddress: string
): Promise<string> {
  // Construct contract from ABI for subsequent deployment and future interaction
  const contract = new web3.eth.Contract(abi);
  const deployer = contract.deploy({ data: bytecode });

  // Estimate gas necessary for deployment
  const gas = await deployer.estimateGas();

  // Deploy contract
  const deployedContract = await deployer.send({
    from: deployerAddress,
    gas: gas
  });
  const contractAddress = deployedContract.options.address;

  return contractAddress;
}
