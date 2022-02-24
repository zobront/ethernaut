const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = ''
const abi = [
    
]

async function hack(contract, signer) {
    
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})