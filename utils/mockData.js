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
    { region: 'Wardha', crop: 'Mustard', price: 6000, change: 2.5 },
    { region: 'Indore', crop: 'Soybean', price: 5500, change: -1.2 },
    { region: 'Rajkot', crop: 'Groundnut', price: 5800, change: 3.8 },
    { region: 'Guntur', crop: 'Sunflower', price: 6200, change: 1.5 }
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
  ]
};

