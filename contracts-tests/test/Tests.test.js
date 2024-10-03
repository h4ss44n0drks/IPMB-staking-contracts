const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai")
const { ethers } = require("hardhat")
const fixturesDeployment = require("../scripts/fixturesDeployment.js")

let signers
let contracts

describe("IPMB Staking tests", function () {
  before(async function () {
    ;({ signers, contracts } = await loadFixture(fixturesDeployment))
  })

  context("Verify Fixture", () => {
    it("Contracts are deployed", async function () {
      expect(await contracts.hhPriceFeed.getAddress()).to.not.equal(
        ethers.ZeroAddress,
      )
      expect(await contracts.hhIPMB.getAddress()).to.not.equal(
        ethers.ZeroAddress,
      )
      expect(await contracts.hhIPMBStaking.getAddress()).to.not.equal(
        ethers.ZeroAddress,
      )
    })
  })

  context("Register Pool", () => {
    
    // register a pool
    it("#registerPool", async function () {
      await contracts.hhIPMBStaking.registerPool(
        "Gem1-3M-2%", // _poolName
        600, // _duration
        2,// _discount
        BigInt(1000000000000000000), // _amount 1 IPMB
        300, // _lockDuration
        3, // _poolMax
      )
    })

    // check the status of a ppol
    it("#checkPoolStatus", async function () {
      const status = await contracts.hhIPMBStaking.poolStatus(
        1
      )
      expect(status).equal(true); 
    })
    
  }) // end of register context

  context("Add KYC, Approve and Deposit", () => {

    // add Address to KYC
    it("#addKYC", async function () {
      await contracts.hhIPMBStaking.updateKYCAddress(
        signers.owner.address,
        true
      )
    })

    // approve tokens
    it("#approveTokens", async function () {
      await contracts.hhIPMB.approve(
        contracts.hhIPMBStaking,
        BigInt(100000000000000000000) // 100 IPMB
      )
    })

    // deposit to pool
    it("#depositPool", async function () {
      await contracts.hhIPMBStaking.depositPool(
        1
      )
    })
    
  }) // end of deposit context

  context("Check Deposit", () => {

    it("#poolAmount", async function () {
      const amount = await contracts.hhIPMBStaking.poolAmountPerAddress(
        1, // _poolId
        signers.owner.address, // _address
        0 // _index
      )
      expect(amount).equal(BigInt(1000000000000000000)); //
    })
    
  }) // end check deposit

  context("Check Lockdown Period", () => {

    it("#lockDown", async function () {
      expect(contracts.hhIPMBStaking.withdrawalPool(
        1, // _poolId
        0 // _index
      )).to.be.revertedWith("Time has not passed"); //
    })
    
  }) // end lockdown check

  context("Check Discount", () => {

    it("#discount", async function () {
      await time.increase(605);
      expect(await contracts.hhIPMBStaking.getDiscount(
        1, // _poolId
        signers.owner.address, // _address
        0, // _index
      )).to.equal(2);
    })
    
  }) // end check discount

  context("Deposits and Withdrawal", () => {

    it("#depositPool", async function () {
      await contracts.hhIPMBStaking.depositPool(
        1
      )
    })

    it("#depositPool", async function () {
      await contracts.hhIPMBStaking.depositPool(
        1
      )
    })

    it("#poolAmount", async function () {
      const amount = await contracts.hhIPMBStaking.poolAmountPerAddress(
        1, // _poolId
        signers.owner.address, // _address
        1 // _index
      )
      expect(amount).equal(BigInt(1000000000000000000)); //
    })

    it("#withdrawalPool", async function () {
      await time.increase(310);
      await contracts.hhIPMBStaking.withdrawalPool(
        1, // _poolId
        1, // _index
      )
    })
    
  }) // end deposits and withdrawl

  context("Check Blacklist", () => {

    it("#blackListWallet", async function () {
      await contracts.hhIPMBStaking.addBlacklist(
        signers.owner.address, // _address
        1, // _status
      )
    })

    it("#depositBlocked", async function () {
      expect(contracts.hhIPMBStaking.depositPool(
        1, // _poolId
      )).to.be.revertedWith("Address is blacklisted"); //
    })

    it("#withdrawalBlocked", async function () {
      expect(contracts.hhIPMBStaking.withdrawalPool(
        1, // _poolId
        0 // _index
      )).to.be.revertedWith("Address is blacklisted"); //
    })
    
  }) // end blacklist check

  context("Blacklist Withdrawal", () => {

    it("#blacklistAddressWithdrawalPool", async function () {
      await time.increase(610);
      await contracts.hhIPMBStaking.blacklistAddressWithdrawalPool(
        signers.addr1.address, // _receiver
        signers.owner.address, // _address
        1, // _poolID
        0, // _index
      )
    })

    it("#blacklistAddressWithdrawalPool", async function () {
      await time.increase(610);
      await contracts.hhIPMBStaking.blacklistAddressWithdrawalPool(
        signers.addr1.address, // _receiver
        signers.owner.address, // _address
        1, // _poolID
        2, // _index
      )
    })

    it("#receiverBalance", async function () {
      const balance = await contracts.hhIPMB.balanceOf(signers.addr1.address)
      expect(balance).to.equal(BigInt(2000000000000000000)); // if other fails
    })

  }) // end blacklist check

  context("Transfer Tokens and Add KYC to Address 2", () => {

    it("#transferTokens", async function () {
      await contracts.hhIPMB.transfer(
        signers.addr2.address, // _receiver
        BigInt(10000000000000000000), // _amount
      )
    })

    it("#receiverBalance", async function () {
      const balance = await contracts.hhIPMB.balanceOf(signers.addr2.address)
      expect(balance).to.equal(BigInt(10000000000000000000)); // if other fails
    })

    // approve tokens
    it("#approveTokens", async function () {
      await contracts.hhIPMB.connect(signers.addr2).approve(
        contracts.hhIPMBStaking,
        BigInt(10000000000000000000) // 10 IPMB
      )
    })

    it("#addKYC", async function () {
      await contracts.hhIPMBStaking.updateKYCAddress(
        signers.addr2.address,
        true
      )
    })

  }) // end transfer

  context("Change Epoch", () => {

    it("#addEpoch", async function () {
      await time.increase(110);
      await contracts.hhPriceFeed.setData(
        100, // _ipmb
        100, // _gold
        "0xb047e579b8b1137f701bc06244910b003606bdf93dad956463dca8822d854ebf", // _datasethash
      )
    })

  }) // end new epoch

  context("Deposit As Address 2", () => {

    // deposit to pool
    it("#depositPool", async function () {
      await contracts.hhIPMBStaking.connect(signers.addr2).depositPool(
        1
      )
    })

    it("#checkDepositEpoch", async function () {
      const epoch = await contracts.hhIPMBStaking.poolEpochPerAddress(
        1, // _poolID
        signers.addr2.address, // _address
        0, // _index
      )
      expect(epoch).to.equal(1); // if other fails
    })

  }) // end deposit

  context("Discount For Address 2", () => {

    it("#discount", async function () {
      await time.increase(605);
      expect(await contracts.hhIPMBStaking.getDiscount(
        1, // _poolId
        signers.addr2.address, // _address
        0, // _index
      )).to.equal(2);
    })

  }) // end check discount

  context("Add New Pool", () => {

    // register a pool
    it("#registerPool", async function () {
      await contracts.hhIPMBStaking.registerPool(
        "Gem2.5-12M-11%", // _poolName
        1200, // _duration
        11,// _discount
        BigInt(2500000000000000000), // _amount 1 IPMB
        600, // _lockDuration
        2, // _poolMax
      )
    })

  }) // end register pool

  context("Deposit as Address 2 and Check", () => {

    // deposit to pool
    it("#depositPool", async function () {
      await contracts.hhIPMBStaking.connect(signers.addr2).depositPool(
        2
      )
    })

    it("#checkDepositEpoch", async function () {
      const epoch = await contracts.hhIPMBStaking.poolAmountPerAddress(
        2, // _poolID
        signers.addr2.address, // _address
        0, // _index
      )
      expect(epoch).to.equal(BigInt(2500000000000000000)); // if other fails
    })

  }) // end deposit

  context("Discount For Address 2 for Pool 2", () => {

    it("#discount", async function () {
      await time.increase(1250);
      expect(await contracts.hhIPMBStaking.getDiscount(
        2, // _poolId
        signers.addr2.address, // _address
        0, // _index
      )).to.equal(11);
    })

  }) // end check discount

  context("Check Pool Max as Address 2", () => {

    // deposit to pool
    it("#depositPool", async function () {
      await contracts.hhIPMBStaking.connect(signers.addr2).depositPool(
        2
      )
    })

    // reverted as pool max reached
    it("#poolMaxdeposit", async function () {
      expect(contracts.hhIPMBStaking.connect(signers.addr2).depositPool(
        2
      )).to.be.revertedWith("Already deposited max times");
    })
  
  }) // end pool max

  context("Withdrawal as Address 2 and reDeposit", () => {

    it("#withdrawalPool", async function () {
      await time.increase(610);
      await contracts.hhIPMBStaking.connect(signers.addr2).withdrawalPool(
        2, // _poolId
        1, // _index
      )
    })

    // deposit to pool
    it("#depositPool", async function () {
      await contracts.hhIPMBStaking.connect(signers.addr2).depositPool(
        2
      )
    })

    it("#checkDepositEpoch", async function () {
      const epoch = await contracts.hhIPMBStaking.poolAmountPerAddress(
        2, // _poolID
        signers.addr2.address, // _address
        2, // _index
      )
      expect(epoch).to.equal(BigInt(2500000000000000000)); // if other fails
    })

  }) // end withdrawal and deposit

  context("Discount For Address 2 for Pool 2 for new deposit", () => {

    it("#discount", async function () {
      await time.increase(1250);
      expect(await contracts.hhIPMBStaking.getDiscount(
        2, // _poolId
        signers.addr2.address, // _address
        2, // _index
      )).to.equal(11);
    })

  }) // end check discount

})