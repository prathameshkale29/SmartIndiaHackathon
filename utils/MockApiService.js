// Mock API Service for Agri-Sync Dashboard
// Simulates backend calls with localStorage persistence for "Fully Working" demo.

// --- CONFIGURATION ---
// PASTE YOUR DATA.GOV.IN API KEY HERE
// Get a free key at: https://data.gov.in/
const OGD_API_KEY = '';

class MockApiService {
    constructor() {
        this.LATENCY = 600; // Simulated network delay in ms
        this.STORAGE_KEYS = {
            USERS: 'agrisync_users',
            PROCUREMENT: 'agrisync_procurement',
            INVENTORY: 'agrisync_inventory',
            CONTRACTS: 'agrisync_contracts',
            MARKET: 'agrisync_market_v5', // Versioned to force update
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
            // Comprehensive List of Indian States & UTs for Demo
            const states = [
                "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
                "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
                "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
                "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
                "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
                "Lakshadweep", "Puducherry"
            ];

            // Map states to realistic market cities
            const cityMap = {
                "Maharashtra": ["Nagpur", "Pune", "Nashik", "Mumbai", "Aurangabad"],
                "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain", "Jabalpur"],
                "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara"],
                "Karnataka": ["Bangalore", "Mysore", "Hubli", "Belgaum"],
                "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
                "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
                "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
                "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
                "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
                "West Bengal": ["Kolkata", "Howrah", "Siliguri"],
                "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Udaipur"],
                "Haryana": ["Gurgaon", "Faridabad", "Panipat"],
                "Bihar": ["Patna", "Gaya", "Muzaffarpur"],
                "Delhi": ["Azadpur", "Okhla", "Ghazipur"]
            };

            const crops = ["Rice", "Wheat", "Soybean", "Cotton", "Maize", "Mustard", "Sugarcane", "Gram", "Groundnut", "Turmeric"];

            // Generate valid data for ALL states
            const marketData = states.flatMap((state, index) => {
                // Get cities for this state or use generic ones
                const updateCities = cityMap[state] || ["Main Market", "City Mandi", "District HQ"];

                // Generate 2-3 entries per state
                return [1, 2].map(i => {
                    const city = updateCities[Math.floor(Math.random() * updateCities.length)];
                    return {
                        id: `MD-${index}-${i}`,
                        state: state,
                        district: city, // Use City as District
                        region: city,   // Use City as Region
                        crop: crops[Math.floor(Math.random() * crops.length)],
                        price: 2000 + Math.floor(Math.random() * 5000),
                        change: parseFloat((Math.random() * 10 - 5).toFixed(1)),
                        trend: Math.random() > 0.5 ? "up" : "down",
                        last_updated: new Date().toISOString()
                    };
                });
            });

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
    async fetchRealMarketPrices() {
        if (!OGD_API_KEY) return null;
        try {
            const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${OGD_API_KEY}&format=json&limit=50`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'ok' && data.records) {
                return data.records.map((item, idx) => ({
                    id: `OGD-${idx}`,
                    state: item.state,
                    district: item.district,
                    region: item.market,
                    crop: item.commodity,
                    price: parseInt(item.modal_price, 10),
                    change: parseFloat((Math.random() * 5 - 2.5).toFixed(1)), // Mock change
                    trend: Math.random() > 0.5 ? "up" : "down"
                }));
            }
        } catch (e) {
            console.error("OGD API Fetch Failed", e);
        }
        return null;
    }

    async getMarketPrices() {
        // Try Real API First
        const realData = await this.fetchRealMarketPrices();
        if (realData) return realData;

        // Fallback to Mock Data
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
    // 11. AI Crop Advisory & Price Prediction
    async recommendOilseeds(criteria) {
        const { region, soil } = criteria;
        let recommendations = [];

        // Mock Logic matching Python backend
        if (soil.toLowerCase().includes('black') || soil.toLowerCase().includes('clay')) {
            recommendations.push({
                crop: "Soybean",
                suitability: "High",
                reason: "Black soil retains moisture well, ideal for Soybean.",
                msp: 4600,
                potential_yield: "6-8 Quintals/acre"
            });
            recommendations.push({
                crop: "Sunflower",
                suitability: "Medium",
                reason: "Good option but requires well-drained soil.",
                msp: 6400,
                potential_yield: "5-6 Quintals/acre"
            });
        }

        if (soil.toLowerCase().includes('loam') || soil.toLowerCase().includes('sandy') || soil.toLowerCase().includes('red')) {
            recommendations.push({
                crop: "Groundnut",
                suitability: "High",
                reason: "Loose soil allows peg penetration for pod formation.",
                msp: 6377,
                potential_yield: "8-10 Quintals/acre"
            });
            recommendations.push({
                crop: "Mustard",
                suitability: "High",
                reason: "Thrives in loamy soil with less water requirement.",
                msp: 5450,
                potential_yield: "5-7 Quintals/acre"
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                crop: "Soybean",
                suitability: "Medium",
                reason: "General recommendation for your region.",
                msp: 4600
            });
        }

        return this._delay(recommendations);
    }

    async predictExpectedPrice(crop) {
        // Mock Data Database
        const marketDb = {
            "Soybean": { msp: 4600, demand: "High" },
            "Mustard": { msp: 5450, demand: "Very High" },
            "Groundnut": { msp: 6377, demand: "Moderate" },
            "Sunflower": { msp: 6400, demand: "High" }
        };

        const data = marketDb[crop] || { msp: 4000, demand: "Unknown" };
        const volatility = (Math.random() * 0.20) - 0.05; // -5% to +15%
        const expectedPrice = Math.round(data.msp * (1 + volatility));

        // Future Trend
        const months = ["Jan", "Feb", "Mar"];
        let trendPrice = expectedPrice;
        const futureTrend = months.map(m => {
            trendPrice = Math.round(trendPrice * (1 + (Math.random() * 0.05 - 0.02)));
            return { month: m, price: trendPrice };
        });

        return this._delay({
            current_msp: data.msp,
            expected_price: expectedPrice,
            range_low: Math.round(expectedPrice * 0.95),
            range_high: Math.round(expectedPrice * 1.05),
            recommendation: expectedPrice > data.msp * 1.1 ? "Sell" : "Hold",
            future_trend: futureTrend,
            demand_factors: volatility > 0 ? ["International Price Hike", "Festival Demand"] : ["Surplus Production"]
        });
    }

    // 12. Logistics Cost Calculator
    async calculateLogisticsCost(quantity, distance) {
        const qty = parseFloat(quantity);
        const dist = parseFloat(distance);

        let vehicleType = "Auto (3-Wheeler)";
        let baseCharge = 200;
        let perKm = 15;
        let capacityCharge = 0;

        if (qty >= 10) {
            vehicleType = "Tempo (Small Truck)";
            baseCharge = 500;
            perKm = 25;
            capacityCharge = (qty - 10) * 20; // Extra charge per quintal over 10
        }

        const totalCost = baseCharge + (dist * perKm) + capacityCharge;

        return this._delay({
            vehicle: vehicleType,
            base_charge: baseCharge,
            distance_cost: dist * perKm,
            capacity_surcharge: capacityCharge,
            total_cost: Math.round(totalCost),
            per_quintal_cost: Math.round(totalCost / qty),
            apo_price: Math.round(5200 + (Math.random() * 200)) // Fake APO
        });
    }
    // 13. End-to-End Supply Chain APIs

    // Farmer -> FPO
    async sellToFPO(farmerId, cropData) {
        const procurement = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PROCUREMENT) || '[]');
        const newRequest = {
            id: `PR-${Date.now()}`,
            farmer: farmerId || "Current User",
            crop: cropData.crop,
            quantity: cropData.quantity || 10,
            quality: "Pending",
            date: new Date().toISOString().split('T')[0],
            status: "Pending",
            contact: "9876543210",
            ...cropData
        };
        procurement.push(newRequest);
        localStorage.setItem(this.STORAGE_KEYS.PROCUREMENT, JSON.stringify(procurement));
        return this._delay({ success: true, data: newRequest });
    }

    // FPO -> Processor (Marketplace)
    async getProcessorMarketplace() {
        // Items listed by FPO for Processors to buy
        // In this mock, we assume all "Verified" procurement that is in Inventory can be listed
        const inventory = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.INVENTORY) || '[]');
        // Filter for Raw Materials
        const listings = inventory.filter(i => i.type === 'Raw Material').map(i => ({
            ...i,
            pricePerUnit: 4500, // Mock price
            seller: "Ratlam FPO"
        }));
        return this._delay(listings);
    }

    async buyForProcessing(processorId, itemId) {
        // Move from FPO Inventory -> Processor Inventory
        let fpoInventory = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.INVENTORY) || '[]');
        const itemIndex = fpoInventory.findIndex(i => i.id == itemId);

        if (itemIndex > -1) {
            const item = fpoInventory[itemIndex];
            // Remove from FPO (or reduce quantity - simplifying to remove for demo)
            fpoInventory.splice(itemIndex, 1);
            localStorage.setItem(this.STORAGE_KEYS.INVENTORY, JSON.stringify(fpoInventory));

            // Add to Processor Inventory (Simulated Separate Storage, but using same key for demo simplicity with 'owner' tag if needed, 
            // but for completely separate roles, we might want a different key. 
            // For now, I'll allow "Processor Inventory" to be just another view or a separate key.)

            // Let's use a new key for Processor Inventory to avoid confusion
            const procKey = 'agrisync_processor_inventory';
            const procInventory = JSON.parse(localStorage.getItem(procKey) || '[]');
            procInventory.push({
                ...item,
                id: `PROC-MAT-${Date.now()}`,
                status: 'Ready for Processing',
                location: 'Processing Unit'
            });
            localStorage.setItem(procKey, JSON.stringify(procInventory));
            return this._delay({ success: true, message: "Raw Material Purchased" });
        }
        return this._delay({ success: false, message: "Item not available" });
    }

    async getProcessorInventory() {
        const procKey = 'agrisync_processor_inventory';
        return this._delay(JSON.parse(localStorage.getItem(procKey) || '[]'));
    }

    // Processor -> Process -> Output
    async processBatch(batchId, outputName) {
        const procKey = 'agrisync_processor_inventory';
        let inventory = JSON.parse(localStorage.getItem(procKey) || '[]');
        const index = inventory.findIndex(i => i.id === batchId);

        if (index > -1) {
            const raw = inventory[index];
            // Consume Raw Material
            inventory.splice(index, 1);

            // Produce Finished Good
            const finishedGood = {
                id: `FG-${Date.now()}`,
                item: outputName || `${raw.item.split(' ')[0]} Oil`, // Simple mock conversion
                quantity: raw.quantity * 0.8, // 80% yield
                unit: 'Liters',
                type: 'Finished Good',
                batch: raw.batch,
                date: new Date().toISOString().split('T')[0],
                status: 'Ready for Sale'
            };
            inventory.push(finishedGood);
            localStorage.setItem(procKey, JSON.stringify(inventory));
            return this._delay({ success: true, data: finishedGood });
        }
        return this._delay({ success: false });
    }

    // Processor -> Retailer (Marketplace)
    async getRetailerMarketplace() {
        const procKey = 'agrisync_processor_inventory';
        const inventory = JSON.parse(localStorage.getItem(procKey) || '[]');
        return this._delay(inventory.filter(i => i.type === 'Finished Good'));
    }


    async buyForRetail(retailerId, itemId) {
        const procKey = 'agrisync_processor_inventory';
        let procInventory = JSON.parse(localStorage.getItem(procKey) || '[]');
        const index = procInventory.findIndex(i => i.id === itemId);

        if (index > -1) {
            const item = procInventory[index];
            // Remove from Processor
            procInventory.splice(index, 1);
            localStorage.setItem(procKey, JSON.stringify(procInventory));

            // Add to Retailer Stock
            const retKey = 'agrisync_retailer_stock';
            const stock = JSON.parse(localStorage.getItem(retKey) || '[]');
            stock.push({
                ...item,
                id: `RET-${Date.now()}`,
                price: item.quantity * 150, // Mock Retail Price
                status: 'In Stock'
            });
            localStorage.setItem(retKey, JSON.stringify(stock));
            return this._delay({ success: true });
        }
        return this._delay({ success: false });
    }

    async getRetailerStock() {
        const retKey = 'agrisync_retailer_stock';
        return this._delay(JSON.parse(localStorage.getItem(retKey) || '[]'));
    }

}

// Export global instance
window.MockApiService = new MockApiService();
