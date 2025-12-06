// backend/blockchain.js
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL;
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;

// Load ABI
const ABI_PATH = path.join(__dirname, 'OilseedTraceability.abi.json');
let ABI;
try {
  ABI = JSON.parse(fs.readFileSync(ABI_PATH, 'utf8'));
} catch (error) {
  console.warn('Warning: Could not load contract ABI. On-chain anchoring will be disabled.');
  ABI = null;
}

let provider = null;
let signer = null;
let contract = null;

/**
 * Initialize blockchain connection
 */
function initializeBlockchain() {
  if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS || !ABI) {
    console.warn('Blockchain configuration incomplete. On-chain anchoring disabled.');
    return false;
  }

  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    signer = new ethers.Wallet(PRIVATE_KEY, provider);
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    console.log('Blockchain connection initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize blockchain:', error.message);
    return false;
  }
}

/**
 * Compute compact data hash for on-chain storage
 * @param {object} eventData - Event data
 * @param {string} currentHash - Current event hash
 * @returns {string} Compact hash
 */
function computeDataHash(eventData, currentHash) {
  const combined = JSON.stringify(eventData) + currentHash;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

/**
 * Anchor event on blockchain
 * @param {number} batchId - Batch ID (numeric)
 * @param {string} eventType - Event type
 * @param {string} dataHash - Compact data hash
 * @returns {Promise<object>} Transaction result
 */
async function anchorEventOnChain(batchId, eventType, dataHash) {
  if (!contract) {
    return {
      success: false,
      error: 'Blockchain not initialized',
      status: 'FAILED'
    };
  }

  try {
    // Convert batchId to number (extract numeric part if string like "BTC001")
    const numericBatchId = typeof batchId === 'string'
      ? parseInt(batchId.replace(/\D/g, '')) || 0
      : batchId;

    console.log(`Anchoring event on-chain: Batch ${numericBatchId}, Type: ${eventType}`);

    // Call smart contract function: addEvent(uint256 batchId, string eventType, string dataHash)
    const tx = await contract.addEvent(numericBatchId, eventType, dataHash);

    console.log(`Transaction submitted: ${tx.hash}`);

    // Wait for confirmation (optional - can be done async)
    const receipt = await tx.wait();

    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: 'SUCCESS'
    };
  } catch (error) {
    console.error('On-chain anchoring failed:', error.message);
    return {
      success: false,
      error: error.message,
      status: 'FAILED'
    };
  }
}

/**
 * Query on-chain events for a batch
 * @param {string} batchId - Batch identifier
 * @returns {Promise<array>} On-chain events
 */
async function getOnChainEvents(batchId) {
  if (!contract) {
    return [];
  }

  try {
    const numericBatchId = typeof batchId === 'string'
      ? parseInt(batchId.replace(/\D/g, '')) || 0
      : batchId;

    // Query contract events (assuming contract has a getter or event logs)
    // This depends on your contract implementation
    // Example: const events = await contract.getEvents(numericBatchId);

    // For now, we'll query event logs
    const filter = contract.filters.EventAdded(numericBatchId);
    const events = await contract.queryFilter(filter);

    return events.map(event => ({
      batchId: event.args.batchId.toString(),
      eventType: event.args.eventType,
      dataHash: event.args.dataHash,
      timestamp: event.args.timestamp ? new Date(event.args.timestamp.toNumber() * 1000) : null,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    }));
  } catch (error) {
    console.error('Error querying on-chain events:', error.message);
    return [];
  }
}

/**
 * Check if event type is a milestone that should be anchored on-chain
 * @param {string} eventType - Event type
 * @returns {boolean} True if milestone event
 */
function isMilestoneEvent(eventType) {
  const milestones = ['HARVESTED', 'PROCURED_BY_PROCESSOR', 'PROCESSED', 'PACKED'];
  return milestones.includes(eventType);
}

// Initialize on module load
initializeBlockchain();

module.exports = {
  initializeBlockchain,
  computeDataHash,
  anchorEventOnChain,
  getOnChainEvents,
  isMilestoneEvent
};
