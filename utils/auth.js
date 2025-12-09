const AUTH_KEY = 'agrisync_user';

// Firebase Access Removed
// Using Local Mock Authentication system

const auth = null;
const analytics = null;
console.log("Running in Local/Mock Mode (Firebase Removed)");

// Helper to save user to local storage for persistence across apps
function saveUserToLocal(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

async function register(email, password, fullName, role) {
  try {
    // SIMULATED REGISTRATION
    const userData = {
      uid: 'local_' + Date.now(),
      email: email,
      name: fullName,
      role: role,
      authProvider: 'local'
    };

    saveUserToLocal(userData);
    return { success: true, user: userData };

  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message };
  }
}

// Demo Accounts Configuration
const DEMO_ACCOUNTS = {
  'farmer': { email: 'farmer@agrisync.com', password: 'demo', name: 'Ramesh Kumar', role: 'farmer' },
  'fpo': { email: 'fpo@agrisync.com', password: 'demo', name: 'Green Valley FPO', role: 'fpo' },
  'processor': { email: 'processor@agrisync.com', password: 'demo', name: 'AgriGold Processors', role: 'processor' },
  'retailer': { email: 'retailer@agrisync.com', password: 'demo', name: 'Fresh Mart', role: 'retailer' },
  'admin': { email: 'admin@agrisync.com', password: 'demo', name: 'System Admin', role: 'admin' }
};

async function login(email, password, role) {
  try {
    // 1. Check for Demo Accounts first (Bypass Firebase)
    // Support both full email AND short username (e.g. 'farmer')
    const demoUser = Object.values(DEMO_ACCOUNTS).find(u => (u.email === email || u.role === email) && u.password === password);

    if (demoUser) {
      console.log("Using Demo Account:", demoUser.role);
      const userData = {
        uid: 'demo_' + demoUser.role + '_123',
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role, // Force role from demo config
        authProvider: 'demo'
      };
      saveUserToLocal(userData);
      return { success: true, user: userData };
    }

    // If not a demo account, simulate a generic login or fail
    // For this 'remove firebase' request, we'll allow any login as a mock user for testing purposes
    // UNLESS we want to be strict. Let's be helpful and mock it.

    console.log("Simulating Login for:", email);
    const userData = {
      uid: 'mock_' + Date.now(),
      email: email,
      name: email.split('@')[0],
      role: role,
      authProvider: 'mock'
    };

    saveUserToLocal(userData);
    return { success: true, user: userData };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
}



function logout() {
  if (auth) {
    auth.signOut();
  }
  localStorage.removeItem(AUTH_KEY);
}

function getCurrentUser() {
  try {
    const userData = localStorage.getItem(AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
}

function isAdmin(user) {
  return user?.role === 'admin';
}