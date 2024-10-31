# Intro

This repo provides information regards to the Price Feed and Staking smart contracts.


## On Amoy Testnet

Deployed version: v2.2

*IPMB Token (IPMBT):* [0xFF22c94FFb6bB5d1DF18bEb5fd1dFE7583D3B214](https://www.oklink.com/amoy/address/0xFF22c94FFb6bB5d1DF18bEb5fd1dFE7583D3B214)

*Price Feed Contract:* [0xB2F7243b6C5f3A3660941BB77bf82D274E664587](https://www.oklink.com/amoy/address/0xB2F7243b6C5f3A3660941BB77bf82D274E664587)

*IPMB Staking Contract:* [0xE7447a5e122df20E2AcdC472CD973905867E48eb](https://www.oklink.com/amoy/address/0xE7447a5e122df20E2AcdC472CD973905867E48eb)

## Tests

1. Download the github repo
2. Open command prompt and navigate to the [contracts & tests](https://github.com/IpmbOfficial/IPMB-staking-contracts/tree/main/contracts-tests)
3. Install hardhat using `npm i`
4. Compile smart contracts using `npx hardhat compile`
  - If you get `Error HH502` then please upgrade to the laetst hardhat - `npm up hardhat`
5. Run the tests that exist within the test folder using `npx hardhat test`
