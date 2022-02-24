// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AddressPredictor {
    function predict(address a, uint nonce) pure public returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xd6), bytes1(0x94), a, bytes1(0x80))))));
    }
}

// 214, 148, address, 80 / nonce?
