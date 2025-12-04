// backend/routes/procurement.js
const express = require('express');
const router = express.Router();

// Mock database - in production, use MongoDB models
let tenders = [
    {
        id: 'TEND001',
        title: 'Procurement of Mustard Seeds - 500 MT',
        organization: 'National Agricultural Cooperative Marketing Federation (NAFED)',
        category: 'Oilseeds',
        quantity: 500,
        unit: 'MT',
        estimatedValue: 35000000,
        publishDate: '2025-01-10',
        closingDate: '2025-02-15',
        status: 'Open',
        location: 'Maharashtra',
        description: 'Procurement of high-quality mustard seeds for government buffer stock',
        specifications: {
            oilContent: 'Min 40%',
            moisture: 'Max 8%',
            foreignMatter: 'Max 2%'
        },
        bidCount: 12
    },
    {
        id: 'TEND002',
        title: 'Supply of Soybean - 1000 MT',
        organization: 'Food Corporation of India (FCI)',
        category: 'Oilseeds',
        quantity: 1000,
        unit: 'MT',
        estimatedValue: 58000000,
        publishDate: '2025-01-15',
        closingDate: '2025-02-20',
        status: 'Open',
        location: 'Madhya Pradesh',
        description: 'Bulk procurement of soybean for distribution under government schemes',
        specifications: {
            proteinContent: 'Min 38%',
            moisture: 'Max 10%'
        },
        bidCount: 8
    },
    {
        id: 'TEND003',
        title: 'Groundnut Procurement - 300 MT',
        organization: 'State Agricultural Marketing Board',
        category: 'Oilseeds',
        quantity: 300,
        unit: 'MT',
        estimatedValue: 24000000,
        publishDate: '2025-01-05',
        closingDate: '2025-02-10',
        status: 'Closing Soon',
        location: 'Gujarat',
        description: 'Procurement of groundnut kernels for oil extraction',
        specifications: {
            oilContent: 'Min 48%',
            moisture: 'Max 7%'
        },
        bidCount: 15
    }
];

let bids = [
    {
        id: 'BID001',
        tenderId: 'TEND001',
        userId: 'user123',
        bidAmount: 34500000,
        quantity: 500,
        unit: 'MT',
        deliveryTimeline: 30,
        bidDate: '2025-01-20',
        status: 'Submitted',
        notes: 'Can deliver high-quality mustard seeds as per specifications'
    }
];

// @route   GET /api/procurement/dashboard
// @desc    Get procurement dashboard statistics
// @access  Public
router.get('/dashboard', (req, res) => {
    try {
        const stats = {
            totalTenders: tenders.length,
            activeTenders: tenders.filter(t => t.status === 'Open').length,
            closingSoon: tenders.filter(t => t.status === 'Closing Soon').length,
            myBids: bids.length,
            totalValue: tenders.reduce((sum, t) => sum + t.estimatedValue, 0),
            categories: {
                'Oilseeds': tenders.filter(t => t.category === 'Oilseeds').length
            },
            recentActivity: [
                { type: 'tender', message: 'New tender published: Mustard Seeds 500 MT', date: '2025-01-15' },
                { type: 'bid', message: 'Your bid submitted for TEND001', date: '2025-01-20' },
                { type: 'tender', message: 'Tender closing soon: TEND003', date: '2025-01-25' }
            ]
        };

        res.json({
            status: 'ok',
            data: stats
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to fetch dashboard data'
        });
    }
});

// @route   GET /api/procurement/tenders
// @desc    Get all tenders with optional filters
// @access  Public
router.get('/tenders', (req, res) => {
    try {
        const { status, category, location } = req.query;

        let filteredTenders = [...tenders];

        if (status) {
            filteredTenders = filteredTenders.filter(t => t.status === status);
        }
        if (category) {
            filteredTenders = filteredTenders.filter(t => t.category === category);
        }
        if (location) {
            filteredTenders = filteredTenders.filter(t => t.location === location);
        }

        res.json({
            status: 'ok',
            data: filteredTenders
        });
    } catch (err) {
        console.error('Tenders fetch error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to fetch tenders'
        });
    }
});

// @route   GET /api/procurement/tenders/:id
// @desc    Get tender by ID
// @access  Public
router.get('/tenders/:id', (req, res) => {
    try {
        const tender = tenders.find(t => t.id === req.params.id);

        if (!tender) {
            return res.status(404).json({
                status: 'error',
                error: 'Tender not found'
            });
        }

        res.json({
            status: 'ok',
            data: tender
        });
    } catch (err) {
        console.error('Tender fetch error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to fetch tender'
        });
    }
});

// @route   POST /api/procurement/bids
// @desc    Submit a new bid
// @access  Public
router.post('/bids', (req, res) => {
    try {
        const { tenderId, bidAmount, quantity, deliveryTimeline, notes } = req.body;

        if (!tenderId || !bidAmount || !quantity) {
            return res.status(400).json({
                status: 'error',
                error: 'Tender ID, bid amount, and quantity are required'
            });
        }

        const tender = tenders.find(t => t.id === tenderId);
        if (!tender) {
            return res.status(404).json({
                status: 'error',
                error: 'Tender not found'
            });
        }

        const newBid = {
            id: 'BID' + String(Date.now()).substr(-6),
            tenderId,
            userId: 'user123', // In production, get from auth
            bidAmount,
            quantity,
            unit: tender.unit,
            deliveryTimeline: deliveryTimeline || 30,
            bidDate: new Date().toISOString().split('T')[0],
            status: 'Submitted',
            notes: notes || ''
        };

        bids.push(newBid);

        res.json({
            status: 'ok',
            data: newBid,
            message: 'Bid submitted successfully'
        });
    } catch (err) {
        console.error('Bid submission error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to submit bid'
        });
    }
});

// @route   GET /api/procurement/bids
// @desc    Get user's bids
// @access  Public
router.get('/bids', (req, res) => {
    try {
        // In production, filter by authenticated user ID
        const userBids = bids.map(bid => {
            const tender = tenders.find(t => t.id === bid.tenderId);
            return {
                ...bid,
                tenderTitle: tender ? tender.title : 'Unknown Tender'
            };
        });

        res.json({
            status: 'ok',
            data: userBids
        });
    } catch (err) {
        console.error('Bids fetch error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to fetch bids'
        });
    }
});

// @route   GET /api/procurement/analytics
// @desc    Get procurement analytics
// @access  Public
router.get('/analytics', (req, res) => {
    try {
        const analytics = {
            tendersByCategory: {
                'Oilseeds': tenders.filter(t => t.category === 'Oilseeds').length
            },
            tendersByStatus: {
                'Open': tenders.filter(t => t.status === 'Open').length,
                'Closing Soon': tenders.filter(t => t.status === 'Closing Soon').length,
                'Closed': tenders.filter(t => t.status === 'Closed').length
            },
            averageBidValue: bids.length > 0
                ? bids.reduce((sum, b) => sum + b.bidAmount, 0) / bids.length
                : 0,
            totalProcurementValue: tenders.reduce((sum, t) => sum + t.estimatedValue, 0),
            monthlyTrends: [
                { month: 'Jan', tenders: 15, bids: 45 },
                { month: 'Feb', tenders: 12, bids: 38 },
                { month: 'Mar', tenders: 18, bids: 52 }
            ]
        };

        res.json({
            status: 'ok',
            data: analytics
        });
    } catch (err) {
        console.error('Analytics fetch error:', err);
        res.status(500).json({
            status: 'error',
            error: err.message || 'Failed to fetch analytics'
        });
    }
});

module.exports = router;
