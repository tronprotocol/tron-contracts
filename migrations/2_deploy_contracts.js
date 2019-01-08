/* global artifacts */
var OwnableMock = artifacts.require('./OwnableMock.sol')
var BaseCappedTokenMock = artifacts.require('./BaseCappedTokenMock.sol')

module.exports = function (deployer) {
  deployer.deploy(OwnableMock)
  deployer.deploy(BaseCappedTokenMock)
}
