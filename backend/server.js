// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/oilseed-advisor', require('./routes/oilseedAdvisor'));
app.use('/api/users', require('./routes/users'));
app.use('/api/trace', require('./routes/traceability'));
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/forecast', require('./routes/forecast'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/satellite', require('./routes/satellite'));
app.use('/api/procurement', require('./routes/procurement'));
app.use('/api/contracts', require('./routes/contracts'));

// Serve static frontend from project root (parent of backend/)
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

// Fallback for SPA routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
