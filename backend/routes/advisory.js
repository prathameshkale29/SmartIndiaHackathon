const express = require('express');
const router = express.Router();
const Advisory = require('../models/Advisory');

// @route   GET /api/advisory
// @desc    Get advisory content
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { type, crop, state } = req.query;
        let query = {};

        if (type) query.type = type;
        if (crop) query.targetCrops = crop;
        if (state) query.targetStates = state;

        const advisories = await Advisory.find(query).sort({ createdAt: -1 });
        res.json(advisories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/advisory
// @desc    Create advisory (Admin only usually, simplifying for hackathon)
// @access  Public (should be Private/Admin)
router.post('/', async (req, res) => {
    try {
        const advisory = new Advisory(req.body);
        const createdAdvisory = await advisory.save();
        res.status(201).json(createdAdvisory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
