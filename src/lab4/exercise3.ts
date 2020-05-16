import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { ETH_GET_SET_CONTRACT_ADDRESS } from '../secrets';
import { assert } from '../lib/assert';

export async function exercise3(): Promise<void> {
  const web3 = new Web3('ws://localhost:8545');

  // Get unlocked accounts
  const accounts = await web3.eth.getAccounts();
  const deployer = accounts[0];

  const contractCompilation = await loadContractCompilationResult();

  // Deploy contract again
  // const deployedContractAddress = await deployContract(
  //   web3,
  //   contractCompilation.abi,
  //   contractCompilation.bytecode,
  //   deployer
  // );
  // console.log(deployedContractAddress); // store in ETH_GET_SET_CONTRACT_ADDRESS env variable

  // Interact with deployed contract
  const callee = accounts[0]; // any address can interact with contract

  const deployedContract = new web3.eth.Contract(
    contractCompilation.abi,
    ETH_GET_SET_CONTRACT_ADDRESS
  );

  await deployedContract.methods.setValue('hello').call();

  const newValue = await deployedContract.methods
    .getValue()
    .call({ from: callee });

  assert(newValue == 'hello', 'Expected contract value to match set value');
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
