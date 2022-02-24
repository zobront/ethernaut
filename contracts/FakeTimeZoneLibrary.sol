// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FakeTimeZoneLibrary {
    address public slot0;
    address public slot1;
    address public owner;

    function setTime(uint256 _time) public {
        owner = address(uint160(_time));
    }
}