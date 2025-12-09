const AUTH_KEY = 'agrisync_user';
const MOCK_DB_KEY = 'agrisync_mock_users'; // Key to store registered users

// Firebase Access Removed
// Using Local Mock Authentication system

const auth = null;
const analytics = null;
console.log("Running in Local/Mock Mode (Firebase Removed)");

// Helper to save user to local storage for persistence across apps
function saveUserToLocal(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

// Helper to get registered users
function getMockUsers() {
  try {
    const users = localStorage.getItem(MOCK_DB_KEY);
    return users ? JSON.parse(users) : [];
  } catch (e) {
    return [];
  }
}

// Helper to save a new user
function saveMockUser(userWithPassword) {
  const users = getMockUsers();
  users.push(userWithPassword);
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
}

// Helper to remove a mock user
function removeMockUser(email) {
  const users = getMockUsers();
  const updatedUsers = users.filter(u => u.email !== email);
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(updatedUsers));
  return updatedUsers;
}

async function register(email, password, fullName, role) {
  try {
    // Check if user already exists in Demo or Mock DB
    const users = getMockUsers();
    const demoExists = Object.values(DEMO_ACCOUNTS).some(u => u.email === email || u.role === email); // check against demo
    const mockExists = users.some(u => u.email === email);

    if (demoExists || mockExists) {
      return { success: false, message: 'User already exists. Please login.' };
    }

    // SIMULATED REGISTRATION
    const newUser = {
      uid: 'local_' + Date.now(),
      email: email,
      name: fullName,
      role: role,
      authProvider: 'local',
      password: password // Storing password for mock auth validation
    };

    saveMockUser(newUser);

    // Auto Login after register
    // Remove password from session data
    const sessionUser = { ...newUser };
    delete sessionUser.password;

    saveUserToLocal(sessionUser);
    return { success: true, user: sessionUser };

  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message };
  }
}

// Demo Accounts Configuration
const DEMO_ACCOUNTS = {
  'farmer': { email: 'farmer@agrisync.com', password: 'farmer123', name: 'Ramesh Kumar', role: 'farmer' },
  'fpo': { email: 'fpo@agrisync.com', password: 'fpo123', name: 'Green Valley FPO', role: 'fpo' },
  'processor': { email: 'processor@agrisync.com', password: 'processor123', name: 'AgriGold Processors', role: 'processor' },
  'retailer': { email: 'retailer@agrisync.com', password: 'retailer123', name: 'Fresh Mart', role: 'retailer' },
  'admin': { email: 'admin@agrisync.com', password: 'admin123', name: 'System Admin', role: 'admin' }
};

async function login(email, password, role) {
  try {
    // 1. Check for Demo Accounts first (Bypass Firebase)
    // Support both full email AND short username (e.g. 'farmer')
    // email input here can be the username
    const demoUser = Object.values(DEMO_ACCOUNTS).find(u =>
      (u.email === email || u.role === email) && u.password === password
    );

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

    // 2. Check Mock Database (Registered Users)
    const mockUsers = getMockUsers();
    // Match email OR username (assuming email field holds username in registration if provided that way)
    // But registration field is 'username' in UI passed as 'email' arg to register.
    const registeredUser = mockUsers.find(u => u.email === email && u.password === password);

    if (registeredUser) {
      console.log("Using Registered Mock Account:", registeredUser.email);
      const sessionUser = { ...registeredUser };
      delete sessionUser.password; // Don't keep pass in session

      saveUserToLocal(sessionUser);
      return { success: true, user: sessionUser };
    }

    // 3. Fallback: Fail if not found
    return { success: false, message: 'Invalid username or password. Please register if you are new.' };

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

// Expose to window for app-wide access
window.saveUserToLocal = saveUserToLocal;
window.getMockUsers = getMockUsers;
window.saveMockUser = saveMockUser;
window.removeMockUser = removeMockUser;
window.register = register;
window.login = login;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.isAdmin = isAdmin;