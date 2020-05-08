import BitcoinJsonRpc from 'bitcoin-json-rpc';

export async function exercise2(): Promise<void> {
  const client = new BitcoinJsonRpc(
    'http://bitcoin:verysecure@localhost:18332/'
  );
  // const balance = await client.getBalance();
  // console.log(balance);

  const unspentTransactions = await client.listUnspent();
  const unspentBalance = unspentTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );
  console.log(unspentBalance);
}
