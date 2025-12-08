
// Mock API Service for Agri-Sync Dashboard
// Simulates backend calls with localStorage persistence for "Fully Working" demo.

class MockApiService {
    constructor() {
        this.LATENCY = 600; // Simulated network delay in ms
        this.STORAGE_KEYS = {
            USERS: 'agrisync_users',
            PROCUREMENT: 'agrisync_procurement',
            INVENTORY: 'agrisync_inventory',
            CONTRACTS: 'agrisync_contracts',
            MARKET: 'agrisync_market',
            ALERTS: 'agrisync_alerts',
            TRACEABILITY: 'agrisync_traceability',
            ORDERS: 'agrisync_orders'
        };
        this.initData();
    }

    // Initialize simulated database
    initData() {
        if (!localStorage.getItem(this.STORAGE_KEYS.PROCUREMENT)) {
            const initialProcurement = [
                { id: 'PR-101', farmer: "Ramesh Kumar", crop: "Soybean", quantity: 15, quality: "Pending", date: "2024-12-07", status: "Pending", contact: "9876543210" },
                { id: 'PR-102', farmer: "Suresh Patel", crop: "Groundnut", quantity: 22, quality: "Grade A", date: "2024-12-06", status: "Verified", contact: "9876543211" },
                { id: 'PR-103', farmer: "Mahesh Singh", crop: "Mustard", quantity: 10, quality: "Pending", date: "2024-12-08", status: "Pending", contact: "9876543212" },
            ];
            localStorage.setItem(this.STORAGE_KEYS.PROCUREMENT, JSON.stringify(initialProcurement));
        }

        if (!localStorage.getItem(this.STORAGE_KEYS.INVENTORY)) {
            const initialInventory = [
                { id: 1, item: "Soybean (Raw)", quantity: 120, unit: "MT", batch: "BATCH-2024-001", location: "Warehouse A", type: "Raw Material" },
                { id: 2, item: "Groundnut (Raw)", quantity: 85, unit: "MT", batch: "BATCH-2024-002", location: "Warehouse B", type: "Raw Material" },
                { id: 3, item: "Soybean Oil (Processed)", quantity: 5000, unit: "L", batch: "PROC-2024-X1", location: "Cold Storage", type: "Processed" }
            ];
            localStorage.setItem(this.STORAGE_KEYS.INVENTORY, JSON.stringify(initialInventory));
        }

        if (!localStorage.getItem(this.STORAGE_KEYS.MARKET)) {
            // Initial market prices
            const marketData = [
                { id: 1, commodity: "Soybean", price: 4200, change: 2.5, trend: "up" },
                { id: 2, commodity: "Groundnut", price: 5800, change: -1.2, trend: "down" },
                { id: 3, commodity: "Mustard", price: 5100, change: 0.8, trend: "stable" }
            ];
            localStorage.setItem(this.STORAGE_KEYS.MARKET, JSON.stringify(marketData));
        }

        if (!localStorage.getItem(this.STORAGE_KEYS.CONTRACTS)) {
            const initialContracts = [
                { id: "C-2024-001", party: "Organic Foods Ltd", type: "Sale", item: "Soybean", quantity: "50 MT", status: "Active", deadline: "2024-12-20" },
                { id: "C-2024-002", party: "Ramesh Kumar (Farmer)", type: "Purchase", item: "Groundnut", quantity: "10 MT", status: "Completed", deadline: "2024-11-25" }
            ];
            localStorage.setItem(this.STORAGE_KEYS.CONTRACTS, JSON.stringify(initialContracts));
        }
    }

    // Helper to simulate async delay
    async _delay(data) {
        return new Promise(resolve => setTimeout(() => resolve(data), this.LATENCY));
    }

    // --- FPO APIs ---

