import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("Token");
  const HashCheck = await ethers.getContractFactory("HashCheck");
  const Game = await ethers.getContractFactory("Game");
  const CashFlow = await ethers.getContractFactory("TradeableCashflow");

  const token = await Token.deploy();
  const hashCheck = await HashCheck.deploy();

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
