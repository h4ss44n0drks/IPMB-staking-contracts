# Intro

This repo provides information regards to the Price Feed and Staking smart contracts.


## On Amoy Testnet

Deployed version: v2.0

*IPMB Token (IPMBT):* [0xFF22c94FFb6bB5d1DF18bEb5fd1dFE7583D3B214](https://www.oklink.com/amoy/address/0xff22c94ffb6bb5d1df18beb5fd1dfe7583d3b214)

*Price Feed Contract:* [0xB5ac609cffCE8aFC520c813D2984cAE4D2e4859f](https://www.oklink.com/amoy/address/0xB5ac609cffCE8aFC520c813D2984cAE4D2e4859f)

*IPMB Staking Contract:* [0xecc9fc8e77f1c992d9db568761a69af453337950](https://www.oklink.com/amoy/address/0xecc9fc8e77f1c992d9db568761a69af453337950)

## Tests

1. Download the github repo
2. Open command prompt and navigate to the [contracts & tests](https://github.com/IpmbOfficial/IPMB-staking-contracts/tree/main/contracts-tests)
3. Install hardhat using `npm i`
4. Compile smart contracts using `npx hardhat compile`
  - If you get `Error HH502` then please upgrade to the laetst hardhat - `npm up hardhat`
5. Run the tests that exist within the test folder using `npx hardhat test`
