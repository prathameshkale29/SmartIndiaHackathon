const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const User = require('../models/User'); // Required for middleware check if needed
const jwt = require('jsonwebtoken');

// Middleware to protect routes (Duplicate from users.js - consider moving to utils/authMiddleware.js)
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

// @route   GET /api/listings
// @desc    Get all listings (with filters)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        // Build query
        const query = { status: 'active' };
        if (req.query.keyword) {
            query.$or = [
                { description: { $regex: req.query.keyword, $options: 'i' } },
                // Add product name lookup complexity if needed, or rely on simple text for now
            ];
        }

        // Handle location search or other filters here

        const count = await Listing.countDocuments(query);
        constlistings = await Listing.find(query)
            .populate('product', 'name category')
            .populate('seller', 'name profile.city')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ listings: constlistings, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/listings
// @desc    Create a listing
// @access  Private
router.post('/', protect, async (req, res) => {
    const { product, quantity, unit, pricePerUnit, location, description } = req.body;

    try {
        const listing = new Listing({
            seller: req.user._id,
            product,
            quantity,
            unit,
            pricePerUnit,
            location,
            description
        });

        const createdListing = await listing.save();
        res.status(201).json(createdListing);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET /api/listings/:id
// @desc    Get listing by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('product')
            .populate('seller', 'name email profile');

        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ error: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
