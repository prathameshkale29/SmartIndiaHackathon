// backend/routes/forecast.js
// Real predictive analytics integration with Python ML service

const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Cache for predictions (5 minute TTL)
const predictionCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Call Python ML service for predictions
 * @param {string} scriptName - Python script to run
 * @param {object} params - Parameters to pass to the script
 * @returns {Promise<object>} - Prediction results
 */
function callPythonService(scriptName, params) {
    return new Promise((resolve, reject) => {
        const pythonPath = 'python'; // or 'python3' depending on system
        const scriptPath = path.join(__dirname, '..', '..', 'ml_services', scriptName);

        const python = spawn(pythonPath, [scriptPath, JSON.stringify(params)]);

        let dataString = '';
        let errorString = '';

        python.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                console.error('Python script error:', errorString);
                reject(new Error(`Python script exited with code ${code}: ${errorString}`));
                return;
            }

            try {
                const result = JSON.parse(dataString);
                resolve(result);
            } catch (err) {
                console.error('Failed to parse Python output:', dataString);
                reject(new Error('Invalid JSON from Python service'));
            }
        });
    });
}

// @route   POST /api/forecast/demand-supply
// @desc    Get demand-supply predictions for a crop
// @access  Public
router.post('/demand-supply', async (req, res) => {
    try {
        const { crop, region, months = 6 } = req.body;

        if (!crop || !region) {
            return res.status(400).json({
                status: 'error',
                error: 'Crop and region are required'
            });
        }

        const cacheKey = `demand-supply-${crop}-${region}-${months}`;

        // Check cache
        if (predictionCache.has(cacheKey)) {
            const cached = predictionCache.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_TTL) {
                return res.json({
                    status: 'ok',
                    data: cached.data,
                    cached: true
                });
            }
        }

        // Call Python ML service
        const predictions = await callPythonService('forecast_api.py', {
            type: 'demand_supply',
            crop,
            region,
            months
        });

        // Cache the result
        predictionCache.set(cacheKey, {
            data: predictions,
            timestamp: Date.now()
        });

        res.json({
            status: 'ok',
            data: predictions,
            cached: false
        });

    } catch (err) {
        console.error('Demand-supply forecast error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to generate demand-supply forecast'
        });
    }
});

// @route   POST /api/forecast/price
// @desc    Get price predictions for a crop
// @access  Public
router.post('/price', async (req, res) => {
    try {
        const { crop, region, months = 6 } = req.body;

        if (!crop || !region) {
            return res.status(400).json({
                status: 'error',
                error: 'Crop and region are required'
            });
        }

        const cacheKey = `price-${crop}-${region}-${months}`;

        // Check cache
        if (predictionCache.has(cacheKey)) {
            const cached = predictionCache.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_TTL) {
                return res.json({
                    status: 'ok',
                    data: cached.data,
                    cached: true
                });
            }
        }

        // Call Python ML service
        const predictions = await callPythonService('forecast_api.py', {
            type: 'price',
            crop,
            region,
            months
        });

        // Cache the result
        predictionCache.set(cacheKey, {
            data: predictions,
            timestamp: Date.now()
        });

        res.json({
            status: 'ok',
            data: predictions,
            cached: false
        });

    } catch (err) {
        console.error('Price forecast error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to generate price forecast'
        });
    }
});

// @route   POST /api/forecast/comprehensive
// @desc    Get comprehensive predictions (demand, supply, price, yield)
// @access  Public
router.post('/comprehensive', async (req, res) => {
    try {
        const { crop, region, area, soilType, irrigation } = req.body;

        if (!crop || !region) {
            return res.status(400).json({
                status: 'error',
                error: 'Crop and region are required'
            });
        }

        const cacheKey = `comprehensive-${crop}-${region}-${area}-${soilType}-${irrigation}`;

        // Check cache
        if (predictionCache.has(cacheKey)) {
            const cached = predictionCache.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_TTL) {
                return res.json({
                    status: 'ok',
                    data: cached.data,
                    cached: true
                });
            }
        }

        // Call Python ML service for comprehensive analysis
        const predictions = await callPythonService('forecast_api.py', {
            type: 'comprehensive',
            crop,
            region,
            area: area || 5,
            soilType: soilType || 'medium',
            irrigation: irrigation || 'rainfed'
        });

        // Cache the result
        predictionCache.set(cacheKey, {
            data: predictions,
            timestamp: Date.now()
        });

        res.json({
            status: 'ok',
            data: predictions,
            cached: false
        });

    } catch (err) {
        console.error('Comprehensive forecast error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to generate comprehensive forecast'
        });
    }
});

// @route   GET /api/forecast/cache/clear
// @desc    Clear prediction cache (admin only)
// @access  Public (should be protected in production)
router.get('/cache/clear', (req, res) => {
    predictionCache.clear();
    res.json({
        status: 'ok',
        message: 'Prediction cache cleared'
    });
});

module.exports = router;
