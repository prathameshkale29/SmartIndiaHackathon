const AGRISTACK_KEY = 'agrisync_agristack';

// Simulate an async API call to fetch Agri-Stack Profile
async function fetchAgriStackProfile(farmerId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!farmerId) {
        reject('Invalid Farmer ID');
        return;
      }

      // Mock Data based on Farmer ID
      const mockProfile = {
        farmerId: farmerId,
        name: "Manthan Gupta", // In a real app, this would match the auth user
        aadhaar: "XXXX-XXXX-4567",
        mobile: "+91 98765-43210",
        kycStatus: "Verified",
        lastSync: new Date().toISOString(),

        // Land Records (Simulated from State Land Registry)
        landRecords: [
          { surveyNo: "123/4", village: "Wardha", area: "3.5 acres", soilType: "Black Cotton", status: "Verified" },
          { surveyNo: "125/2", village: "Wardha", area: "5.0 acres", soilType: "Red Loamy", status: "Verified" }
        ],
        totalLand: "8.5 acres",

        // Scheme Status (Simulated from DBT Bharat)
        pmKisan: {
          status: "Active",
          beneficiaryId: "PMK" + Math.floor(Math.random() * 1000000000),
          installments: [
            { date: "2024-12-01", amount: 2000, status: "Credited" },
            { date: "2024-08-01", amount: 2000, status: "Credited" }
          ]
        },

        // Soil Health Card (Simulated from Soil Health Portal)
        soilHealth: {
          cardId: "SHC" + Math.floor(Math.random() * 1000000),
          status: "Available",
          testDate: "2024-09-15",
          params: {
            pH: "7.2",
            ec: "0.45",
            oc: "0.75%", // Organic Carbon
            n: "Low",
            p: "High",
            k: "Medium"
          },
          recommendations: "Apply DAP 50kg/acre, Urea 25kg/acre. Use Zinc Sulphate 10kg/acre."
        },

        // Credit Status (Simulated from Bank/CIBIL)
        kcc: {
          status: "Active",
          limit: "₹3,00,000",
          utilized: "₹1,50,000",
          available: "₹1,50,000"
        }
      };

      resolve(mockProfile);
    }, 1500); // 1.5s simulated network delay
  });
}

// Sync function to be called by the frontend
async function syncWithAgriStack(userId) {
  try {
    // Generate a mock Farmer ID if not present
    const farmerId = 'AS' + Math.floor(10000000 + Math.random() * 90000000);

    const data = await fetchAgriStackProfile(farmerId);

    // Save to local storage to persist the "connection"
    localStorage.setItem(AGRISTACK_KEY + '_' + userId, JSON.stringify(data));

    return { success: true, data: data };
  } catch (error) {
    console.error('AgriStack sync error:', error);
    return { success: false, error: 'Failed to connect to Agri-Stack servers.' };
  }
}

function getAgriStackData(userId) {
  try {
    const stored = localStorage.getItem(AGRISTACK_KEY + '_' + userId);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
}

// Expose globally
if (typeof window !== 'undefined') {
  window.agriStack = {
    sync: syncWithAgriStack,
    getData: getAgriStackData
  };
}