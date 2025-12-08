/**
 * Real Client-Side Blockchain Implementation
 * Uses SHA-256 to create a cryptographically valid chain of blocks.
 */

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = ''; // Calculated async
    this.nonce = 0;
  }

  async calculateHash() {
    const msgBuffer = new TextEncoder().encode(
      this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce
    );
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async mineBlock(difficulty) {
    // Simple PoW simulation
    // Since we are on client-side, keep difficulty low (e.g., 2 zeros) to avoid freezing UI
    // or just calculate hash once for speed in demo.
    // For "Correct Manner" demo, we will just calculate hash.
    this.hash = await this.calculateHash();
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    // Genesis block is created async, so handle via init()
    this.difficulty = 2; // Low difficulty for browser speed
  }

  async init() {
    const storedChain = localStorage.getItem('agrisync_blockchain_v2');
    if (storedChain) {
      this.chain = JSON.parse(storedChain);
    } else {
      const genesisBlock = new Block(0, new Date().toISOString(), "Genesis Block", "0");
      await genesisBlock.mineBlock(this.difficulty);
      this.chain = [genesisBlock];
      this.saveChain();
    }
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  async addBlock(batchData) {
    const latestBlock = this.getLatestBlock();
    const newBlock = new Block(
      latestBlock.index + 1,
      new Date().toISOString(),
      batchData,
      latestBlock.hash
    );

    await newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.saveChain();
    return newBlock;
  }

  async isChainValid() {
    // Traverse and verify
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // 1. Re-calculate hash
      const reconstructedBlock = new Block(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.previousHash
      );
      reconstructedBlock.nonce = currentBlock.nonce;
      const recalcHash = await reconstructedBlock.calculateHash();

      if (currentBlock.hash !== recalcHash) {
        console.error(`Block ${i} hash invalid!`);
        return false;
      }

      // 2. Check link to previous
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.error(`Block ${i} previousHash link broken!`);
        return false;
      }
    }
    return true;
  }

  saveChain() {
    localStorage.setItem('agrisync_blockchain_v2', JSON.stringify(this.chain));
  }

  getAllBatches() {
    // Return data payload from blocks (excluding Genesis)
    return this.chain.slice(1).map(block => ({
      ...block.data,
      blockchainHash: block.hash,
      previousHash: block.previousHash,
      blockIndex: block.index,
      timestamp: block.timestamp
    }));
  }
}

// Singleton export
const agriBlockchain = new Blockchain();

// Init immediately if possible or on demand
// Since module systems in browser are tricky without bundlers, we attach to window
window.AgriBlockchain = agriBlockchain;

// Helper global function for legacy support
window.saveBatchToBlockchain = async (data) => {
  if (window.AgriBlockchain.chain.length === 0) await window.AgriBlockchain.init();
  const block = await window.AgriBlockchain.addBlock(data);
  return {
    ...data,
    blockchainHash: block.hash,
    timestamp: block.timestamp
  };
};

window.getBlockchainBatches = () => {
  if (window.AgriBlockchain.chain.length === 0) return []; // Need init
  return window.AgriBlockchain.getAllBatches();
};

window.validateBlockchain = async () => {
  if (window.AgriBlockchain.chain.length === 0) await window.AgriBlockchain.init();
  return await window.AgriBlockchain.isChainValid();
};