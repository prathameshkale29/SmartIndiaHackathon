const AUTH_KEY = 'agrisync_user';
const MOCK_DB_KEY = 'agrisync_mock_users';

// Helper to save user to local storage for persistence across apps
function saveUserToLocal(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

// ---------------------------------------------------------
// Auth Function: Login with Google (REMOVED)
// ---------------------------------------------------------
function loginWithGoogle() {
  console.warn("Google Auth has been removed.");
  return Promise.resolve({ success: false, message: "Google Authentication is disabled." });
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

// MOCK REGISTER
async function register(email, password, fullName, role) {
  try {
    const users = getMockUsers();
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'User already exists.' };
    }

    const newUser = {
      uid: 'local_' + Date.now(),
      email: email,
      name: fullName,
      role: role,
      authProvider: 'local',
      password: password
    };

    saveMockUser(newUser);

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    saveUserToLocal(sessionUser);
    return { success: true, user: sessionUser };
  } catch (error) {
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

// MOCK LOGIN
async function login(email, password, role) {
  try {
    // 1. Check Demo Accounts
    const demoUser = Object.values(DEMO_ACCOUNTS).find(u =>
      (u.email === email || u.role === email) && u.password === password
    );

    if (demoUser) {
      const userData = { ...demoUser, uid: 'demo_' + demoUser.role, authProvider: 'demo' };
      delete userData.password;
      saveUserToLocal(userData);
      return { success: true, user: userData };
    }

    // 2. Check Mock DB
    const mockUsers = getMockUsers();
    const registeredUser = mockUsers.find(u => u.email === email && u.password === password);

    if (registeredUser) {
      const sessionUser = { ...registeredUser };
      delete sessionUser.password;
      saveUserToLocal(sessionUser);
      return { success: true, user: sessionUser };
    }

    return { success: false, message: 'Invalid credentials.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.reload();
}

function getCurrentUser() {
  const userData = localStorage.getItem(AUTH_KEY);
  return userData ? JSON.parse(userData) : null;
}

// Helper to get all available accounts (Demo + Local)
function getAvailableAccounts() {
  const mockUsers = getMockUsers();
  const demoUsers = Object.values(DEMO_ACCOUNTS).map(u => ({
    ...u,
    uid: 'demo_' + u.role,
    authProvider: 'demo'
  }));

  // Filter out duplicates if any (by email)
  const allUsers = [...demoUsers];
  mockUsers.forEach(mUser => {
    if (!allUsers.find(u => u.email === mUser.email)) {
      allUsers.push(mUser);
    }
  });

  return allUsers;
}

// Expose Globals
window.saveUserToLocal = saveUserToLocal;
window.getMockUsers = getMockUsers;
window.getAvailableAccounts = getAvailableAccounts; // NEW
window.saveMockUser = saveMockUser;
window.removeMockUser = removeMockUser;
window.register = register;
window.login = login;
window.loginWithGoogle = loginWithGoogle;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.isAdmin = isAdmin;