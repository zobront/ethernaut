// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Elevator {
    function goTo(uint _floor) external;
}

contract Building {
    Elevator elevator;
    bool secondCheck;

    constructor(address _evelvator) {
        elevator = Elevator(_evelvator);
    }

    function sendElevator() external {
        elevator.goTo(5);
    }

    function isLastFloor(uint _floor) external returns (bool) {
        bool result = secondCheck;
        secondCheck = true;
        return result;
    }
}