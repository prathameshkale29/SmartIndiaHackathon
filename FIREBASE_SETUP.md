# Firebase Authentication Setup Guide

## 🔥 Setting Up Firebase for AgriSync

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `AgriSync` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Register Your Web App

1. In Firebase Console, click the **Web icon** (`</>`)
2. Register app nickname: `AgriSync Web`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. **Copy the Firebase configuration** - you'll need this!

### Step 3: Enable Authentication Methods

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable the following providers:

#### Email/Password
- Click **"Email/Password"**
- Toggle **"Enable"**
- Click **"Save"**

#### Google Sign-In
- Click **"Google"**
- Toggle **"Enable"**
- Enter project support email
- Click **"Save"**

### Step 4: Set Up Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules next)
4. Choose your preferred location
5. Click **"Enable"**

### Step 5: Configure Firestore Security Rules

Go to **"Rules"** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Allow users to read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to create their own profile during registration
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to update their own profile
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Admins can read all user data
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Add more collections as needed
  }
}
```

Click **"Publish"**

### Step 6: Add Firebase SDK to Your Project

Add these script tags to your `index.html` **before** the closing `</body>` tag:

```html
<!-- Firebase App (core) -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>

<!-- Firebase Authentication -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>

<!-- Firebase Firestore -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- Your Firebase Auth utility -->
<script src="utils/firebaseAuth.js"></script>
```

### Step 7: Configure Firebase in Your App

1. Open `utils/firebaseAuth.js`
2. Replace the configuration with your Firebase project config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // From Firebase Console
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 8: Update Login Component

The Login component needs to use Firebase auth functions. Update `components/Login.js`:

```javascript
// Replace the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    let result;
    if (isRegistering) {
      // Validation
      if (!fullName) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Register with Firebase
      result = await window.firebaseAuth.register(username, password, fullName, role);
    } else {
      // Login with Firebase
      result = await window.firebaseAuth.login(username, password);
    }

    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.message);
    }
  } catch (error) {
    setError('An unexpected error occurred');
  } finally {
    setLoading(false);
  }
};

// Update Google Sign-In handler
const handleGoogleResponse = async () => {
  try {
    const result = await window.firebaseAuth.googleLogin(role);
    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.message);
    }
  } catch (err) {
    console.error('Google login error:', err);
    setError('Google sign-in failed');
  }
};
```

### Step 9: Test Your Authentication

**Test Accounts:**
1. **Register a new account**
   - Email: test@example.com
   - Password: test123
   - Role: Farmer

2. **Login with Google**
   - Click "Sign in with Google"
   - Select your Google account
   - Choose role: FPO

3. **Verify in Firebase Console**
   - Go to Authentication → Users
   - You should see your registered users
   - Go to Firestore → users collection
   - Verify user data with roles

### Step 10: Optional Features

#### Password Reset
Add a "Forgot Password?" link in Login.js:

```javascript
const handlePasswordReset = async () => {
  if (!username) {
    setError('Please enter your email address');
    return;
  }
  
  const result = await window.firebaseAuth.resetPassword(username);
  if (result.success) {
    alert(result.message);
  } else {
    setError(result.message);
  }
};
```

#### Email Verification
Enable in Firebase Console → Authentication → Templates → Email verification

## 📊 Firebase Features You Get

✅ **Secure Authentication** - Industry-standard security
✅ **User Management** - Built-in user dashboard
✅ **Password Reset** - Automated email flow
✅ **Google Sign-In** - One-click social login
✅ **Role-Based Access** - Store roles in Firestore
✅ **Real-time Sync** - Firestore real-time updates
✅ **Scalability** - Handles millions of users
✅ **Analytics** - Track user engagement

## 🔒 Security Best Practices

1. **Never commit** your Firebase config with real keys to Git
2. Use **environment variables** for production
3. Set up **Firestore security rules** properly
4. Enable **email verification** for production
5. Implement **rate limiting** for auth attempts
6. Use **reCAPTCHA** for bot protection

## 🚀 Next Steps

1. Replace placeholder config with your Firebase credentials
2. Add Firebase SDK scripts to index.html
3. Update Login.js to use Firebase auth
4. Test registration and login
5. Deploy to Firebase Hosting (optional)

## 📝 Firestore Data Structure

```
users (collection)
  └── {userId} (document)
      ├── uid: string
      ├── email: string
      ├── name: string
      ├── role: string (farmer|fpo|processor|retailer|government|admin)
      ├── picture: string (optional)
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

## 🆘 Troubleshooting

**Issue:** Firebase not defined
- **Solution:** Make sure Firebase SDK scripts are loaded before firebaseAuth.js

**Issue:** Auth domain not authorized
- **Solution:** Add your domain in Firebase Console → Authentication → Settings → Authorized domains

**Issue:** Google Sign-In not working
- **Solution:** Verify Google provider is enabled and OAuth consent screen is configured

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth/web/start)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