    // 1. Get Procurement Requests
    async getProcurementRequests() {
        const data = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PROCUREMENT) || '[]');
        return this._delay(data);
    }

    // 2. Verify Collection (Quality Check)
    // Action: Updates status, sets quality grade, and moves to Inventory if approved
    async verifyCollection(id, qualityData) {
        let requests = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PROCUREMENT) || '[]');
        let updatedItem = null;

        requests = requests.map(req => {
            if (req.id === id) {
                // Determine Grade based on mock logic
                let grade = "Grade C";
                if (qualityData.moisture < 12 && qualityData.oilContent > 18) grade = "Grade A";
                else if (qualityData.moisture < 14) grade = "Grade B";

                updatedItem = { ...req, status: 'Verified', quality: grade, qualityDetails: qualityData };
                return updatedItem;
            }
            return req;
        });

        localStorage.setItem(this.STORAGE_KEYS.PROCUREMENT, JSON.stringify(requests));

        // If verified, add to inventory automatically for demo effect
        if (updatedItem) {
            this._addToInventory({
                item: `${updatedItem.crop} (Raw)`,
                quantity: updatedItem.quantity,
                unit: "Quintal", // Assuming quintal for procurement
                batch: `BATCH-${id}`,
                location: "Warehouse Inbound",
                type: "Raw Material"
            });
        }

        return this._delay({ success: true, data: updatedItem });
    }

    async rejectCollection(id, reason) {
        let requests = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PROCUREMENT) || '[]');
        requests = requests.map(req => req.id === id ? { ...req, status: 'Rejected', rejectionReason: reason } : req);
        localStorage.setItem(this.STORAGE_KEYS.PROCUREMENT, JSON.stringify(requests));
        return this._delay({ success: true, id });
    }

    // 3. Inventory APIs
    async getInventory() {
        const data = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.INVENTORY) || '[]');
        return this._delay(data);
    }

    _addToInventory(newItem) {
        const inventory = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.INVENTORY) || '[]');
        // Simple logic: add as new line item. Real app would aggregate.
        newItem.id = Date.now();
        inventory.push(newItem);
        localStorage.setItem(this.STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    }

    // 4. Market / Demand APIs
    async getMarketPrices() {
        const data = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.MARKET) || '[]');
        // Simulate live fluctuation
        const fluctuated = data.map(item => ({
            ...item,
            price: Math.floor(item.price * (1 + (Math.random() * 0.02 - 0.01))) // +/- 1%
        }));
        return this._delay(fluctuated);
    }

    // 5. Contracts APIs
    async getContracts() {
        const data = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CONTRACTS) || '[]');
        return this._delay(data);
    }

    async createContract(contractData) {
        const contracts = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CONTRACTS) || '[]');
        const newContract = { ...contractData, id: `C-${Date.now()}`, status: 'Pending' };
        contracts.push(newContract);
        localStorage.setItem(this.STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
        return this._delay(newContract);
    }

    // 6. Traceability API
    async getTraceabilityData(batchId) {
        // Return mock blockchain journey
        const mockJourney = {
            batchId: batchId || "BATCH-XYZ-123",
            product: "Organic Soybean Oil",
            origin: "Ratlam FPO, MP",
            stages: [
                { stage: "Harvest", date: "2024-11-01", location: "Farm #42", status: "Completed", hash: "0x7f...3a" },
                { stage: "Procurement", date: "2024-11-05", location: "Ratlam Mandi", status: "Completed", hash: "0x8b...4c" },
                { stage: "Quality Check", date: "2024-11-06", result: "Grade A (Oil 19%)", status: "Verified", hash: "0x9c...5d" },
                { stage: "Processing", date: "2024-11-10", location: "Gujarat Oil Mills", status: "Completed", hash: "0x1d...6e" },
                { stage: "Packaging", date: "2024-11-12", type: "1L Bottle", status: "Completed", hash: "0x2e...7f" },
                { stage: "Retail Dispatch", date: "2024-11-15", dest: "Mumbai Retail", status: "In Transit", hash: "0x3f...8g" }
            ]
        };
        return this._delay(mockJourney);
    }
    // 7. Logistics API
    async getShipments() {
        // ... (existing code)
        // Initialize if empty
        if (!localStorage.getItem('agrisync_logistics')) {
            const initialShipments = [
                { id: 'TRK-8921', dest: 'Mumbai Central', status: 'In Transit', eta: '4h 30m', driver: 'Rajesh Singh', cargo: 'Soybean (20MT)', progress: 65, origin: 'Nashik', quantity: 20, unit: 'MT', item: 'Soybean' },
                { id: 'TRK-8922', dest: 'FPO Warehouse B', status: 'Arrived', eta: '-', driver: 'Sunil Kumar', cargo: 'Mustard Seeds (15MT)', progress: 100, origin: 'Nagpur', quantity: 15, unit: 'MT', item: 'Mustard' },
                { id: 'TRK-8925', dest: 'Processing Unit A', status: 'Delayed', eta: '1h 15m', driver: 'Amit Verma', cargo: 'Groundnut (18MT)', progress: 40, origin: 'Amravati', quantity: 18, unit: 'MT', item: 'Groundnut' },
            ];
            localStorage.setItem('agrisync_logistics', JSON.stringify(initialShipments));
        }

        const data = JSON.parse(localStorage.getItem('agrisync_logistics') || '[]');
        return this._delay(data);
    }

    // ... (Logistics methods)

    // 8. Bidding API
    async placeBid(listingId, bidData) {
        const bids = JSON.parse(localStorage.getItem('agrisync_bids') || '{}');
        if (!bids[listingId]) bids[listingId] = [];

        const newBid = {
            id: `BID-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'Pending',
            ...bidData
        };

        bids[listingId].push(newBid);
        // Sort highest first
        bids[listingId].sort((a, b) => b.amount - a.amount);

        localStorage.setItem('agrisync_bids', JSON.stringify(bids));
        return this._delay({ success: true, data: newBid });
    }

    async getBids(listingId) {
        const bids = JSON.parse(localStorage.getItem('agrisync_bids') || '{}');
        return this._delay(bids[listingId] || []);
    }

    async dispatchShipment(shipmentData) {
        const shipments = JSON.parse(localStorage.getItem('agrisync_logistics') || '[]');
        const newShipment = {
            id: `TRK-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'In Transit',
            progress: 0,
            eta: 'Calculating...',
            ...shipmentData
        };
        shipments.unshift(newShipment); // Add to top
        localStorage.setItem('agrisync_logistics', JSON.stringify(shipments));
        return this._delay({ success: true, data: newShipment });
    }

    async updateShipmentStatus(id, newStatus) {
        let shipments = JSON.parse(localStorage.getItem('agrisync_logistics') || '[]');
        let targetShipment = null;

        shipments = shipments.map(s => {
            if (s.id === id) {
                targetShipment = { ...s, status: newStatus };
                if (newStatus === 'Arrived') targetShipment.progress = 100;
                return targetShipment;
            }
            return s;
        });
        localStorage.setItem('agrisync_logistics', JSON.stringify(shipments));

        // UNIFIED SYNC: If Arrived, Auto-Add to Inventory at Destination
        if (targetShipment && newStatus === 'Arrived') {
            this._addToInventory({
                item: targetShipment.item || targetShipment.cargo,
                quantity: targetShipment.quantity || 0,
                unit: targetShipment.unit || 'MT',
                batch: `RECV-${targetShipment.id}`,
                location: targetShipment.dest || 'General Warehouse',
                type: 'Received Shipment'
            });
        }

        return this._delay({ success: true, data: targetShipment });
    }

    // 9. Input Market API (Fertilizers/Seeds)
    async getInputPrices(category = 'Fertilizer') {
        const vendorData = [
            { id: 1, name: "AgriCo Inputs", product: "Urea (Neem Coated)", price: 266, unit: "45kg Bag", dist: "2km", rating: 4.5 },
            { id: 2, name: "Kisan Seva Kendra", product: "Urea (Neem Coated)", price: 262, unit: "45kg Bag", dist: "5km", rating: 4.8 },
            { id: 3, name: "National Fertilizers", product: "DAP", price: 1350, unit: "50kg Bag", dist: "12km", rating: 4.2 },
            { id: 4, name: "Jai Kisan Store", product: "DAP", price: 1380, unit: "50kg Bag", dist: "1km", rating: 4.0 },
            { id: 5, name: "AgriCo Inputs", product: "NPK 10:26:26", price: 1450, unit: "50kg Bag", dist: "2km", rating: 4.5 },
            { id: 6, name: "Kisan Seva Kendra", product: "MOP (Potash)", price: 1700, unit: "50kg Bag", dist: "5km", rating: 4.8 },
        ];
        return this._delay(vendorData);
    }

    // 10. AI Fertilizer Predictor
    async predictFertilizer(criteria) {
        // Mock AI Logic based on Crop & Soil
        const { crop, soil, stage, acres } = criteria;
        let recommendation = [];
        let note = "";

        if (crop === 'Soybean') {
            recommendation = [
                { product: "DAP", quantity: 50 * acres, unit: "kg", reason: "Basal dose for root development" },
                { product: "Sulphur", quantity: 10 * acres, unit: "kg", reason: "Essential for oilseed crops" }
            ];
            note = "Soybean requires low Nitrogen but high Phosphorus.";
        } else if (crop === 'Mustard') {
            recommendation = [
                { product: "Urea (Neem Coated)", quantity: 40 * acres, unit: "kg", reason: "Top dressing at vegetative stage" },
                { product: "NPK 10:26:26", quantity: 30 * acres, unit: "kg", reason: "Balanced nutrition" }
            ];
            note = "Apply Urea in split doses for better efficiency.";
        } else {
            // Default generic
            recommendation = [
                { product: "Urea (Neem Coated)", quantity: 25 * acres, unit: "kg", reason: "General nitrogen requirement" },
                { product: "DAP", quantity: 25 * acres, unit: "kg", reason: "General phosphorus requirement" }
            ];
            note = "Standard recommendation due to unspecified crop type.";
        }

        return this._delay({
            recommendation,
            note,
            soilAnalysis: `Detected ${soil} soil profile. Adjusted dosage accordingly.`,
            confidence: "94%"
        });
    }
}

// Export global instance
window.MockApiService = new MockApiService();
