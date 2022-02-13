require("@nomiclabs/hardhat-web3")

const artifact = require('../artifacts/contracts/Donation.sol/Donation.json')
const contractAddress = process.env.CONTRACT_ADDRESS
const network = 'rinkeby'


task("transfer", "Transfer token to donation address")
    .addParam("amount", "How much to send")
    .setAction(async (taskArgs) => {
        
    const [signer] = await hre.ethers.getSigners()

    const contract = new hre.ethers.Contract(
        contractAddress,
        artifact.abi,
        signer
    )

    const provider = ethers.getDefaultProvider(network)

    const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const send = await wallet.sendTransaction({
        to: contractAddress,
        value: ethers.utils.parseEther(taskArgs.amount),
    })
    await send.wait() 

    const balance = await contract.getBalance()
    console.log("Balance: ", ethers.utils.formatEther(balance))

});

task("withdraw", "Withdraw some amount of money to some address")
    .addParam("to", "The account's address")
    .addParam("amount", "How much to send")
    .setAction(async (taskArgs) => {

    const [signer] = await hre.ethers.getSigners()

    const contract = new hre.ethers.Contract(
        contractAddress,
        artifact.abi,
        signer
    )

    const provider = ethers.getDefaultProvider(network)

    const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const withdraw = await contract.connect(wallet).withdraw(
        taskArgs.to, ethers.utils.parseEther(taskArgs.amount)
    )
    await withdraw.wait()
    
    const balance = await contract.getBalance()
    console.log("Balance: ", ethers.utils.formatEther(balance))
});

task("donators", "Get list of all donatos", async function() {

    const [signer] = await hre.ethers.getSigners()

    const contract = new hre.ethers.Contract(
        contractAddress,
        artifact.abi,
        signer
    )
    
    const donators = await contract.getDonators()
    for (const donator of donators) {
        console.log(donator)
    }
});

task("donationAmount", "Donation amount from some user address")
    .addParam("address", "The user's address")
    .setAction(async (taskArgs) => {

    const [signer] = await hre.ethers.getSigners()

    const contract = new hre.ethers.Contract(
        contractAddress,
        artifact.abi,
        signer
    )

    const amount = await contract.getDonationAmountForUser(taskArgs.address)
    console.log("Amount of donation is: ", ethers.utils.formatEther(amount))
});

module.exports = {};