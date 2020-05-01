import * as bitcoin from 'bitcoinjs-lib';
import { MULTISIG_WIF_1, MULTISIG_WIF_2 } from '../secrets';
import { Output, Input, createTransactionDeprecated } from './exercise1';
import { assert } from '../lib/assert';

export async function exercise2(): Promise<void> {
  const network = bitcoin.networks.testnet;

  // generate keys and output wif -> should be stored in env
  //   const keyPairs = [generateKeyPair(network), generateKeyPair(network)];

  //   for (const keyPair of keyPairs) {
  //     console.log(keyPair.toWIF());
  //   }

  // import keys from wifs that have been output above and stored in env afterwards
  const keyPairs = [
    bitcoin.ECPair.fromWIF(MULTISIG_WIF_1, network),
    bitcoin.ECPair.fromWIF(MULTISIG_WIF_2, network)
  ];
  const publicKeys = keyPairs.map(keyPair => keyPair.publicKey);
  //   console.log(publicKeys);

  // generate a P2SH, pay-to-multisig (n-of-n) address -> 2N4njnSytEp64LoWY79VxknR42zViWyWYcy
  const {
    address: multiSigAddress,
    redeemScript
  } = generateMultisignatureAddress(keyPairs.length, publicKeys, network);
  assert(multiSigAddress != undefined, 'Multisignature address expected');
  console.log(multiSigAddress);

  // https://testnet-faucet.mempool.co
  // use faucet to get initial funds -> txID: c5c305a1a9714fd1f5b7c4ccd6f3cb555c59687a86f023a4c3c764965499cc42

  const totalInputAmount = 100000; // 0.001 BTC
  const outputAmount = 50000; // 0.0005 BTC
  const fees = 20000; // 0.0002 BTC
  const change = totalInputAmount - outputAmount - fees;

  const inputs: Input[] = [
    {
      transactionID:
        'c5c305a1a9714fd1f5b7c4ccd6f3cb555c59687a86f023a4c3c764965499cc42', // input amount: 1,000,000 satoshi, output must be controlled by multisig signers
      outputIndex: 0,
      signer: keyPairs,
      redeemScript: redeemScript
    }
  ];

  const outputs: Output[] = [
    { address: 'mnXqbqxy5G5kB71qj59WNwTBbbtucobJDk', satoshi: outputAmount },
    { address: multiSigAddress, satoshi: change }
  ];

  // const signedTransaction = createTransaction(network, inputs, outputs);
  const signedTransaction = createTransactionDeprecated(
    network,
    inputs,
    outputs
  );
  console.log(signedTransaction);
}

function generateKeyPair(network: bitcoin.Network): bitcoin.ECPairInterface {
  return bitcoin.ECPair.makeRandom({ network: network });
}

function generateMultisignatureAddress(
  requiredSignatures: number,
  publicKeys: Buffer[],
  network: bitcoin.Network
): { address: string | undefined; redeemScript?: Buffer } {
  const { address, redeem } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2ms({
      m: requiredSignatures,
      pubkeys: publicKeys,
      network: network
    })
  });

  return { address, redeemScript: redeem?.output };
}

export function createTransaction(
  network: bitcoin.Network,
  inputs: Input[],
  outputs: Output[]
): string {
  const psbt = new bitcoin.Psbt({ network: network });

  // add inputs (must be controlled by key pair in order to be signed)
  for (const input of inputs) {
    psbt.addInput({
      hash: input.transactionID,
      index: input.outputIndex,
      redeemScript: input.redeemScript
    });
  }

  // add outputs
  for (const output of outputs) {
    psbt.addOutput({ address: output.address, value: output.satoshi });
  }

  // sign inputs
  for (const [index, input] of inputs.entries()) {
    for (const signer of input.signer) {
      psbt.signInput(index, signer);
    }
  }

  return psbt.toHex();
}
