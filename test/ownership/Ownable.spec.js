/* global artifacts, contract, it, assert, before, beforeEach, describe, tronWeb, done */
/* eslint-disable prefer-reflect */
const wait = require('./../helpers/wait')
const OwnableMock = artifacts.require('OwnableMock.sol')

contract('Ownable', (accounts) => {
  let token
  before(async () => {
    token = await OwnableMock.deployed()
    wait(3)
    if (accounts.length < 3) {
      // Set your own accounts if you are not using Tron Quickstart
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

  it('should lose owner after renouncement', async function () {
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

        const owner = await token.owner()
        assert.equal(owner, '410000000000000000000000000000000000000000')
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
