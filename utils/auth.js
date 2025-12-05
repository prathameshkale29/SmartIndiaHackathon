const AUTH_KEY = 'agrisync_user';
const USERS_KEY = 'agrisync_users';

const defaultUsers = {
  admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'System Administrator' },
  farmer: { username: 'farmer', password: 'farmer123', role: 'farmer', name: 'Demo Farmer' },
  fpo: { username: 'fpo', password: 'fpo123', role: 'fpo', name: 'Demo FPO Representative' },
  processor: { username: 'processor', password: 'processor123', role: 'processor', name: 'Demo Processor' },
  retailer: { username: 'retailer', password: 'retailer123', role: 'retailer', name: 'Demo Retailer' },
  government: { username: 'government', password: 'gov123', role: 'government', name: 'Demo Government Official' }
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
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fullName, email: username, password, role })
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.error || 'Registration failed' };
    }

    const userData = {
      username: data.user.email,
      name: data.user.name,
      role: role
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    return { success: true, user: userData };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Network error' };
  }
}

async function login(username, password, role) {
  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.error || 'Login failed' };
    }

    const userData = {
      username: data.user.email,
      name: data.user.name,
      role: role
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    return { success: true, user: userData };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error' };
  }
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
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
  return { success: true, user: userData };
}