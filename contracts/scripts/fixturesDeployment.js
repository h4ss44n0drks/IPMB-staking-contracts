const { ethers } = require("hardhat")

// Setup test environment:
const fixturesDeployment = async () => {
  const signersList = await ethers.getSigners()
  const owner = signersList[0]
  const addr1 = signersList[1]
  const addr2 = signersList[2]
  const addr3 = signersList[3]

  const ipmb = await ethers.getContractFactory(
    "IPMBToken",
  )
  const hhIPMB = await ipmb.deploy(
    "IPMB",
    "IPMB",
    200000000
  )

  const priceFeed = await ethers.getContractFactory(
    "PriceFeed",
  )
  const hhPriceFeed = await priceFeed.deploy(
    80,
    80,
    100,
    "0x4df817a31b2b68719ac77978bef933d23d0daeacaba2e1d7d501635ef3f32580",
    "0x37be355583a126f6df64b523391a3adae33d27c6323930461f04b72db0700c2b",
    100
  )

  const ipmbStaking = await ethers.getContractFactory(
    "IPMBStaking",
  )
  const hhIPMBStaking = await ipmbStaking.deploy(
    await hhIPMB.getAddress(),
    await hhPriceFeed.getAddress(),
    600
  )

  const contracts = {
    hhPriceFeed: hhPriceFeed,
    hhIPMB: hhIPMB,
    hhIPMBStaking: hhIPMBStaking
  }

  const signers = {
    owner: owner,
    addr1: addr1,
    addr2: addr2,
    addr3: addr3,
  }

  return {
    signers,
    contracts,
  }
}

module.exports = fixturesDeployment