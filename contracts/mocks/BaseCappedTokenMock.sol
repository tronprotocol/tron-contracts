pragma solidity ^0.4.23;

import "./../tokens/TRC20/TRC20Capped.sol";
import "./../tokens/TRC20/TRC20Detailed.sol";
import "./../ownership/Ownable.sol";

/**
 * @title TRC20Detailed token
 * @dev The decimals are only for visualization purposes.
 * All the operations are done using the smallest and indivisible token unit,
 * just as on TRON all the operations are done in sun.
 *
 * Example inherits from basic TRC20 implementation but can be modified to
 * extend from other ITRC20-based tokens:
 * https://github.com/OpenZeppelin/openzeppelin-solidity/issues/1536
 */
contract BaseCappedTokenMock is TRC20Detailed, TRC20Capped, Ownable  {

    string constant _name = "TOKEN_MOCK";
    string constant _symbol = "TWMCK";
    uint8 constant _decimals = 6;
    uint256 constant _totalSupply = 20000000000 * (10 ** uint256(_decimals));

    constructor()
        TRC20Detailed(_name, _symbol, _decimals)
        TRC20Capped(_totalSupply)
        public {
        _mint(msg.sender, _totalSupply);
    }
}
