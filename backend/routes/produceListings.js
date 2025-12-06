// backend/routes/produceListings.js
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/produceListings.json');

// Helper function to read data
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading produce listings:', error);
        return { produceListings: [] };
    }
}

// Helper function to write data
async function writeData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing produce listings:', error);
        return false;
    }
}

// GET /api/produce-listings - Get all produce listings
router.get('/', async (req, res) => {
    try {
        const data = await readData();
        const { userId, status } = req.query;

        let listings = data.produceListings;

        // Filter by userId if provided
        if (userId) {
            listings = listings.filter(listing => listing.userId === userId);
        }

        // Filter by status if provided
        if (status) {
            listings = listings.filter(listing => listing.status === status);
        }

        res.json({ success: true, listings });
    } catch (error) {
        console.error('Error fetching produce listings:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch produce listings' });
    }
});

// GET /api/produce-listings/:id - Get a single produce listing
router.get('/:id', async (req, res) => {
    try {
        const data = await readData();
        const listing = data.produceListings.find(l => l.id === parseInt(req.params.id));

        if (!listing) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        res.json({ success: true, listing });
    } catch (error) {
        console.error('Error fetching produce listing:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch produce listing' });
    }
});

// POST /api/produce-listings - Create a new produce listing
router.post('/', async (req, res) => {
    try {
        const data = await readData();

        // Generate new ID
        const newId = data.produceListings.length > 0
            ? Math.max(...data.produceListings.map(l => l.id)) + 1
            : 1;

        const newListing = {
            id: newId,
            userId: req.body.userId || 'farmer1', // Default user for demo
            crop: req.body.crop,
            quantity: parseFloat(req.body.quantity),
            pricePerQuintal: parseFloat(req.body.pricePerQuintal),
            quality: req.body.quality,
            availableFrom: req.body.availableFrom,
            deliveryPreference: req.body.deliveryPreference,
            targetBuyers: req.body.targetBuyers,
            status: 'active',
            listedDate: new Date().toISOString().split('T')[0],
            notes: req.body.notes || ''
        };

        data.produceListings.push(newListing);

        const success = await writeData(data);

        if (success) {
            res.status(201).json({ success: true, listing: newListing });
        } else {
            res.status(500).json({ success: false, error: 'Failed to save listing' });
        }
    } catch (error) {
        console.error('Error creating produce listing:', error);
        res.status(500).json({ success: false, error: 'Failed to create produce listing' });
    }
});

// PUT /api/produce-listings/:id - Update a produce listing
router.put('/:id', async (req, res) => {
    try {
        const data = await readData();
        const index = data.produceListings.findIndex(l => l.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        // Update listing
        data.produceListings[index] = {
            ...data.produceListings[index],
            ...req.body,
            id: parseInt(req.params.id) // Ensure ID doesn't change
        };

        const success = await writeData(data);

        if (success) {
            res.json({ success: true, listing: data.produceListings[index] });
        } else {
            res.status(500).json({ success: false, error: 'Failed to update listing' });
        }
    } catch (error) {
        console.error('Error updating produce listing:', error);
        res.status(500).json({ success: false, error: 'Failed to update produce listing' });
    }
});

// PATCH /api/produce-listings/:id/status - Update listing status (mark as sold)
router.patch('/:id/status', async (req, res) => {
    try {
        const data = await readData();
        const index = data.produceListings.findIndex(l => l.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        data.produceListings[index].status = req.body.status || 'sold';

        const success = await writeData(data);

        if (success) {
            res.json({ success: true, listing: data.produceListings[index] });
        } else {
            res.status(500).json({ success: false, error: 'Failed to update status' });
        }
    } catch (error) {
        console.error('Error updating listing status:', error);
        res.status(500).json({ success: false, error: 'Failed to update listing status' });
    }
});

// DELETE /api/produce-listings/:id - Delete a produce listing
router.delete('/:id', async (req, res) => {
    try {
        const data = await readData();
        const index = data.produceListings.findIndex(l => l.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }

        const deletedListing = data.produceListings.splice(index, 1)[0];

        const success = await writeData(data);

        if (success) {
            res.json({ success: true, listing: deletedListing });
        } else {
            res.status(500).json({ success: false, error: 'Failed to delete listing' });
        }
    } catch (error) {
        console.error('Error deleting produce listing:', error);
        res.status(500).json({ success: false, error: 'Failed to delete produce listing' });
    }
});

module.exports = router;
