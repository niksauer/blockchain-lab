import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import { assert } from '../lib/assert';
import BlockCypherAPI, {
  BlockCypherBitcoinNetwork
} from '../lib/BlockCypherAPI';
import { EXTENDED_PRIVATE_KEY, SEED_PHRASE } from '../secrets';

export async function exercise1(): Promise<void> {
  const network = bitcoin.networks.testnet;

  // const derivationPath = "m/44'/0'/0'/0/0"; // mainnet
  const derivationPath = "m/44'/1'/0'/0/1"; // testnet -> address: mnXqbqxy5G5kB71qj59WNwTBbbtucobJDk

  // const keyPair = getKeyPair(EXTENDED_PRIVATE_KEY, derivationPath, network);
  const keyPair = getKeyPairFromPhrase(SEED_PHRASE, derivationPath, network);

  const address = getAddress(keyPair, network);
  assert(address != undefined, 'Address expected');
  console.log(address);

  // const balanceResponse = await BlockCypherAPI.getBalance(
  //   address,
  //   BlockCypherBitcoinNetwork.Testnet
  // );
  // console.log(balanceResponse.balance);

  const totalInputAmount = 1000000; // 0.01 BTC
  const outputAmount = 100000; // 0.001 BTC
  const fees = 50000; // 0.0005 BTC
  const change = totalInputAmount - outputAmount - fees;

  const inputs: Input[] = [
    {
      transactionID:
        '0b75ae6548775846332a49fcd1640d2a2cf2e89a0e7c2141f5b12252ed3e1f29', // input amount: 1000000 satoshi, output must be controlled by address
      outputIndex: 1,
      signer: [keyPair]
    }
  ];
  const outputs: Output[] = [
    { address: 'mxDMMoGZuta5TfsCXyX5HU3sZm8wwBLJnk', satoshi: outputAmount },
    { address: address, satoshi: change }
  ];

  // validate: https://live.blockcypher.com/btc/decodetx/
  // broadcast: https://live.blockcypher.com/btc/pushtx/
  // broadcast API: https://www.blockcypher.com/dev/bitcoin/#push-raw-transaction-endpoint
  const signedTransaction = createTransactionDeprecated(
    network,
    inputs,
    outputs
  );
  console.log(signedTransaction);
}

function getKeyPair(
  privateKey: string,
  derivationPath: string,
  network: bitcoin.Network
): bitcoin.ECPairInterface {
  const hdMaster = bitcoin.bip32.fromBase58(privateKey, network);
  const wif = hdMaster.derivePath(derivationPath).toWIF();
  return bitcoin.ECPair.fromWIF(wif, network);
}

function getKeyPairFromPhrase(
  seedPhrase: string,
  derivationPath: string,
  network: bitcoin.Network
): bitcoin.ECPairInterface {
  const seed = bip39.mnemonicToSeedSync(seedPhrase);
  const hdMaster = bitcoin.bip32.fromSeed(seed, network);
  const wif = hdMaster.derivePath(derivationPath).toWIF();
  return bitcoin.ECPair.fromWIF(wif, network);
}

function getAddress(
  keyPair: bitcoin.ECPairInterface,
  network: bitcoin.Network
): string | undefined {
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: network
  });

  return address;
}

export interface Input {
  transactionID: string;
  outputIndex: number;
  signer: bitcoin.ECPair.Signer[];
  redeemScript?: Buffer;
}

export interface Output {
  address: string;
  satoshi: number;
}

export function createTransactionDeprecated(
  network: bitcoin.Network,
  inputs: Input[],
  outputs: Output[]
): string {
  const tx = new bitcoin.TransactionBuilder(network);

  // add inputs (must be controlled by key pair in order to be signed)
  for (const input of inputs) {
    tx.addInput(input.transactionID, input.outputIndex);
  }

  // add outputs
  for (const output of outputs) {
    tx.addOutput(output.address, output.satoshi);
  }

  // sign inputs
  for (const [index, input] of inputs.entries()) {
    for (const signer of input.signer) {
      tx.sign(index, signer, input.redeemScript);
    }
  }

  return tx.build().toHex();
}
