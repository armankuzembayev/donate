const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donation", function ()  {

    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addr3;

    beforeEach(async function() {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        Token = await ethers.getContractFactory("Donation");
        hardhatToken = await Token.deploy();
    });

    describe("Deployment", function() {

        it("Should set the right owner", async function() {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        it("Should initialize correctly", async function() {
            expect(await hardhatToken.currentId()).to.equal(0);
            expect(await hardhatToken.getBalance()).to.equal(ethers.BigNumber.from(0));
        });
    });

    describe("Simple transfer", function() {
        it("Should transfer money", async function() {
            expect(await hardhatToken.getBalance()).to.equal(ethers.BigNumber.from(0));

            await owner.sendTransaction({
                to: hardhatToken.address,
                value: ethers.utils.parseEther("1.0"),
            });

            expect(await hardhatToken.getBalance()).to.equal(ethers.utils.parseEther("1.0"));
        });
    });

    describe("Withdraw", function() {
        it("Should revert due to 0 balance", async function() {
            await expect(
                hardhatToken.withdraw(addr3.address, ethers.utils.parseEther("1.0"))
            ).to.be.revertedWith("Not enough Balance!");
        })

        it("Should revert because it was executed not from the owner", async function() {
            expect(await hardhatToken.getBalance()).to.equal(ethers.BigNumber.from(0));

            await owner.sendTransaction({
                to: hardhatToken.address,
                value: ethers.utils.parseEther("1.0"),
            });

            expect(await hardhatToken.getBalance()).to.equal(ethers.utils.parseEther("1.0"));

            await expect(
                hardhatToken.connect(addr1).withdraw(addr3.address, ethers.utils.parseEther("1.0"))
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should withdraw right amount", async function() {
            expect(await hardhatToken.getBalance()).to.equal(ethers.utils.parseEther("0.0"));
            
            await owner.sendTransaction({
                to: hardhatToken.address,
                value: ethers.utils.parseEther("1.0"),
            });

            expect(await hardhatToken.getBalance()).to.equal(ethers.utils.parseEther("1.0"));
            
            await hardhatToken.withdraw(owner.address, ethers.utils.parseEther("0.3"));

            expect(await hardhatToken.getBalance()).to.equal(ethers.utils.parseEther("0.7"));
        });
    });

    describe("Donators", function() {
        it("Should return the rigth donators", async function() {
            expect(await hardhatToken.getBalance()).to.equal(ethers.BigNumber.from(0));
            const arr = await hardhatToken.getDonators();
            expect(arr.length).to.equal(0);

            await owner.sendTransaction({
                to: hardhatToken.address,
                value: ethers.utils.parseEther("1.0"),
            });
            expect(await hardhatToken.getBalance()).to.equal(ethers.utils.parseEther("1.0"));

            const arr1 = await hardhatToken.getDonators();
            expect(arr1.length).to.equal(1);
            expect(arr1[0]).to.equal(owner.address);

            await addr1.sendTransaction({
                to: hardhatToken.address,
                value: ethers.utils.parseEther("2.0"),
            });
            expect(await hardhatToken.getBalance()).to.equal(ethers.utils.parseEther("3.0"));

            const arr2 = await hardhatToken.getDonators();
            expect(arr2.length).to.equal(2);
            expect(arr2[0]).to.equal(owner.address);
            expect(arr2[1]).to.equal(addr1.address);

            await owner.sendTransaction({
                to: hardhatToken.address,
                value: ethers.utils.parseEther("3.0"),
            });
            expect(await hardhatToken.getBalance()).to.equal(ethers.utils.parseEther("6.0"));
            
            const arr3 = await hardhatToken.getDonators();
            expect(arr3.length).to.equal(2);
            expect(arr3[0]).to.equal(owner.address);
            expect(arr3[1]).to.equal(addr1.address);
        });
    });

    describe("Donation Amount", function() {
        it("Should return right donation amount", async function() {
            expect(await hardhatToken.getDonationAmountForUser(owner.address)).to.equal(0);

            await owner.sendTransaction({
                to: hardhatToken.address,
                value: ethers.utils.parseEther("1.0"),
            });

            expect(await 
                hardhatToken.getDonationAmountForUser(owner.address)
            ).to.equal(ethers.utils.parseEther("1.0"));

            await owner.sendTransaction({
                to: hardhatToken.address,
                value: ethers.utils.parseEther("2.0"),
            });

            expect(await 
                hardhatToken.getDonationAmountForUser(owner.address)
            ).to.equal(ethers.utils.parseEther("3.0"));
        });
    });

});
