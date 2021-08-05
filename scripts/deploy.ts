import { ethers } from "hardhat";
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("Token");
  const HashCheck = await ethers.getContractFactory("HashCheck");
  const Game = await ethers.getContractFactory("Game");
  const CashFlow = await ethers.getContractFactory("TradeableCashflow");

  const hashCheck = await HashCheck.deploy();
  const game = await Game.deploy();
  const cashFlow = await CashFlow.deploy();

  console.log("hash check", hashCheck.address);
  console.log("game deployed at", game.address);
  console.log("cash flow", cashFlow.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
