Blockchain Traceability Integration
===================================

1. Compile and deploy contracts/OilseedTraceability.sol using Hardhat/Ganache.
2. Copy the deployed contract address into backend/.env as:
   BLOCKCHAIN_CONTRACT_ADDRESS=0x...
   BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
   BLOCKCHAIN_PRIVATE_KEY=0x... (from your local dev wallet)

3. Install ethers in backend:
   cd backend
   npm install ethers

4. Start backend:
   npm run dev  (or node server.js)

New API endpoints:
- POST /api/trace/register-batch
- POST /api/trace/add-event
- GET  /api/trace/:batchId

These APIs talk to the blockchain and can be called from the BlockchainTracker React component.
