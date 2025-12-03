// backend/blockchain.js
// Simple ethers.js wrapper for the OilseedTraceability smart contract.

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY; // from local dev chain
const CONTRACT_ADDRESS = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;

// Load ABI compiled from Solidity (provided as JSON)
const ABI_PATH = path.join(__dirname, "OilseedTraceability.abi.json");
const ABI = JSON.parse(fs.readFileSync(ABI_PATH, "utf8"));

if (!PRIVATE_KEY) {
  console.warn("⚠ BLOCKCHAIN_PRIVATE_KEY not set in .env – blockchain routes will fail until configured.");
}
if (!CONTRACT_ADDRESS) {
  console.warn("⚠ BLOCKCHAIN_CONTRACT_ADDRESS not set in .env – blockchain routes will fail until configured.");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;

let contract = null;
if (wallet && CONTRACT_ADDRESS) {
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
}

module.exports = contract;
