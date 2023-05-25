import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

describe("ClassToken", function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory('ClassToken');
    const [owner, account_1, account_2] = await ethers.getSigners();

    const initialSupply = ethers.utils.parseEther('10000.0')
    const token = await Token.deploy(initialSupply);
    await token.deployed();

    return { token, owner, account_1, account_2 };
  }

  it("Should have the correct initial supply", async function () {
    const { token, owner } = await loadFixture(deployTokenFixture);

    expect(await token.totalSupply()).to.equal(await token.balanceOf(owner.address));
  });

  it("event", async () => {
    const { token, owner, account_1 } = await loadFixture(deployTokenFixture);

    await expect(token.transfer(account_1.address, 50))
        .to.emit(token, 'Transfer')
        .withArgs(owner.address, account_1.address, 50);

  });
});
