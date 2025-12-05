# Quick Start Guide

## 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod
```

## 2. Configure Environment
Copy `.env.example` to `.env` and update with your blockchain credentials:
```bash
cd backend
copy .env.example .env
```

Edit `.env` with your actual values (or leave defaults for testing without blockchain).

## 3. Start Server
```bash
cd backend
npm start
```

Server will start on http://localhost:5000

## 4. Test the System

### Option A: Use Test Script
```bash
cd backend
node test-trace.js
```

### Option B: Manual Testing
Open browser to: http://localhost:5000/trace.html?batchId=BTC001

### Option C: API Testing
```bash
# Create event
curl -X POST http://localhost:5000/api/trace-events -H "Content-Type: application/json" -d "{\"batchId\":\"BTC001\",\"actorId\":\"FARMER001\",\"actorRole\":\"FARMER\",\"eventType\":\"PLANTED\",\"eventData\":{\"crop\":\"Soybean\"}}"

# Get events
curl http://localhost:5000/api/trace-events/BTC001
```

## Troubleshooting

**MongoDB connection failed:**
- Ensure MongoDB is running
- Check MONGO_URI in .env

**Blockchain warnings:**
- Normal if blockchain not configured
- On-chain anchoring will be disabled
- Off-chain hash-chain still works

**Port already in use:**
- Change PORT in .env
- Or stop other process using port 5000
