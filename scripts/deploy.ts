import { ethers } from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";

async function main() {
  console.log("Deploying contracts to Sepolia...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", await deployer.getAddress());

  // Deploy TokenFactory
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy();
  await tokenFactory.deployed();

  console.log("TokenFactory deployed to:", tokenFactory.address);

  // Check if deployer has any role
  const FARMER_ROLE = keccak256(toUtf8Bytes("FARMER_ROLE"));
  const hasRole = await tokenFactory.hasRole(FARMER_ROLE, deployer.getAddress());
  
  if (!hasRole) {
    // Register deployer as a farmer
    await tokenFactory.registerUser("Test Farmer", "Test Location", FARMER_ROLE);
    console.log("Registered deployer as farmer");

    // Since deployer is admin, they can verify themselves
    const userAddress = await deployer.getAddress();
    await tokenFactory.verifyUser(userAddress);
    console.log("Verified farmer account");
  } else {
    console.log("Deployer already registered as farmer");
  }

  console.log("Deployment and setup completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
