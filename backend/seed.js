const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Listing = require('./models/Listing');
const Advisory = require('./models/Advisory');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Listing.deleteMany();
        await Advisory.deleteMany();

        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: '$2a$10$examplehashedpassword', // password: 123
                role: 'admin'
            },
            {
                name: 'John Farmer',
                email: 'farmer@example.com',
                password: '$2a$10$examplehashedpassword',
                role: 'farmer',
                profile: { phone: '1234567890', address: { city: 'Pune', state: 'Maharashtra' } }
            },
            {
                name: 'Buyer Inc',
                email: 'buyer@example.com',
                password: '$2a$10$examplehashedpassword',
                role: 'buyer'
            }
        ]);

        const admin = createdUsers[0]._id;
        const farmer = createdUsers[1]._id;

        const products = await Product.insertMany([
            { name: 'Soybean', category: 'Oilseeds', gradingStandards: 'Grade A: Clean, <2% moisture' },
            { name: 'Mustard Seeds', category: 'Oilseeds', gradingStandards: 'Grade A: Bold size' },
            { name: 'Groundnut', category: 'Oilseeds', gradingStandards: 'Shell intact' },
            { name: 'Sunflower Seeds', category: 'Oilseeds', gradingStandards: 'High oil content >40%' },
            { name: 'Sesame (Til)', category: 'Oilseeds', gradingStandards: 'White/Black sorted' },
            { name: 'Castor Seeds', category: 'Oilseeds', gradingStandards: 'Commercial grade' }
        ]);

        await Listing.insertMany([
            {
                seller: farmer,
                product: products[0]._id, // Soybean
                quantity: 100,
                unit: 'quintal',
                pricePerUnit: 4500,
                location: {
                    city: 'Pune',
                    state: 'Maharashtra',
                    coordinates: { type: 'Point', coordinates: [73.8567, 18.5204] }
                },
                description: 'Fresh harvest soybean available.'
            },
            {
                seller: farmer,
                product: products[1]._id, // Mustard
                quantity: 50,
                unit: 'quintal',
                pricePerUnit: 5200,
                location: {
                    city: 'Jaipur',
                    state: 'Rajasthan',
                    coordinates: { type: 'Point', coordinates: [75.7873, 26.9124] }
                },
                description: 'High oil content mustard seeds.'
            },
            {
                seller: farmer,
                product: products[3]._id, // Sunflower
                quantity: 200,
                unit: 'quintal',
                pricePerUnit: 3800,
                location: {
                    city: 'Latur',
                    state: 'Maharashtra',
                    coordinates: { type: 'Point', coordinates: [76.5604, 18.4088] }
                },
                description: 'Dried sunflower seeds for oil extraction.'
            }
        ]);

        await Advisory.insertMany([
            {
                title: 'Heavy Rainfall Alert',
                content: 'Heavy rains expected in Pune district. Ensure proper drainage.',
                type: 'weather',
                targetStates: ['Maharashtra'],
                targetCrops: ['Soybean']
            },
            {
                title: 'Pest Control for Mustard',
                content: 'Aphid attack prone these days. Use recommended bio-pesticides.',
                type: 'pest',
                targetStates: ['Maharashtra', 'Rajasthan'],
                targetCrops: ['Mustard Seeds']
            }
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
