const mockData = {
  dashboardStats: [
    { title: 'Total Farmers', value: '12,450', change: 8.5, icon: 'users', color: 'from-emerald-500 to-teal-500' },
    { title: 'Production (MT)', value: '85,200', change: 12.3, icon: 'trending-up', color: 'from-lime-500 to-green-500' },
    { title: 'Market Price', value: '₹5,800', change: -2.1, icon: 'indian-rupee', color: 'from-amber-500 to-yellow-500' },
    { title: 'Warehouses', value: '23', change: 5.0, icon: 'warehouse', color: 'from-teal-500 to-cyan-500' }
  ],

  farmers: [
    { name: 'Ramesh Kumar', crop: 'Mustard', landArea: '5.2', location: 'Wardha, Maharashtra' },
    { name: 'Suresh Patel', crop: 'Soybean', landArea: '8.5', location: 'Indore, MP' },
    { name: 'Vijay Singh', crop: 'Groundnut', landArea: '3.8', location: 'Rajkot, Gujarat' },
    { name: 'Prakash Reddy', crop: 'Sunflower', landArea: '6.2', location: 'Guntur, AP' },
    { name: 'Mahesh Yadav', crop: 'Mustard', landArea: '4.5', location: 'Jaipur, Rajasthan' },
    { name: 'Rajesh Sharma', crop: 'Soybean', landArea: '7.0', location: 'Bhopal, MP' },
    { name: 'Dinesh Verma', crop: 'Groundnut', landArea: '5.5', location: 'Junagadh, Gujarat' },
    { name: 'Anil Kumar', crop: 'Mustard', landArea: '6.8', location: 'Bharatpur, Rajasthan' },
    { name: 'Santosh Naik', crop: 'Sunflower', landArea: '4.2', location: 'Belgaum, Karnataka' },
    { name: 'Ganesh Pawar', crop: 'Soybean', landArea: '9.1', location: 'Nagpur, Maharashtra' }
  ],

  marketPrices: [
    // Maharashtra - Soybean, Groundnut, Sunflower
    { state: 'Maharashtra', district: 'Pune', market: 'Pune Market', region: 'Pune Market, Pune, Maharashtra', crop: 'Soybean', price: 5800, change: 2.5 },
    { state: 'Maharashtra', district: 'Nagpur', market: 'Nagpur APMC', region: 'Nagpur APMC, Nagpur, Maharashtra', crop: 'Soybean', price: 5750, change: 1.8 },
    { state: 'Maharashtra', district: 'Ahmednagar', market: 'Ahmednagar Market', region: 'Ahmednagar Market, Ahmednagar, Maharashtra', crop: 'Groundnut', price: 6200, change: -1.2 },
    { state: 'Maharashtra', district: 'Solapur', market: 'Solapur APMC', region: 'Solapur APMC, Solapur, Maharashtra', crop: 'Sunflower', price: 6750, change: 2.1 },

    // Madhya Pradesh - Soybean, Mustard, Linseed
    { state: 'Madhya Pradesh', district: 'Indore', market: 'Indore Mandi', region: 'Indore Mandi, Indore, Madhya Pradesh', crop: 'Soybean', price: 5900, change: 3.1 },
    { state: 'Madhya Pradesh', district: 'Bhopal', market: 'Bhopal Market', region: 'Bhopal Market, Bhopal, Madhya Pradesh', crop: 'Mustard', price: 6100, change: 2.3 },
    { state: 'Madhya Pradesh', district: 'Ujjain', market: 'Ujjain APMC', region: 'Ujjain APMC, Ujjain, Madhya Pradesh', crop: 'Soybean', price: 5850, change: 1.5 },
    { state: 'Madhya Pradesh', district: 'Mandsaur', market: 'Mandsaur Mandi', region: 'Mandsaur Mandi, Mandsaur, Madhya Pradesh', crop: 'Linseed', price: 7200, change: 3.4 },

    // Rajasthan - Mustard, Rapeseed, Sesame
    { state: 'Rajasthan', district: 'Jaipur', market: 'Jaipur Mandi', region: 'Jaipur Mandi, Jaipur, Rajasthan', crop: 'Mustard', price: 6300, change: 4.2 },
    { state: 'Rajasthan', district: 'Kota', market: 'Kota Market', region: 'Kota Market, Kota, Rajasthan', crop: 'Mustard', price: 6250, change: 3.8 },
    { state: 'Rajasthan', district: 'Alwar', market: 'Alwar APMC', region: 'Alwar APMC, Alwar, Rajasthan', crop: 'Rapeseed', price: 6150, change: 2.1 },
    { state: 'Rajasthan', district: 'Bharatpur', market: 'Bharatpur Mandi', region: 'Bharatpur Mandi, Bharatpur, Rajasthan', crop: 'Sesame', price: 12500, change: 4.5 },

    // Gujarat - Groundnut, Castor, Cotton Seed
    { state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad Market', region: 'Ahmedabad Market, Ahmedabad, Gujarat', crop: 'Groundnut', price: 6400, change: 3.5 },
    { state: 'Gujarat', district: 'Rajkot', market: 'Rajkot APMC', region: 'Rajkot APMC, Rajkot, Gujarat', crop: 'Groundnut', price: 6350, change: 2.9 },
    { state: 'Gujarat', district: 'Junagadh', market: 'Junagadh Market', region: 'Junagadh Market, Junagadh, Gujarat', crop: 'Groundnut', price: 6500, change: 4.1 },
    { state: 'Gujarat', district: 'Mehsana', market: 'Mehsana APMC', region: 'Mehsana APMC, Mehsana, Gujarat', crop: 'Castor', price: 7800, change: 3.2 },
    { state: 'Gujarat', district: 'Surendranagar', market: 'Surendranagar Market', region: 'Surendranagar Market, Surendranagar, Gujarat', crop: 'Cotton Seed', price: 4200, change: 1.8 },

    // Karnataka - Sunflower, Groundnut, Safflower
    { state: 'Karnataka', district: 'Bangalore', market: 'Bangalore APMC', region: 'Bangalore APMC, Bangalore, Karnataka', crop: 'Sunflower', price: 6800, change: 2.7 },
    { state: 'Karnataka', district: 'Belgaum', market: 'Belgaum Market', region: 'Belgaum Market, Belgaum, Karnataka', crop: 'Sunflower', price: 6750, change: 1.9 },
    { state: 'Karnataka', district: 'Davangere', market: 'Davangere APMC', region: 'Davangere APMC, Davangere, Karnataka', crop: 'Groundnut', price: 6300, change: 3.2 },
    { state: 'Karnataka', district: 'Bijapur', market: 'Bijapur Market', region: 'Bijapur Market, Bijapur, Karnataka', crop: 'Safflower', price: 7500, change: 2.6 },

    // Andhra Pradesh - Groundnut, Sunflower, Niger Seed
    { state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur Market', region: 'Guntur Market, Guntur, Andhra Pradesh', crop: 'Groundnut', price: 6250, change: 2.4 },
    { state: 'Andhra Pradesh', district: 'Kurnool', market: 'Kurnool APMC', region: 'Kurnool APMC, Kurnool, Andhra Pradesh', crop: 'Sunflower', price: 6900, change: 3.6 },
    { state: 'Andhra Pradesh', district: 'Anantapur', market: 'Anantapur Market', region: 'Anantapur Market, Anantapur, Andhra Pradesh', crop: 'Niger Seed', price: 8200, change: 2.8 },

    // Telangana - Sunflower, Soybean, Castor
    { state: 'Telangana', district: 'Hyderabad', market: 'Hyderabad Market', region: 'Hyderabad Market, Hyderabad, Telangana', crop: 'Sunflower', price: 6850, change: 2.8 },
    { state: 'Telangana', district: 'Warangal', market: 'Warangal APMC', region: 'Warangal APMC, Warangal, Telangana', crop: 'Soybean', price: 5700, change: 1.6 },
    { state: 'Telangana', district: 'Nizamabad', market: 'Nizamabad Market', region: 'Nizamabad Market, Nizamabad, Telangana', crop: 'Castor', price: 7650, change: 3.1 },

    // Uttar Pradesh - Mustard, Linseed
    { state: 'Uttar Pradesh', district: 'Lucknow', market: 'Lucknow Mandi', region: 'Lucknow Mandi, Lucknow, Uttar Pradesh', crop: 'Mustard', price: 6050, change: 2.2 },
    { state: 'Uttar Pradesh', district: 'Kanpur', market: 'Kanpur Market', region: 'Kanpur Market, Kanpur, Uttar Pradesh', crop: 'Mustard', price: 6000, change: 1.7 },
    { state: 'Uttar Pradesh', district: 'Varanasi', market: 'Varanasi Mandi', region: 'Varanasi Mandi, Varanasi, Uttar Pradesh', crop: 'Linseed', price: 7100, change: 2.9 },

    // Haryana - Mustard, Sunflower
    { state: 'Haryana', district: 'Karnal', market: 'Karnal Mandi', region: 'Karnal Mandi, Karnal, Haryana', crop: 'Mustard', price: 6200, change: 3.3 },
    { state: 'Haryana', district: 'Hisar', market: 'Hisar Market', region: 'Hisar Market, Hisar, Haryana', crop: 'Mustard', price: 6150, change: 2.6 },
    { state: 'Haryana', district: 'Sirsa', market: 'Sirsa APMC', region: 'Sirsa APMC, Sirsa, Haryana', crop: 'Sunflower', price: 6700, change: 2.3 },

    // Punjab - Mustard, Sunflower
    { state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana APMC', region: 'Ludhiana APMC, Ludhiana, Punjab', crop: 'Mustard', price: 6100, change: 2.1 },
    { state: 'Punjab', district: 'Amritsar', market: 'Amritsar Mandi', region: 'Amritsar Mandi, Amritsar, Punjab', crop: 'Sunflower', price: 6650, change: 1.9 },

    // West Bengal - Mustard, Sesame
    { state: 'West Bengal', district: 'Kolkata', market: 'Kolkata Market', region: 'Kolkata Market, Kolkata, West Bengal', crop: 'Mustard', price: 5950, change: 1.4 },
    { state: 'West Bengal', district: 'Burdwan', market: 'Burdwan Mandi', region: 'Burdwan Mandi, Burdwan, West Bengal', crop: 'Sesame', price: 12200, change: 3.7 },

    // Tamil Nadu - Groundnut, Sesame, Coconut
    { state: 'Tamil Nadu', district: 'Chennai', market: 'Chennai Market', region: 'Chennai Market, Chennai, Tamil Nadu', crop: 'Groundnut', price: 6100, change: 2.5 },
    { state: 'Tamil Nadu', district: 'Coimbatore', market: 'Coimbatore APMC', region: 'Coimbatore APMC, Coimbatore, Tamil Nadu', crop: 'Sesame', price: 12800, change: 4.2 },
    { state: 'Tamil Nadu', district: 'Erode', market: 'Erode Market', region: 'Erode Market, Erode, Tamil Nadu', crop: 'Coconut', price: 3500, change: 1.8 },

    // Kerala - Coconut, Palm Oil
    { state: 'Kerala', district: 'Kochi', market: 'Kochi Market', region: 'Kochi Market, Kochi, Kerala', crop: 'Coconut', price: 3600, change: 2.1 },
    { state: 'Kerala', district: 'Thiruvananthapuram', market: 'Trivandrum Market', region: 'Trivandrum Market, Thiruvananthapuram, Kerala', crop: 'Copra', price: 11500, change: 3.4 },

    // Odisha - Mustard, Niger Seed
    { state: 'Odisha', district: 'Bhubaneswar', market: 'Bhubaneswar Market', region: 'Bhubaneswar Market, Bhubaneswar, Odisha', crop: 'Mustard', price: 5900, change: 1.6 },
    { state: 'Odisha', district: 'Cuttack', market: 'Cuttack APMC', region: 'Cuttack APMC, Cuttack, Odisha', crop: 'Niger Seed', price: 8100, change: 2.7 }
  ],

  warehouses: [
    { name: 'Central Warehouse A', location: 'Nagpur, Maharashtra', capacity: 5000, current: 3200 },
    { name: 'North Warehouse B', location: 'Jaipur, Rajasthan', capacity: 4500, current: 2800 },
    { name: 'West Warehouse C', location: 'Rajkot, Gujarat', capacity: 6000, current: 4100 }
  ],

  userCrops: [
    { name: 'Mustard', area: '3.5', status: 'Growing', days: '45' },
    { name: 'Soybean', area: '3.0', status: 'Harvesting', days: '5' },
    { name: 'Groundnut', area: '2.0', status: 'Planted', days: '15' }
  ],

  nearbyFarmers: [
    { name: 'Ramesh Kumar', crop: 'Mustard', landArea: '5.2', location: 'Wardha, Maharashtra' },
    { name: 'Suresh Patel', crop: 'Soybean', landArea: '8.5', location: 'Wardha, Maharashtra' },
    { name: 'Prakash Reddy', crop: 'Sunflower', landArea: '6.2', location: 'Nagpur, Maharashtra' }
  ],

  nearbyWarehouses: [
    { name: 'Central Warehouse A', location: 'Nagpur, Maharashtra', capacity: 5000, current: 3200 },
    { name: 'District Warehouse D', location: 'Wardha, Maharashtra', capacity: 3000, current: 1500 }
  ],

  adminCompliance: [
    { region: 'Wardha, Maharashtra', farmers: 145, status: 'compliant' },
    { region: 'Indore, MP', farmers: 230, status: 'compliant' },
    { region: 'Rajkot, Gujarat', farmers: 180, status: 'non-compliant' },
    { region: 'Guntur, AP', farmers: 95, status: 'compliant' }
  ],

  userCompliance: {
    status: 'compliant',
    location: 'Wardha, Maharashtra',
    currentCrop: 'Mustard',
    zone: 'Oil Palm Mandate Zone',
    message: 'Your farm is compliant with regional oilseed policy mandates. Continue growing approved crops.'
  },

  adminPerformance: [
    { region: 'Wardha, Maharashtra', avgScore: 78 },
    { region: 'Indore, MP', avgScore: 72 },
    { region: 'Rajkot, Gujarat', avgScore: 65 },
    { region: 'Guntur, AP', avgScore: 82 }
  ],

  userPerformance: {
    totalScore: 85,
    aiAdherence: 26,
    yieldHistory: 35,
    salesRecord: 24
  },

  contracts: [
    {
      crop: 'Mustard Seeds',
      processor: 'AgriCorp Processing Ltd',
      quantity: 50,
      price: 6200,
      marketRate: 6000,
      deliveryDate: 'March 2025',
      location: 'Wardha',
      status: 'open'
    },
    {
      crop: 'Soybean',
      processor: 'United Oil Mills',
      quantity: 100,
      price: 5700,
      marketRate: 5500,
      deliveryDate: 'April 2025',
      location: 'Indore',
      status: 'open'
    },
    {
      crop: 'Groundnut',
      processor: 'Premium Oils Pvt Ltd',
      quantity: 30,
      price: 6000,
      marketRate: 5800,
      deliveryDate: 'February 2025',
      location: 'Rajkot',
      status: 'open'
    },
    {
      crop: 'Mustard Seeds',
      processor: 'Local FPO Cooperative',
      quantity: 20,
      price: 6100,
      marketRate: 6000,
      deliveryDate: 'January 2025',
      location: 'Wardha',
      status: 'active'
    },
    {
      crop: 'Soybean',
      processor: 'AgriCorp Processing Ltd',
      quantity: 15,
      price: 5600,
      marketRate: 5500,
      deliveryDate: 'December 2024',
      location: 'Nagpur',
      status: 'completed'
    }
  ],

  produceListings: [
    {
      id: 1,
      crop: 'Mustard',
      quantity: 25,
      pricePerQuintal: 6200,
      quality: 'Premium',
      availableFrom: '2025-01-15',
      deliveryPreference: 'Warehouse delivery',
      targetBuyers: ['FPO', 'Processor'],
      status: 'active',
      listedDate: '2024-12-05',
      notes: 'Certified organic mustard seeds, stored in climate-controlled warehouse'
    },
    {
      id: 2,
      crop: 'Soybean',
      quantity: 40,
      pricePerQuintal: 5700,
      quality: 'Grade A',
      availableFrom: '2024-12-10',
      deliveryPreference: 'Farm pickup',
      targetBuyers: ['Processor', 'Retailer'],
      status: 'active',
      listedDate: '2024-12-01',
      notes: 'High protein content, suitable for oil extraction'
    }
  ]
};
