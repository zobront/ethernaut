// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FakeToken {
    uint public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    constructor(address dex) {
        mint(msg.sender, 10 * 10**18);
        approve(dex, 10);
    }

    function approve(address spender, uint amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        return true;
    }

    function mint(address recipient, uint amount) internal {
        balanceOf[recipient] += amount;
        totalSupply += amount;
    }
}