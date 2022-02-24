const { ethers } = require("hardhat");

const abi = [
	{
		"inputs": [],
		"name": "whatIsTheMeaningOfLife",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	}
]

const bytecode = "0x608060405234801561001057600080fd5b5060b68061001f6000396000f3fe602A60405260206040f3"


async function main() {
	const [deployer] = await ethers.getSigners()
	console.log(deployer.address)
	console.log('Account balance: ', (await deployer.getBalance()).toString())
	const tx = await deployer.sendTransaction({data: bytecode})
	console.log(tx)
    // const Contract = await new ethers.ContractFactory(abi, bytecode, deployer);
    // const contract = await Contract.deploy();
    // console.log(contract.address)
}

async function check() {
	const abi = ["function whatIsTheMeaningOfLife() public pure returns (uint)"]
	const [signer] = await ethers.getSigners()
	const contract = new ethers.Contract('0xB681287bf7c52792769Ab9D3C08e273B15e46F6C', abi, signer)
	const x = await contract.whatIsTheMeaningOfLife();
	console.log(x)
}


check()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
