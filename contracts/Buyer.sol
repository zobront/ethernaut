// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IShop {
    function isSold() external view returns (bool);
    function buy() external;
}

contract Buyer {
    IShop shop; 

    constructor(address _shop) {
        shop = IShop(_shop);
    }

    function price() external view returns (uint) {
        return shop.isSold() ? 0 : 101;
    }

    function buyFromShop() external {
        shop.buy();
    }
}