# Hybrid Blockchain Traceability System - README

## 🎯 Overview

Complete farm-to-fork traceability system combining **off-chain hash-chain** (MongoDB) with **on-chain anchoring** (Ethereum blockchain).

## ✨ Features

- ✅ SHA256 hash-chain for tamper-evident event tracking
- ✅ Ethereum blockchain anchoring for milestone events
- ✅ RESTful API for event creation and querying
- ✅ Interactive timeline visualization
- ✅ Real-time hash-chain verification
- ✅ Actor role tracking (Farmer, Processor, Distributor, etc.)
- ✅ Blockchain verification badges

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start MongoDB
Ensure MongoDB is running on `mongodb://127.0.0.1:27017`

### 3. Configure (Optional)
```bash
# Copy environment template
copy .env.example .env

# Edit .env with blockchain credentials (optional for testing)
```

### 4. Start Server
```bash
npm start
```

Server runs on: **http://localhost:5000**

### 5. Test with Sample Data
```bash
node test-trace.js
```

### 6. View Traceability
Open: **http://localhost:5000/trace.html?batchId=BTC001**

## 📡 API Endpoints

### Create Event
```bash
POST /api/trace-events
{
  "batchId": "BTC001",
  "actorId": "FARMER001",
  "actorRole": "FARMER",
  "eventType": "PLANTED",
  "eventData": {"crop": "Soybean", "area": "5 acres"}
}
```

### Get Event History
```bash
GET /api/trace-events/:batchId
```

### Get On-Chain Events
```bash
GET /api/trace-events/:batchId/onchain
```

### Verify Hash Chain
```bash
GET /api/trace-events/:batchId/verify
```

## 📚 Documentation

- **[Blockchain Traceability Guide](docs/blockchain-traceability.md)** - Complete system documentation
- **[Quick Start Guide](QUICKSTART.md)** - Setup instructions
- **[Implementation Plan](C:\Users\PC World\.gemini\antigravity\brain\f6ef1fde-30c2-4887-856d-12a28c683596\implementation_plan.md)** - Technical design
- **[Walkthrough](C:\Users\PC World\.gemini\antigravity\brain\f6ef1fde-30c2-4887-856d-12a28c683596\walkthrough.md)** - Implementation details

## 🏗️ Architecture

### Off-Chain Hash-Chain
- All events stored in MongoDB
- Each event linked via SHA256 hash
- Complete audit trail
- Fast queries

### On-Chain Anchoring
- Milestone events on Ethereum
- Public verification
- Immutable records
- Smart contract integration

## 🎨 Event Types

| Type | Milestone | Description |
|------|-----------|-------------|
| PLANTED | No | Crop planting |
| **HARVESTED** | **Yes** | Crop harvesting |
| **PROCURED_BY_PROCESSOR** | **Yes** | Processor procurement |
| **PROCESSED** | **Yes** | Processing completion |
| **PACKED** | **Yes** | Final packaging |
| SHIPPED | No | Transportation |
| DELIVERED | No | Delivery |

## 🔐 Security

- **Tamper-evident**: Hash-chain breaks if data modified
- **Cryptographic**: SHA256 hashing
- **Blockchain**: Milestone events on-chain
- **Verification**: Built-in integrity checking

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Blockchain**: Ethers.js, Ethereum
- **Frontend**: HTML, CSS, JavaScript
- **Crypto**: Node.js crypto (SHA256)

## 📦 Files Structure

```
backend/
├── models/
│   └── TraceEvent.js          # Mongoose model
├── utils/
│   └── hashChain.js           # Hash-chain logic
├── routes/
│   └── traceEvents.js         # API endpoints
├── blockchain.js              # Ethers.js integration
├── server.js                  # Express server
└── test-trace.js              # Test script

frontend/
└── trace.html                 # Traceability UI

docs/
└── blockchain-traceability.md # Documentation
```

## 🧪 Testing

```bash
# Create sample events
node backend/test-trace.js

# Verify hash chain
curl http://localhost:5000/api/trace-events/BTC001/verify

# View in browser
http://localhost:5000/trace.html?batchId=BTC001
```

## ⚙️ Configuration

### Without Blockchain
System works with off-chain hash-chain only. On-chain anchoring will be disabled.

### With Blockchain
Add to `.env`:
```bash
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
BLOCKCHAIN_CONTRACT_ADDRESS=0x...
```

## 🎯 Use Cases

- Farm-to-fork tracking
- Supply chain transparency
- Quality assurance
- Regulatory compliance
- Consumer trust
- Fraud prevention

## 📞 Support

See [docs/blockchain-traceability.md](docs/blockchain-traceability.md) for detailed documentation.

## ✅ Status

**Implementation: Complete**  
**Server: Running on port 5000**  
**Database: MongoDB connected**  
**APIs: All endpoints active**  
**Frontend: Traceability page ready**  
**Documentation: Complete**

---

**Ready to use!** 🚀
