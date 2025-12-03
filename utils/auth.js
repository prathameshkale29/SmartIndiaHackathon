const AUTH_KEY = 'agrisync_user';
const USERS_KEY = 'agrisync_users';

const defaultUsers = {
  admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
  user: { username: 'user', password: 'user123', role: 'user', name: 'Regular User' }
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

function register(username, password, fullName, role) {
  const users = getStoredUsers();

  if (users[username]) {
    return { success: false, message: 'Username already exists' };
  }

  users[username] = {
    username: username,
    password: password,
    name: fullName,
    role: role
  };

  saveUsers(users);

  const userData = {
    username: username,
    name: fullName,
    role: role
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  return { success: true, user: userData };
}

function login(username, password, role) {
  const users = getStoredUsers();
  const user = users[username];

  if (user && user.password === password && user.role === role) {
    const userData = {
      username: user.username,
      name: user.name,
      role: user.role
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    return { success: true, user: userData };
  }

  return { success: false, message: 'Invalid username, password, or account type' };
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