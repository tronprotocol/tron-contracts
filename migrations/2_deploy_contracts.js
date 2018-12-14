var TRC20 = artifacts.require("./TRC20.sol");
var TRC20Detailed = artifacts.require("./TRC20Detailed.sol");
var TRC20Mintable = artifacts.require("./TRC20Mintable.sol");
var TRC20Burnable = artifacts.require("./TRC20Burnable.sol");

module.exports = function (deployer) {
    deployer.deploy(TRC20, 10000);
    deployer.deploy(TRC20Detailed, "TOKEN", "SYM", 18);
    deployer.deploy(TRC20Mintable, 10000);
    deployer.deploy(TRC20Burnable, 10000);
};
