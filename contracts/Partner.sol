// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Partner {
    uint uselessCounter; 

    receive() external payable {
        for (uint i = 0; i < 9999999; i++) {
            uselessCounter++;
        }
    }
}