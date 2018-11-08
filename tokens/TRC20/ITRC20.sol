pragma solidity ^0.4.24;

/**
 * @title TRC20 interface (compatible with ERC20 interface)
 * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 */
interface ITRC20 {
  function totalSupply() public view returns (uint256);

  function balanceOf(address who) public view returns (uint256);

  function allowance(address owner, address spender)
    public view returns (uint256);

  function transfer(address to, uint256 value) public returns (bool);

  function approve(address spender, uint256 value)
    public returns (bool);

  function transferFrom(address from, address to, uint256 value)
    public returns (bool);

  event Transfer(
    address indexed from,
    address indexed to,
    uint256 value
  );

  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );
}
