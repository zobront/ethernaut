const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x8fd92ED4DDf31c107d1c9B684a447B61C52F9E10'
const abi = ["function setSolver(address _solver) public"]

async function hack(contract, signer) {
    // The fun of this is creating the raw bytecode to upload!
    // The last 10 bytes are the op codes to return 42 (the magic number).
    // The first 12 bytes are initialization op codes to replicate the last 10 bytes to memory.
    // This article might be helpful: https://blog.trustlook.com/understand-evm-bytecode-part-1/
    const bytecode = "0x600a600c600039600a6000f3602A60805260206080f3"
	const deployTx = await signer.sendTransaction({data: bytecode})
	const receipt = await deployTx.wait()
    const solverAddress = receipt.contractAddress
    console.log(`Solver Address: ${solverAddress}`)

    // Let's test the solver to make sure it's returning 42.
    const solverABI = ["function whatIsTheMeaningOfLife() public pure returns (uint)"]
    const solver = new ethers.Contract(solverAddress, solverABI, signer)
    const x = await solver.whatIsTheMeaningOfLife();
    console.log(`Solver, what is the meaning of life? ${x}`)

    // Now that it's confirmed, let's set it as the Solver on the target contract.
    const setSolverTx = await contract.setSolver(solverAddress)
    await setSolverTx.wait()
    console.log(`Solver set.`)
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})