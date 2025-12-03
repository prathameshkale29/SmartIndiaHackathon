// backend/routes/satellite.js
// Satellite data integration for crop health monitoring (NDVI)

const express = require('express');
const router = express.Router();

// Cache for satellite data (1 hour TTL - satellite data changes slowly)
const satelliteCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Generate mock NDVI data for demo purposes
 * In production, integrate with Sentinel Hub or similar API
 */
function generateNDVIData(lat, lon) {
    // NDVI ranges from -1 to 1
    // Healthy vegetation: 0.6 to 0.9
    // Moderate vegetation: 0.3 to 0.6
    // Sparse vegetation: 0.1 to 0.3
    // No vegetation: -0.1 to 0.1

    const baseNDVI = 0.65 + (Math.random() * 0.2 - 0.1); // 0.55 to 0.75

    return {
        ndvi: parseFloat(baseNDVI.toFixed(3)),
        ndvi_class: baseNDVI > 0.6 ? 'healthy' : (baseNDVI > 0.3 ? 'moderate' : 'stressed'),
        confidence: 0.85 + Math.random() * 0.1
    };
}

/**
 * Generate historical NDVI trend
 */
function generateNDVITrend(currentNDVI) {
    const trend = [];
    let ndvi = currentNDVI - 0.15;

    for (let i = 0; i < 12; i++) {
        // Simulate growth trend
        ndvi += (Math.random() * 0.03 - 0.01);
        ndvi = Math.max(0.2, Math.min(0.85, ndvi));

        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));

        trend.push({
            date: date.toISOString().split('T')[0],
            ndvi: parseFloat(ndvi.toFixed(3))
        });
    }

    return trend;
}

/**
 * Analyze crop health based on NDVI
 */
function analyzeCropHealth(ndviData) {
    const { ndvi, ndvi_class } = ndviData;

    const analysis = {
        health_score: Math.round((ndvi + 1) * 50), // Convert -1 to 1 range to 0-100
        status: ndvi_class,
        recommendations: [],
        alerts: []
    };

    if (ndvi_class === 'healthy') {
        analysis.recommendations.push('Crop health is excellent - maintain current practices');
        analysis.recommendations.push('Continue regular monitoring');
    } else if (ndvi_class === 'moderate') {
        analysis.recommendations.push('Moderate vegetation stress detected');
        analysis.recommendations.push('Check soil moisture levels');
        analysis.recommendations.push('Consider supplemental irrigation if available');
        analysis.alerts.push({
            severity: 'medium',
            message: 'Vegetation index below optimal - investigate possible causes'
        });
    } else {
        analysis.recommendations.push('Significant vegetation stress detected');
        analysis.recommendations.push('Immediate field inspection recommended');
        analysis.recommendations.push('Check for pest/disease issues, water stress, or nutrient deficiency');
        analysis.alerts.push({
            severity: 'high',
            message: 'Critical vegetation stress - immediate action required'
        });
    }

    return analysis;
}

// @route   GET /api/satellite/ndvi
// @desc    Get NDVI data for a location
// @access  Public
router.get('/ndvi', async (req, res) => {
    try {
        const { lat, lon, location } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                status: 'error',
                error: 'Latitude and longitude are required'
            });
        }

        const cacheKey = `ndvi-${lat}-${lon}`;

        // Check cache
        if (satelliteCache.has(cacheKey)) {
            const cached = satelliteCache.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_TTL) {
                return res.json({
                    status: 'ok',
                    data: cached.data,
                    cached: true
                });
            }
        }

        // Generate NDVI data (in production, call Sentinel Hub API)
        const ndviData = generateNDVIData(lat, lon);
        const trend = generateNDVITrend(ndviData.ndvi);
        const analysis = analyzeCropHealth(ndviData);

        const response = {
            location: location || `${lat}, ${lon}`,
            coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
            ndvi: ndviData.ndvi,
            ndvi_class: ndviData.ndvi_class,
            confidence: ndviData.confidence,
            health_score: analysis.health_score,
            status: analysis.status,
            trend: trend,
            analysis: {
                recommendations: analysis.recommendations,
                alerts: analysis.alerts
            },
            acquisition_date: new Date().toISOString().split('T')[0],
            satellite: 'Sentinel-2 (Demo)',
            resolution: '10m'
        };

        // Cache the result
        satelliteCache.set(cacheKey, {
            data: response,
            timestamp: Date.now()
        });

        res.json({
            status: 'ok',
            data: response,
            cached: false
        });

    } catch (err) {
        console.error('Satellite NDVI error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to fetch NDVI data'
        });
    }
});

// @route   GET /api/satellite/crop-health
// @desc    Get comprehensive crop health analysis
// @access  Public
router.get('/crop-health', async (req, res) => {
    try {
        const { lat, lon, location, crop } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                status: 'error',
                error: 'Latitude and longitude are required'
            });
        }

        // Generate NDVI data
        const ndviData = generateNDVIData(lat, lon);
        const analysis = analyzeCropHealth(ndviData);

        // Add crop-specific insights
        const cropInsights = {
            mustard: {
                critical_stages: ['Flowering', 'Pod formation'],
                optimal_ndvi: 0.7,
                water_requirement: 'Moderate'
            },
            soybean: {
                critical_stages: ['Flowering', 'Pod filling'],
                optimal_ndvi: 0.75,
                water_requirement: 'High'
            },
            groundnut: {
                critical_stages: ['Pegging', 'Pod development'],
                optimal_ndvi: 0.72,
                water_requirement: 'Moderate to High'
            }
        };

        const cropType = (crop || 'mustard').toLowerCase();
        const insights = cropInsights[cropType] || cropInsights.mustard;

        res.json({
            status: 'ok',
            data: {
                location: location || `${lat}, ${lon}`,
                crop: cropType,
                ndvi: ndviData.ndvi,
                health_score: analysis.health_score,
                status: analysis.status,
                optimal_ndvi: insights.optimal_ndvi,
                deviation: parseFloat((ndviData.ndvi - insights.optimal_ndvi).toFixed(3)),
                critical_stages: insights.critical_stages,
                water_requirement: insights.water_requirement,
                recommendations: analysis.recommendations,
                alerts: analysis.alerts,
                timestamp: new Date().toISOString()
            }
        });

    } catch (err) {
        console.error('Crop health analysis error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to analyze crop health'
        });
    }
});

// @route   GET /api/satellite/cache/clear
// @desc    Clear satellite cache
// @access  Public (should be protected in production)
router.get('/cache/clear', (req, res) => {
    satelliteCache.clear();
    res.json({
        status: 'ok',
        message: 'Satellite cache cleared'
    });
});

module.exports = router;
