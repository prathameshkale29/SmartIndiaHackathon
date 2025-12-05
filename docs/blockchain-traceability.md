# Blockchain Traceability System

## Overview

This system implements a **hybrid farm-to-fork traceability solution** combining:
- **Off-chain hash-chain** stored in MongoDB for complete event history
- **On-chain anchoring** to Ethereum blockchain for milestone events

## Architecture

### Off-Chain Hash-Chain

Each trace event is linked to the previous event through cryptographic hashing, creating an immutable chain of custody.

**How it works:**
1. When a new event is created, we retrieve the hash of the last event for that batch
2. We compute a SHA256 hash using: `batchId + eventType + eventData + timestamp + prevHash`
3. This hash becomes the `currentHash` for the new event
4. The first event in a batch uses `"GENESIS"` as its `prevHash`

**Benefits:**
- **Tamper-evident**: Any modification to past events breaks the hash chain
- **Efficient**: All data stored off-chain for fast queries
- **Complete history**: Every event is recorded with full details

### On-Chain Anchoring

Milestone events are anchored to the Ethereum blockchain for additional security and public verifiability.

**Milestone Events:**
- `HARVESTED` - Crop harvested from farm
- `PROCURED_BY_PROCESSOR` - Processor receives the batch
- `PROCESSED` - Processing completed
- `PACKED` - Final packaging completed

**How it works:**
1. When a milestone event is created, a compact data hash is computed
2. The smart contract's `addEvent(batchId, eventType, dataHash)` function is called
3. Transaction hash is stored in the database
4. Event status is updated: `NONE` → `PENDING` → `SUCCESS`/`FAILED`

**Benefits:**
- **Public verification**: Anyone can verify milestone events on blockchain
- **Immutable**: Blockchain provides additional layer of security
- **Selective anchoring**: Only important events to reduce gas costs

## Smart Contract Interface

The system expects a deployed Solidity contract with this interface:

```solidity
contract OilseedTraceability {
    event EventAdded(
        uint256 indexed batchId,
        string eventType,
        string dataHash,
        uint256 timestamp
    );

    function addEvent(
        uint256 batchId,
        string memory eventType,
        string memory dataHash
    ) external;
}
```

## API Endpoints

### Create Trace Event
```http
POST /api/trace-events
Content-Type: application/json

{
  "batchId": "BTC001",
  "actorId": "FARMER001",
  "actorRole": "FARMER",
  "eventType": "PLANTED",
  "eventData": {
    "crop": "Soybean",
    "area": "5 acres",
    "variety": "JS 335"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "...",
    "batchId": "BTC001",
    "currentHash": "a1b2c3...",
    "prevHash": "GENESIS",
    "onChainStatus": "NONE",
    ...
  }
}
```

### Get Batch History
```http
GET /api/trace-events/BTC001
```

**Response:**
```json
{
  "status": "success",
  "batchId": "BTC001",
  "eventCount": 5,
  "hashChainValid": true,
  "verification": {
    "valid": true,
    "message": "Hash chain verified",
    "eventCount": 5
  },
  "events": [...]
}
```

### Get On-Chain Events
```http
GET /api/trace-events/BTC001/onchain
```

**Response:**
```json
{
  "status": "success",
  "batchId": "BTC001",
  "onChainEventCount": 2,
  "events": [
    {
      "batchId": "1",
      "eventType": "HARVESTED",
      "dataHash": "abc123...",
      "blockNumber": 12345,
      "transactionHash": "0x..."
    }
  ]
}
```

### Verify Hash Chain
```http
GET /api/trace-events/BTC001/verify
```

## Configuration

### Environment Variables

Create `.env` file in the `backend` directory:

```bash
# Database
MONGO_URI=mongodb://127.0.0.1:27017/sih

# Blockchain (Ethereum Sepolia Testnet example)
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
BLOCKCHAIN_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

**Getting Blockchain Credentials:**
1. **RPC URL**: Sign up at [Infura](https://infura.io) or [Alchemy](https://alchemy.com)
2. **Private Key**: Export from MetaMask (Account Details → Export Private Key)
3. **Contract Address**: Deploy the smart contract and copy the address

## Testing

### 1. Start the Server

```bash
cd backend
npm install
npm start
```

Server should start on `http://localhost:5000`

### 2. Create Sample Events

```bash
# Event 1: Planted
curl -X POST http://localhost:5000/api/trace-events \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "BTC001",
    "actorId": "FARMER001",
    "actorRole": "FARMER",
    "eventType": "PLANTED",
    "eventData": {"crop": "Soybean", "area": "5 acres"}
  }'

# Event 2: Harvested (Milestone - will be anchored on-chain)
curl -X POST http://localhost:5000/api/trace-events \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "BTC001",
    "actorId": "FARMER001",
    "actorRole": "FARMER",
    "eventType": "HARVESTED",
    "eventData": {"quantity": "100 kg", "quality": "Grade A"}
  }'

# Event 3: Procured
curl -X POST http://localhost:5000/api/trace-events \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "BTC001",
    "actorId": "PROC001",
    "actorRole": "PROCESSOR",
    "eventType": "PROCURED_BY_PROCESSOR",
    "eventData": {"price": "5000 INR", "location": "Processing Plant A"}
  }'
```

### 3. View Traceability Page

Open browser: `http://localhost:5000/trace.html?batchId=BTC001`

You should see:
- Timeline of all events
- Hash chain verification status
- Blockchain verification badges on milestone events
- Complete event details

### 4. Verify Hash Chain

```bash
curl http://localhost:5000/api/trace-events/BTC001/verify
```

Expected response:
```json
{
  "status": "success",
  "batchId": "BTC001",
  "valid": true,
  "message": "Hash chain verified",
  "eventCount": 3
}
```

## Actor Roles

- **FARMER**: Crop cultivation and harvesting
- **FPO**: Farmer Producer Organization (aggregation)
- **PROCESSOR**: Oil extraction and processing
- **DISTRIBUTOR**: Transportation and distribution
- **RETAILER**: Final sale point
- **WAREHOUSE**: Storage facilities

## Event Types

- **PLANTED**: Crop planting
- **HARVESTED**: Crop harvesting (Milestone)
- **PROCURED_BY_PROCESSOR**: Processor procurement (Milestone)
- **PROCESSED**: Processing completion (Milestone)
- **PACKED**: Final packaging (Milestone)
- **SHIPPED**: Transportation
- **DELIVERED**: Delivery to destination
- **QUALITY_CHECK**: Quality inspection
- **STORED**: Warehouse storage

## Security Considerations

1. **Private Key Security**: Never commit private keys to version control
2. **Hash Chain Integrity**: Regularly verify hash chains for tampering
3. **On-Chain Costs**: Only milestone events are anchored to minimize gas fees
4. **Database Backups**: Regular backups of MongoDB for disaster recovery

## Troubleshooting

**Blockchain not initialized:**
- Check `.env` file has correct RPC URL and private key
- Verify contract is deployed and ABI file exists
- Check console logs for initialization errors

**Hash chain broken:**
- Events may have been modified directly in database
- Check verification endpoint for specific error
- Review event timestamps and hashes

**On-chain anchoring failed:**
- Verify wallet has sufficient ETH for gas
- Check RPC endpoint is accessible
- Review transaction logs in console

## Future Enhancements

- QR code generation for batch tracking
- Mobile app for field data entry
- Automated quality check integration
- Multi-chain support (Polygon, BSC)
- IPFS integration for document storage
