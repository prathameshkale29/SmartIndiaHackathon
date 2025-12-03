// backend/routes/weather.js
// Weather API integration for real-time weather data and alerts

const express = require('express');
const router = express.Router();

// Cache for weather data (15 minute TTL)
const weatherCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch weather data from OpenWeatherMap API
 * For demo purposes, we'll use mock data with realistic patterns
 * In production, replace with actual API calls
 */
async function fetchWeatherData(lat, lon, apiKey) {
    // For SIH demo, generate realistic mock data
    // In production: const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const mockData = {
        current: {
            temp: Math.round(25 + Math.random() * 10),
            feels_like: Math.round(26 + Math.random() * 10),
            humidity: Math.round(60 + Math.random() * 30),
            wind_speed: Math.round(5 + Math.random() * 10),
            weather: [
                {
                    main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
                    description: 'scattered clouds',
                    icon: '02d'
                }
            ],
            uvi: Math.round(Math.random() * 10)
        },
        daily: Array.from({ length: 7 }, (_, i) => ({
            dt: Date.now() / 1000 + i * 86400,
            temp: {
                day: Math.round(28 + Math.random() * 8),
                min: Math.round(18 + Math.random() * 5),
                max: Math.round(32 + Math.random() * 5)
            },
            humidity: Math.round(55 + Math.random() * 35),
            wind_speed: Math.round(4 + Math.random() * 8),
            pop: Math.random() * 0.8, // Probability of precipitation
            rain: Math.random() > 0.7 ? Math.round(Math.random() * 50) : 0,
            weather: [
                {
                    main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
                    description: 'partly cloudy'
                }
            ]
        }))
    };

    return mockData;
}

/**
 * Generate agricultural weather alerts based on conditions
 */
function generateAgriAlerts(weatherData) {
    const alerts = [];
    const current = weatherData.current;
    const forecast = weatherData.daily[0];

    // Temperature alerts
    if (current.temp > 38) {
        alerts.push({
            severity: 'high',
            type: 'heat_stress',
            message: 'Extreme heat alert - Provide adequate irrigation and mulching',
            icon: '🌡️'
        });
    }

    // Rain alerts
    if (forecast.rain > 50) {
        alerts.push({
            severity: 'high',
            type: 'heavy_rain',
            message: 'Heavy rainfall expected - Avoid fertilizer/pesticide application',
            icon: '🌧️'
        });
    } else if (forecast.rain > 20 && forecast.rain <= 50) {
        alerts.push({
            severity: 'medium',
            type: 'moderate_rain',
            message: 'Moderate rainfall expected - Plan field operations accordingly',
            icon: '🌦️'
        });
    }

    // Wind alerts
    if (current.wind_speed > 15) {
        alerts.push({
            severity: 'medium',
            type: 'high_wind',
            message: 'High wind speed - Avoid spraying operations',
            icon: '💨'
        });
    }

    // Humidity + Rain = Disease risk
    if (current.humidity > 80 && forecast.rain > 0) {
        alerts.push({
            severity: 'high',
            type: 'disease_risk',
            message: 'High humidity with rainfall - Monitor for fungal diseases',
            icon: '🍄'
        });
    }

    // UV index
    if (current.uvi > 8) {
        alerts.push({
            severity: 'low',
            type: 'high_uv',
            message: 'High UV index - Ensure worker safety during field operations',
            icon: '☀️'
        });
    }

    if (alerts.length === 0) {
        alerts.push({
            severity: 'low',
            type: 'normal',
            message: 'No major weather risks - Normal field operations can continue',
            icon: '✅'
        });
    }

    return alerts;
}

// @route   GET /api/weather/current
// @desc    Get current weather for a location
// @access  Public
router.get('/current', async (req, res) => {
    try {
        const { lat, lon, location } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                status: 'error',
                error: 'Latitude and longitude are required'
            });
        }

        const cacheKey = `current-${lat}-${lon}`;

        // Check cache
        if (weatherCache.has(cacheKey)) {
            const cached = weatherCache.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_TTL) {
                return res.json({
                    status: 'ok',
                    data: cached.data,
                    cached: true
                });
            }
        }

        // Fetch weather data
        const apiKey = process.env.OPENWEATHER_API_KEY || 'demo';
        const weatherData = await fetchWeatherData(lat, lon, apiKey);

        // Generate agricultural alerts
        const alerts = generateAgriAlerts(weatherData);

        const response = {
            location: location || `${lat}, ${lon}`,
            current: weatherData.current,
            alerts: alerts,
            timestamp: new Date().toISOString()
        };

        // Cache the result
        weatherCache.set(cacheKey, {
            data: response,
            timestamp: Date.now()
        });

        res.json({
            status: 'ok',
            data: response,
            cached: false
        });

    } catch (err) {
        console.error('Weather API error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to fetch weather data'
        });
    }
});

// @route   GET /api/weather/forecast
// @desc    Get 7-day weather forecast
// @access  Public
router.get('/forecast', async (req, res) => {
    try {
        const { lat, lon, location } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                status: 'error',
                error: 'Latitude and longitude are required'
            });
        }

        const cacheKey = `forecast-${lat}-${lon}`;

        // Check cache
        if (weatherCache.has(cacheKey)) {
            const cached = weatherCache.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_TTL) {
                return res.json({
                    status: 'ok',
                    data: cached.data,
                    cached: true
                });
            }
        }

        // Fetch weather data
        const apiKey = process.env.OPENWEATHER_API_KEY || 'demo';
        const weatherData = await fetchWeatherData(lat, lon, apiKey);

        const response = {
            location: location || `${lat}, ${lon}`,
            forecast: weatherData.daily.map(day => ({
                date: new Date(day.dt * 1000).toLocaleDateString('en-IN'),
                temp_max: day.temp.max,
                temp_min: day.temp.min,
                humidity: day.humidity,
                wind_speed: day.wind_speed,
                rain_probability: Math.round(day.pop * 100),
                rain_mm: day.rain || 0,
                condition: day.weather[0].main,
                description: day.weather[0].description
            })),
            timestamp: new Date().toISOString()
        };

        // Cache the result
        weatherCache.set(cacheKey, {
            data: response,
            timestamp: Date.now()
        });

        res.json({
            status: 'ok',
            data: response,
            cached: false
        });

    } catch (err) {
        console.error('Weather forecast error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to fetch weather forecast'
        });
    }
});

// @route   GET /api/weather/alerts
// @desc    Get agricultural weather alerts
// @access  Public
router.get('/alerts', async (req, res) => {
    try {
        const { lat, lon, location } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                status: 'error',
                error: 'Latitude and longitude are required'
            });
        }

        // Fetch weather data
        const apiKey = process.env.OPENWEATHER_API_KEY || 'demo';
        const weatherData = await fetchWeatherData(lat, lon, apiKey);

        // Generate alerts
        const alerts = generateAgriAlerts(weatherData);

        res.json({
            status: 'ok',
            data: {
                location: location || `${lat}, ${lon}`,
                alerts: alerts,
                timestamp: new Date().toISOString()
            }
        });

    } catch (err) {
        console.error('Weather alerts error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to fetch weather alerts'
        });
    }
});

// @route   GET /api/weather/cache/clear
// @desc    Clear weather cache
// @access  Public (should be protected in production)
router.get('/cache/clear', (req, res) => {
    weatherCache.clear();
    res.json({
        status: 'ok',
        message: 'Weather cache cleared'
    });
});

module.exports = router;
