# Exercise 1

See https://bitcoincore.org/en/doc/0.19.0/rpc/wallet/getreceivedbyaddress/

```shell
# generate new address to receive coins
$ docker-compose exec --user bitcoin bitcoind bitcoin-cli -rpcuser=bitcoin -rpcpassword=verysecure -testnet getnewaddress
2N7mrc8mGVXxAg6ViWZVR1ewcFgSB8ogVWv

# fund via faucet -> https://live.blockcypher.com/btc-testnet/tx/170c183060733aaeb630453c1f4f23fe066117f0c15abe2227e0d6573d3725c3/

# get balance by address
$ docker-compose exec --user bitcoin bitcoind bitcoin-cli -rpcuser=bitcoin -rpcpassword=verysecure -testnet getreceivedbyaddress 2N7mrc8mGVXxAg6ViWZVR1ewcFgSB8ogVWv
0.00000000
```

# Exercise 3

See https://stackoverflow.com/questions/38493893/heres-how-to-send-raw-transaction-btc-using-bitcoin-cli-command

```shell
# bitcoin-cli createrawtransaction
#    '[{
#        "txid" : "<txid_of_selected_block>",
#        "vout" : <vout>
#    }]'
#    '{"<recipient_address>": <amount_to_send>, "<sender_address>": <amount_change>}'

$ docker-compose exec --user bitcoin bitcoind bitcoin-cli -rpcuser=bitcoin -rpcpassword=verysecure -testnet createrawtransaction '[{ "txid": "170c183060733aaeb630453c1f4f23fe066117f0c15abe2227e0d6573d3725c3", "vout": 0 }]' '{ "mnXqbqxy5G5kB71qj59WNwTBbbtucobJDk": 0.001, "2N7mrc8mGVXxAg6ViWZVR1ewcFgSB8ogVWv": 0.005}'

0200000001c325373d57d6e02722be5ac1f0176106fe234f1f3c4530b6ae3a736030180c170000000000ffffffff02a0860100000000001976a9144cf3b58df8f75848de48e00f84b0dffda199e7bc88ac20a107000000000017a9149f5cce9d771fabc825e2b725055bac64d32ed64b8700000000

$ docker-compose exec --user bitcoin bitcoind bitcoin-cli -rpcuser=bitcoin -rpcpassword=verysecure -testnet signrawtransactionwithwallet 0200000001c325373d57d6e02722be5ac1f0176106fe234f1f3c4530b6ae3a736030180c170000000000ffffffff02a0860100000000001976a9144cf3b58df8f75848de48e00f84b0dffda199e7bc88ac20a107000000000017a9149f5cce9d771fabc825e2b725055bac64d32ed64b8700000000

<signed transaction hex>

$ docker-compose exec --user bitcoin bitcoind bitcoin-cli -rpcuser=bitcoin -rpcpassword=verysecure -testnet sendrawtransaction <signed transaction hex>

<txid>
```
