/* global artifacts, contract, it, assert, before, beforeEach, tronWeb, done */
/* eslint-disable prefer-reflect */
const wait = require('../helpers/wait')
const BaseCappedTokenMock = artifacts.require('BaseCappedTokenMock.sol')
const TOKEN_NAME = 'TOKEN_MOCK'
const TOKEN_SYMBOL = 'TWMCK'
const TOKEN_UNIT = 1000000
const TOKEN_TOTAL_SUPPLY = 20000000000
const TOKEN_DECIMALS = 6
const INVALID_ADDRESS = '0x0'

contract('BaseCappedToken', (accounts) => {
  let token
  before(async () => {
    token = await BaseCappedTokenMock.deployed()
    wait(3)
    if (accounts.length < 3) {
      // Set your own accounts if you are not using Tron Quickstart
    }
  })

  it('should verifies the token symbol after construction', async function () {
    let symbol = await token.symbol()
    assert.equal(symbol, TOKEN_SYMBOL)
  })

  it('should start with the correct decimals', async function () {
    const decimals = await token.decimals()
    assert.equal(decimals, TOKEN_DECIMALS)
  })

  it('should verifies the initial total supply', async function () {
    const totalSupply = await token.totalSupply()
    assert.equal(totalSupply.toString(), TOKEN_TOTAL_SUPPLY * TOKEN_UNIT)
  })

  it('should start with the correct cap', async function () {
    const cap = await token.cap()
    const totalSupply = await token.totalSupply()
    assert.equal(cap.toString(), totalSupply.toString())
  })

  it('should verifies the token symbol after construction', async function () {
    let name = await token.call('name')
    assert.equal(name, TOKEN_NAME)
  })

  it('should verifies the balances after a transfer', async () => {
    await token.transfer(accounts[1], 500 * TOKEN_UNIT)
    wait(3)
    const balanceAcc0 = await token.balanceOf(accounts[0])
    assert.equal(balanceAcc0.toString(), 19999999500000000)

    const balanceAcc1 = await token.balanceOf(accounts[1])
    assert.equal(balanceAcc1.toString(), 500 * TOKEN_UNIT)
  })

  it('should verifies that a transfer fires a Transfer event', async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const _token = await tronWeb.contract().at(token.address)
        wait(3)
        const watcher = await _token.Transfer().watch((err, res) => {
          if (err) throw err
          if (res) {
            assert.equal(res.name, 'Transfer')
            assert.equal(res.result.from, tronWeb.address.toHex(accounts[0]))
            assert.equal(res.result.to, tronWeb.address.toHex(accounts[1]))
            assert.equal(res.result.value, 500 * TOKEN_UNIT)
            watcher.stop()
            resolve()
          }
        })

        await token.transfer(accounts[1], 500 * TOKEN_UNIT)
      } catch (e) {
        reject(e)
      }
    })
  })

  it('should verifies the allowance after an approval', async () => {
    await token.approve(accounts[1], 500 * TOKEN_UNIT)
    wait(3)
    let allowance = await token.allowance.call(accounts[0], accounts[1])
    assert.equal(allowance, 500 * TOKEN_UNIT)
  })

  it('should verifies that an approval fires an Approval event', async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const _token = await tronWeb.contract().at(token.address)
        wait(3)
        const watcher = await _token.Approval().watch((err, res) => {
          if (err) throw err
          if (res) {
            assert.equal(res.name, 'Approval')
            assert.equal(tronWeb.address.fromHex(token.address), res.contract)
            assert.equal(res.result.owner, tronWeb.address.toHex(accounts[0]))
            assert.equal(res.result.spender, tronWeb.address.toHex(accounts[1]))
            assert.equal(res.result.value, 500 * TOKEN_UNIT)
            watcher.stop()
            resolve()
          }
        })
        await token.approve(accounts[1], 500 * TOKEN_UNIT)
      } catch (e) {
        reject(e)
      }
    })
  })

  it('should verifies the balances after transferring from another account', async () => {
    await token.approve(accounts[1], 500 * TOKEN_UNIT)
    wait(3)
    await token.transferFrom(accounts[0], accounts[2], 50 * TOKEN_UNIT, { from: accounts[1] })
    wait(3)
    let balance = await token.balanceOf(accounts[0])
    assert.equal(balance.toString(), 19999998950000000)

    balance = await token.balanceOf(accounts[1])
    assert.equal(balance.toString(), 1000000000)

    balance = await token.balanceOf(accounts[2])
    assert.equal(balance.toString(), 50 * TOKEN_UNIT)
  })

  it('should verifies that transferring from another account fires a Transfer event', async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const _token = await tronWeb.contract().at(token.address)
        wait(3)
        const watcher = await _token.Transfer().watch((err, res) => {
          if (err) throw err
          if (res) {
            assert.equal(res.name, 'Transfer')
            assert.equal(res.result.from, tronWeb.address.toHex(accounts[0]))
            assert.equal(res.result.to, tronWeb.address.toHex(accounts[2]))
            assert.equal(res.result.value, 50 * TOKEN_UNIT)
            watcher.stop()
            resolve()
          }
        })

        await token.approve(accounts[1], 500 * TOKEN_UNIT)
        wait(3)
        await token.transferFrom(accounts[0], accounts[2], 50 * TOKEN_UNIT, { from: accounts[1] })
      } catch (e) {
        reject(e)
      }
    })
  })

  it('should verifies the new allowance after transferring from another account', async () => {
    await token.approve(accounts[1], 500 * TOKEN_UNIT)
    wait(3)
    await token.transferFrom(accounts[0], accounts[2], 50 * TOKEN_UNIT, { from: accounts[1] })
    wait(3)
    let allowance = await token.allowance.call(accounts[0], accounts[1])
    assert.equal(allowance, 450 * TOKEN_UNIT)
  })

  it('should throw when attempting to transfer from another account more than the allowance', async () => {
    try {
      await token.approve(accounts[1], 100 * TOKEN_UNIT)
      wait(3)
      await token.transferFrom(accounts[0], accounts[2], 200 * TOKEN_UNIT, { from: accounts[1] })
      assert(false, "didn't throw attempting to transfer from another account more than the allowance")
    } catch (error) {
      assert.equal(error.message, "didn't throw attempting to transfer from another account more than the allowance")
    }
  })

  it('should fail to mint if the ammount exceeds the cap', async function () {
    try {
      await token.mint(accounts[1], 10000, { from: accounts[1], shouldPollResponse: true })
      assert(false, "didn't throw to mint if the ammount exceeds the cap")
    } catch (error) {
      assert.equal(error, 'REVERT opcode executed')
    }
  })

  it('should throw when attempting to transfer more than the balance', async () => {
    try {
      await token.transfer(accounts[2], 50000 * TOKEN_UNIT, { from: accounts[1], shouldPollResponse: true })
      assert(false, "didn't throw when attempting to transfer more than the balance")
    } catch (error) {
      assert.equal(error, 'REVERT opcode executed')
    }
  })

  it('should throw when attempting to transfer to an invalid address', async () => {
    try {
      await token.transfer(INVALID_ADDRESS, 100000 * TOKEN_UNIT, { from: accounts[1] })
      assert(false, "didn't throw when attempting to define allowance for an invalid address")
    } catch (error) {
      assert.equal(error.reason, 'invalid address')
    }
  })

  it('should throw when attempting to transfer from an invalid account', async () => {
    try {
      await token.approve(accounts[1], 100)
      wait(3)
      await token.transferFrom(INVALID_ADDRESS, accounts[2], 50, { from: accounts[1] })
      assert(false, "didn't throw when attempting to transfer from an invalid account")
    } catch (error) {
      assert.equal(error.reason, 'invalid address')
    }
  })

  it('should throw when attempting to transfer from to an invalid account', async () => {
    try {
      await token.approve(accounts[1], 100)
      wait(3)
      await token.transferFrom(accounts[0], INVALID_ADDRESS, 50, { from: accounts[1] })
      assert(false, "didn't throw when attempting to transfer from to an invalid account")
    } catch (error) {
      assert.equal(error.reason, 'invalid address')
    }
  })

  it('should throw when attempting to define allowance for an invalid address', async () => {
    try {
      await token.approve(INVALID_ADDRESS, 10, { shouldPollResponse: true })
      assert(false, "didn't throw when attempting to define allowance for an invalid address")
    } catch (error) {
      assert.equal(error.reason, 'invalid address')
    }
  })

  it('should have an owner', async () => {
    const owner = await token.owner()
    assert.equal(accounts[0], tronWeb.address.fromHex(owner))
  })

  it('should change owner after transfer', async function () {
    return new Promise(async (resolve, reject) => {
      try {
        const isOwner = await token.isOwner({ from: accounts[3] })
        assert.equal(isOwner, false)

        const _token = await tronWeb.contract().at(token.address)
        wait(3)
        const watcher = await _token.OwnershipTransferred().watch(async (err, res) => {
          if (err) throw err
          if (res) {
            assert.equal(res.name, 'OwnershipTransferred')
            assert.equal(tronWeb.address.toHex(res.contract), token.address)
            assert.equal(res.result.previousOwner, tronWeb.address.toHex(accounts[0]))
            assert.equal(res.result.newOwner, tronWeb.address.toHex(accounts[3]))

            watcher.stop()
            resolve()
          }
        })

        await token.transferOwnership(accounts[3], { from: accounts[0] })
        wait(3)
        const isNewOwner = await token.isOwner({ from: accounts[3] })
        assert.equal(isNewOwner, true)
      } catch (e) {
        reject(e)
      }
    })
  })

  it('should prevent non-owners from transfering', async function () {
    try {
      await token.transferOwnership(accounts[4], { from: accounts[5], shouldPollResponse: true })
      assert(false, "didn't throw should prevent non-owners from transferin")
    } catch (error) {
      assert.equal(error, 'REVERT opcode executed')
    }
  })

  it('should guard ownership against stuck state', async function () {
    try {
      await token.transferOwnership(null, { from: accounts[0] })
      assert(false, "didn't throw should guard ownership against stuck state")
    } catch (error) {
      assert.equal(error.reason, 'invalid address')
    }
  })

  it('should loses owner after renouncement', async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const isOwner = await token.isOwner({ from: accounts[9] })
        assert.equal(isOwner, false)

        const isOwner2 = await token.isOwner({ from: accounts[3] })
        assert.equal(isOwner2, true)

        const _token = await tronWeb.contract().at(token.address)
        wait(3)
        const watcher = await _token.OwnershipTransferred().watch(async (err, res) => {
          if (err) throw err
          if (res) {
            assert.equal(res.name, 'OwnershipTransferred')
            assert.equal(tronWeb.address.toHex(res.contract), token.address)
            assert.equal(tronWeb.address.toHex(res.result.previousOwner), tronWeb.address.toHex(accounts[3]))
            assert.equal(res.result.newOwner, '410000000000000000000000000000000000000000')

            watcher.stop()
            resolve()
          }
        })

        await token.renounceOwnership({ from: accounts[3] })
        wait(3)
        const isOwner3 = await token.isOwner({ from: accounts[3] })
        assert.equal(isOwner3, false)
      } catch (e) {
        reject(e)
      }
    })
  })

  it('should prevent non-owners from renouncement', async () => {
    try {
      await token.renounceOwnership({ from: accounts[5], shouldPollResponse: true })
      assert(false, "didn't throw should prevent non-owners from renouncement")
    } catch (error) {
      assert.equal(error, 'REVERT opcode executed')
    }
  })
})
