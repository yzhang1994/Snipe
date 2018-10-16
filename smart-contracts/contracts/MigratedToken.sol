pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract MigratedToken is StandardToken, Ownable {
  using SafeMath for uint;

  // Constants set at contract inception
  string                  public name;
  string                  public symbol;
  uint                    public decimals;
  address                 public owner;
  address                 public parentTokenAddress;

  // Events
  event LogPastApproval(
    address indexed owner,
    address indexed spender,
    uint256 value,
    uint256 timestamp
  );
  event LogPastTransfer(address indexed from, address indexed to, uint256 value, uint256 timestamp);

  /// @dev Migrated Token constructor
  /// @param  _name                                Token name
  /// @param  _symbol                              Token symbol
  constructor (
    string    _name,
    string    _symbol,
    uint      _decimals,
    uint      _supply,
    address   _parentTokenAddress
  ) public {
    name = _name;
    symbol = _symbol;
    owner = msg.sender;
    decimals = _decimals;
    totalSupply_ = _supply;
    balances[msg.sender] = _supply;
    parentTokenAddress = _parentTokenAddress;
  }

  /// @dev Log past approvals for migrating old transactions to a new blockchain
  /// @param  _owner                               Token owner
  /// @param  _spender                             Token spender
  /// @param  _value                               Token amount
  /// @param  _timestamp                           Timestamp
  /// @return success                              Operation successful
  function emitLogPastApproval(
    address _owner,
    address _spender,
    uint256 _value,
    uint256 _timestamp
  ) public onlyOwner returns (bool success) {
    emit LogPastApproval(_owner, _spender, _value, _timestamp);
    return true;
  }

  /// @dev Log past transfer for migrating old transactions to a new blockchain
  /// @param  _from                               Token owner
  /// @param  _to                                 Token receiver
  /// @param  _value                              Token amount
  /// @param  _timestamp                          Timestamp
  /// @return success                             Operation successful
  function emitLogPastTransfer(
    address _from,
    address _to,
    uint256 _value,
    uint256 _timestamp
  ) public onlyOwner returns (bool success) {
    emit LogPastTransfer(_from, _to, _value, _timestamp);
    return true;
  }

  /// @dev Set initial holder balance
  /// @param  _owner                              Token owner
  /// @param  _value                              Token amount
  /// @return success                             Operation successful
  function setInitialHolderBalance(
    address _owner,
    uint256 _value
  ) public onlyOwner returns (bool success) {
    transfer(_owner, _value);
    return true;
  }

}