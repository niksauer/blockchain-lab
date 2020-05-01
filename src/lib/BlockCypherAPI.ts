import axios from 'axios';

export enum BlockCypherBitcoinNetwork {
  Main = 'main',
  Testnet = 'test3'
}

interface Balance {
  address: string;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
}

// MARK: - Initialization
const instance = axios.create({
  baseURL: 'https://api.blockcypher.com/v1/btc/'
});

// MARK: - Routes
// MARK: Balance
// https://www.blockcypher.com/dev/bitcoin/#blockcypher-supported-language-sdks
// https://api.blockcypher.com/v1/btc/main/addrs/1Q6wt3CKqiMvZKevRJ3CqKxM4h2MzhLPo5/balance
async function getBalance(
  address: string,
  network: BlockCypherBitcoinNetwork
): Promise<Balance> {
  const response = await instance.get(`/${network}/addrs/${address}/balance`);

  return response.data;
}

export default {
  getBalance
};
