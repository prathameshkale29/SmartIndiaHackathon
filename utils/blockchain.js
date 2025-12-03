const BLOCKCHAIN_KEY = 'agrisync_blockchain';

function generateBlockchainHash() {
  return 'BH' + Date.now() + Math.random().toString(36).substr(2, 9);
}

function saveBatchToBlockchain(batchData) {
  try {
    const batches = getBlockchainBatches();
    const newBatch = {
      ...batchData,
      id: 'BTC' + (batches.length + 1).toString().padStart(3, '0'),
      hash: generateBlockchainHash(),
      timestamp: new Date().toISOString(),
      verified: true
    };
    batches.push(newBatch);
    localStorage.setItem(BLOCKCHAIN_KEY, JSON.stringify(batches));
    return newBatch;
  } catch (error) {
    console.error('Blockchain save error:', error);
    return null;
  }
}

function getBlockchainBatches() {
  try {
    const stored = localStorage.getItem(BLOCKCHAIN_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

function getBatchById(batchId) {
  const batches = getBlockchainBatches();
  return batches.find(b => b.id === batchId);
}

function verifyBatchIntegrity(batchId) {
  const batch = getBatchById(batchId);
  return batch ? batch.verified : false;
}