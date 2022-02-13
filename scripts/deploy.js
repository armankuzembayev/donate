const hre = require("hardhat");

async function main() {
    const [signer] = await hre.ethers.getSigners()

    const Donation = await hre.ethers.getContractFactory("Donation", signer);
    const donation = await Donation.deploy();

    await donation.deployed();

    console.log("Donation deployed to:", donation.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
