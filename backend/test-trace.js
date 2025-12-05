// backend/test-trace.js
// Quick test script to create sample trace events

const API_BASE = 'http://localhost:5000/api';

const sampleEvents = [
    {
        batchId: 'BTC001',
        actorId: 'FARMER001',
        actorRole: 'FARMER',
        eventType: 'PLANTED',
        eventData: {
            crop: 'Soybean',
            variety: 'JS 335',
            area: '5 acres',
            location: 'Pune, Maharashtra'
        }
    },
    {
        batchId: 'BTC001',
        actorId: 'FARMER001',
        actorRole: 'FARMER',
        eventType: 'HARVESTED',
        eventData: {
            quantity: '100 kg',
            quality: 'Grade A',
            moistureContent: '12%'
        }
    },
    {
        batchId: 'BTC001',
        actorId: 'PROC001',
        actorRole: 'PROCESSOR',
        eventType: 'PROCURED_BY_PROCESSOR',
        eventData: {
            price: '5000 INR',
            location: 'Processing Plant A',
            transportMode: 'Truck'
        }
    },
    {
        batchId: 'BTC001',
        actorId: 'PROC001',
        actorRole: 'PROCESSOR',
        eventType: 'PROCESSED',
        eventData: {
            oilExtracted: '18 liters',
            processingMethod: 'Cold Press',
            byproducts: 'Meal 82 kg'
        }
    },
    {
        batchId: 'BTC001',
        actorId: 'PROC001',
        actorRole: 'PROCESSOR',
        eventType: 'PACKED',
        eventData: {
            packagingType: '1L bottles',
            quantity: '18 bottles',
            expiryDate: '2026-12-05'
        }
    }
];

async function createEvent(event) {
    try {
        const response = await fetch(`${API_BASE}/trace-events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        });

        const data = await response.json();

        if (data.status === 'success') {
            console.log(`✅ Created ${event.eventType} event`);
            console.log(`   Hash: ${data.data.currentHash.substring(0, 16)}...`);
            if (data.data.onChainStatus === 'PENDING') {
                console.log(`   ⏳ On-chain anchoring pending...`);
            }
        } else {
            console.error(`❌ Failed to create ${event.eventType}:`, data.error);
        }
    } catch (error) {
        console.error(`❌ Error creating ${event.eventType}:`, error.message);
    }
}

async function runTests() {
    console.log('🚀 Creating sample trace events for batch BTC001...\n');

    for (const event of sampleEvents) {
        await createEvent(event);
        // Small delay between events
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✨ All events created!');
    console.log('\n📊 View traceability page:');
    console.log('   http://localhost:5000/trace.html?batchId=BTC001');

    console.log('\n🔍 Verify hash chain:');
    console.log('   curl http://localhost:5000/api/trace-events/BTC001/verify');
}

// Run tests
runTests().catch(console.error);
