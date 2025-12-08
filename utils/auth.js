const AUTH_KEY = 'agrisync_user';

// FIREBASE CONFIGURATION - TODO: REPLACE WITH YOUR OWN CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let auth;
try {
  if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    console.log("Firebase initialized");
  } else if (typeof firebase !== 'undefined') {
    auth = firebase.auth();
  } else {
    console.warn("Firebase SDK not loaded");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Helper to save user to local storage for persistence across apps
function saveUserToLocal(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

async function register(email, password, fullName, role) {
  try {
    if (!auth) throw new Error("Firebase not initialized. Please check your configuration.");

    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Update profile with name
    await user.updateProfile({
      displayName: fullName
    });

    const userData = {
      uid: user.uid,
      email: user.email,
      name: fullName,
      role: role,
      authProvider: 'firebase'
    };

    saveUserToLocal(userData);
    return { success: true, user: userData };

  } catch (error) {
    console.error('Firebase Registration error:', error);
    let msg = error.message;
    if (error.code === 'auth/email-already-in-use') msg = 'Email is already registered';
    if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters';
    return { success: false, message: msg };
  }
}

async function login(email, password, role) {
  try {
    if (!auth) throw new Error("Firebase not initialized. Please check your configuration.");

    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || email.split('@')[0],
      role: role, // In a real app, role should come from database (Firestore), but for now we trust UI
      authProvider: 'firebase'
    };

    saveUserToLocal(userData);
    return { success: true, user: userData };

  } catch (error) {
    console.error('Firebase Login error:', error);
    let msg = error.message;
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') msg = 'Invalid email or password';
    return { success: false, message: msg };
  }
}

async function googleLogin(role) {
  try {
    if (!auth) throw new Error("Firebase not initialized");
    const provider = new firebase.auth.GoogleAuthProvider();

    // In some hackathon environments, popup might be blocked, but generally works
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    const userData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      picture: user.photoURL,
      role: role,
      authProvider: 'google'
    };

    saveUserToLocal(userData);
    return { success: true, user: userData };

  } catch (error) {
    console.error('Google Sign-In Error:', error);
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