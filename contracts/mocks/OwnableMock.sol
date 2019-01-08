
pragma solidity ^0.4.23;

import "./../tokens/TRC20/TRC20.sol";
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
contract OwnableMock is TRC20, Ownable  {

    constructor()
        TRC20()
        public {
    }
}
