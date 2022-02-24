const { ethers } = require("hardhat");

async function main() {
  const provider = ethers.getDefaultProvider('rinkeby');
  // const provider = new ethers.providers.AlchemyProvider(network="matic");


  for (let i = 0; i < 10; i++) {
    let x = await provider.getStorageAt('0x28d18cAD3601FfbE0329a264Cd3B26FAf8a561aa', i);
    console.log(`Slot ${i}: ${x}`);
  }
  // let y = await provider.getStorageAt('0xdfB2f7e6269E8bd7A0c28389386Ad968820775a9', 0);
  // console.log(y)
  // let x = await provider.getStorageAt('0xcbD18DFc120Edc8851E8C82B8A05b1F96af420a9', '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc');
  // console.log(x)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
