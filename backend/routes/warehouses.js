const express = require('express');
const router = express.Router();
const Warehouse = require('../models/Warehouse');

// @route   GET /api/warehouses
// @desc    Get all warehouses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const warehouses = await Warehouse.find().sort({ createdAt: -1 });
        res.json(warehouses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/warehouses
// @desc    Create a warehouse
// @access  Public (for demo)
router.post('/', async (req, res) => {
    const { name, location, capacity, currentStock, commodities, manager, contact } = req.body;

    try {
        const newWarehouse = new Warehouse({
            name,
            location,
            capacity,
            currentStock,
            commodities,
            manager,
            contact
        });

        const warehouse = await newWarehouse.save();
        res.json(warehouse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/warehouses/seed
// @desc    Seed initial data
// @access  Public
router.get('/seed', async (req, res) => {
    try {
        const count = await Warehouse.countDocuments();
        if (count > 0) {
            return res.json({ msg: 'Warehouses already exist' });
        }

        const seedData = [
            {
                name: 'Central Warehouse A',
                location: 'Nagpur, Maharashtra',
                capacity: 5000,
                currentStock: 3200,
                commodities: ['Soyabean', 'Cotton'],
                manager: 'Rajesh Kumar',
                contact: '9876543210'
            },
            {
                name: 'North Warehouse B',
                location: 'Jaipur, Rajasthan',
                capacity: 4500,
                currentStock: 2800,
                commodities: ['Mustard', 'Wheat'],
                manager: 'Suresh Singh',
                contact: '9876543211'
            },
            {
                name: 'West Warehouse C',
                location: 'Rajkot, Gujarat',
                capacity: 6000,
                currentStock: 4100,
                commodities: ['Groundnut', 'Cotton'],
                manager: 'Amit Patel',
                contact: '9876543212'
            }
        ];

        await Warehouse.insertMany(seedData);
        res.json({ msg: 'Seed data added', data: seedData });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
