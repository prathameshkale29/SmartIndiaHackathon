const AUTH_KEY = 'agrisync_user';
const USERS_KEY = 'agrisync_users';

// Test accounts for quick login - no Google auth needed
const testAccounts = {
  'user1': { password: 'pass1', name: 'Test User 1', defaultRole: 'farmer' },
  'user2': { password: 'pass2', name: 'Test User 2', defaultRole: 'fpo' },
  'user3': { password: 'pass3', name: 'Test User 3', defaultRole: 'processor' },
  'user4': { password: 'pass4', name: 'Test User 4', defaultRole: 'retailer' },
  'farmer': { password: 'farmer123', name: 'Demo Farmer', defaultRole: 'farmer' },
  'fpo': { password: 'fpo123', name: 'Demo FPO Representative', defaultRole: 'fpo' },
  'processor': { password: 'processor123', name: 'Demo Processor', defaultRole: 'processor' },
  'retailer': { password: 'retailer123', name: 'Demo Retailer', defaultRole: 'retailer' }
};

const defaultUsers = {
  farmer: { username: 'farmer', password: 'farmer123', role: 'farmer', name: 'Demo Farmer' },
  fpo: { username: 'fpo', password: 'fpo123', role: 'fpo', name: 'Demo FPO Representative' },
  processor: { username: 'processor', password: 'processor123', role: 'processor', name: 'Demo Processor' },
  retailer: { username: 'retailer', password: 'retailer123', role: 'retailer', name: 'Demo Retailer' }
};

function getStoredUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : defaultUsers;
  } catch (error) {
    return defaultUsers;
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function register(username, password, fullName, role) {
  try {
    // Try backend first
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email: username, password, role })
      });

      if (res.ok) {
        const data = await res.json();
        const userData = {
          username: data.user.email,
          name: data.user.name,
          role: role
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        window.dispatchEvent(new Event('auth-change'));
        return { success: true, user: userData };
      }
    } catch (e) {
      // Backend not available, fall through to mock
      console.log("Backend unavailable, using mock register");
    }

    // Mock Fallback
    const userData = {
      username: username,
      name: fullName,
      role: role
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    window.dispatchEvent(new Event('auth-change'));
    return { success: true, user: userData };

  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed' };
  }
}

async function login(username, password, role) {
  try {
    // Check test accounts first
    if (testAccounts[username]) {
      const testAccount = testAccounts[username];
      if (testAccount.password === password) {
        // Valid test account
        const userData = {
          username: username,
          name: testAccount.name,
          role: role || testAccount.defaultRole // Use selected role or default
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        window.dispatchEvent(new Event('auth-change'));
        return { success: true, user: userData };
      } else {
        return { success: false, message: 'Invalid password' };
      }
    }

    // Try backend first
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });

      if (res.ok) {
        const data = await res.json();
        const userData = {
          username: data.user.email,
          name: data.user.name,
          role: role // Trust UI role for now or use data.user.role if strict
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        window.dispatchEvent(new Event('auth-change'));
        return { success: true, user: userData };
      }
    } catch (e) {
      // Backend not available, fall through to mock
      console.log("Backend unavailable, using mock login");
    }

    // Mock Fallback - allow any username/password for testing
    const userData = {
      username: username,
      name: username.split('@')[0], // Simple name derivation
      role: role // CRITICAL: Use the role selected in UI
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    window.dispatchEvent(new Event('auth-change'));
    return { success: true, user: userData };

  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('auth-change'));
}

function getCurrentUser() {
  try {
    const userData = localStorage.getItem(AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

function isAdmin(user) {
  return user?.role === 'admin';
}

function googleLogin(profile) {
  const users = getStoredUsers();
  // Use email as username for Google login
  const username = profile.email;

  if (!users[username]) {
    // Register new user automatically
    users[username] = {
      username: username,
      password: '', // No password for Google auth
      name: profile.name,
      role: 'user', // Default role
      picture: profile.picture,
      authProvider: 'google'
    };
    saveUsers(users);
  }

  const user = users[username];
  const userData = {
    username: user.username,
    name: user.name,
    role: user.role,
    picture: user.picture
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  window.dispatchEvent(new Event('auth-change'));
  return { success: true, user: userData };
}