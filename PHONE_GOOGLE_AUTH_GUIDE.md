# Firebase Phone & Google Authentication Setup

## 📱 Phone Number Authentication

### Prerequisites
- Firebase project created
- Firebase SDK added to your project
- Phone authentication enabled in Firebase Console

### Step 1: Enable Phone Authentication in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Phone** provider
5. Toggle **Enable**
6. Click **Save**

### Step 2: Configure reCAPTCHA

Phone authentication requires reCAPTCHA verification:

1. In Firebase Console → **Authentication** → **Settings**
2. Scroll to **App verification**
3. Add your domain to **Authorized domains**
4. For development, `localhost` is automatically authorized

### Step 3: Add Test Phone Numbers (Optional)

For testing without using real SMS:

1. In **Phone** sign-in method settings
2. Click **Phone numbers for testing**
3. Add test numbers with verification codes:
   - Phone: `+91 1234567890`
   - Code: `123456`
4. Click **Save**

### Step 4: Update Your Login Component

See `PHONE_AUTH_INTEGRATION.js` for complete code examples.

Key changes needed in `Login.js`:
```javascript
// Add state for phone auth
const [authMethod, setAuthMethod] = React.useState('email');
const [phoneNumber, setPhoneNumber] = React.useState('');
const [otp, setOtp] = React.useState('');
const [showOtpInput, setShowOtpInput] = React.useState(false);

// Add reCAPTCHA container in JSX
<div id="recaptcha-container"></div>
```

### Phone Auth Flow

1. **User enters phone number** → Click "Send OTP"
2. **Firebase sends SMS** → reCAPTCHA verification
3. **User enters OTP** → Click "Verify OTP"
4. **Firebase verifies code** → User logged in
5. **New users** → Prompted for name and role
6. **User data saved** → Firestore database

### Phone Number Format

Always include country code:
- ✅ Correct: `+919876543210`
- ✅ Correct: `+1234567890`
- ❌ Wrong: `9876543210`
- ❌ Wrong: `91-9876543210`

---

## 🔐 Google Sign-In Authentication

### Step 1: Enable Google Sign-In

1. Go to Firebase Console → **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Enter **Project support email**
5. Click **Save**

### Step 2: Configure OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Fill in required information:
   - App name: `AgriSync`
   - User support email: Your email
   - Developer contact: Your email
5. Add scopes: `email`, `profile`
6. Save and continue

### Step 3: Add Authorized Domains

1. In Firebase Console → **Authentication** → **Settings**
2. Under **Authorized domains**, add:
   - Your production domain
   - `localhost` (for development)

### Step 4: Update Google Sign-In Button

The Google Sign-In is already integrated in your Login component:

```javascript
// Google Sign-In button (already in your code)
<div id="googleSignInDiv" className="w-full flex justify-center"></div>

// Handler function
const handleGoogleResponse = async () => {
  try {
    const result = await window.firebaseAuth.googleLogin(role);
    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError('Google sign-in failed');
  }
};
```

### Google Sign-In Flow

1. **User clicks Google button** → Popup opens
2. **User selects Google account** → Grants permissions
3. **Firebase authenticates** → Returns user data
4. **Check if new user** → Create profile in Firestore
5. **User logged in** → Redirect to dashboard

---

## 🔒 Security Best Practices

### Phone Authentication
1. **Rate Limiting**: Firebase automatically limits SMS sends
2. **reCAPTCHA**: Prevents bot abuse
3. **Test Numbers**: Use for development, not production
4. **SMS Quota**: Monitor usage in Firebase Console
5. **App Check**: Enable for production apps

### Google Sign-In
1. **OAuth Scopes**: Only request necessary permissions
2. **Token Validation**: Firebase handles automatically
3. **Secure Storage**: User data in Firestore with security rules
4. **HTTPS**: Required for production
5. **Domain Verification**: Add only trusted domains

---

## 🎨 UI/UX Recommendations

### Phone Auth UI
```
┌─────────────────────────────────────┐
│  [Email] [Phone] ← Toggle buttons  │
│                                     │
│  Phone Number                       │
│  ┌──────────────────┬─────────────┐│
│  │ +91 9876543210   │  Send OTP   ││
│  └──────────────────┴─────────────┘│
│  Include country code (e.g., +91)  │
│                                     │
│  Enter OTP                          │
│  ┌─────────────────────────────────┐│
│  │      0  0  0  0  0  0          ││
│  └─────────────────────────────────┘│
│  OTP sent to +91 9876543210        │
│                    [Resend OTP]    │
│                                     │
│  ┌─────────────────────────────────┐│
│  │       Verify OTP                ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Features to Add
- ✅ OTP auto-fill (browser feature)
- ✅ Countdown timer for resend
- ✅ Loading states
- ✅ Error messages
- ✅ Success animations

---

## 📊 Firestore Data Structure

### User Document (Phone Auth)
```javascript
{
  uid: "firebase_uid",
  phoneNumber: "+919876543210",
  name: "John Doe",
  role: "farmer",
  authProvider: "phone",
  email: null,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### User Document (Google Auth)
```javascript
{
  uid: "firebase_uid",
  email: "user@example.com",
  name: "John Doe",
  role: "farmer",
  picture: "https://...",
  authProvider: "google",
  phoneNumber: null,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🧪 Testing

### Test Phone Authentication
```javascript
// Use test number from Firebase Console
Phone: +91 1234567890
OTP: 123456

// Or use real number for actual SMS
Phone: +91 [your number]
OTP: [received via SMS]
```

### Test Google Sign-In
1. Click "Sign in with Google"
2. Select test Google account
3. Grant permissions
4. Verify user created in Firestore

---

## 🐛 Troubleshooting

### Phone Auth Issues

**Problem**: "reCAPTCHA not defined"
- **Solution**: Ensure Firebase Auth SDK is loaded before firebaseAuth.js

**Problem**: "Invalid phone number"
- **Solution**: Always include country code with + prefix

**Problem**: "SMS quota exceeded"
- **Solution**: Check Firebase Console → Usage tab, upgrade plan if needed

**Problem**: "reCAPTCHA verification failed"
- **Solution**: Check authorized domains in Firebase Console

### Google Sign-In Issues

**Problem**: "Popup blocked"
- **Solution**: Ask user to allow popups for your domain

**Problem**: "OAuth consent screen not configured"
- **Solution**: Complete OAuth setup in Google Cloud Console

**Problem**: "Unauthorized domain"
- **Solution**: Add domain to authorized domains in Firebase Console

---

## 📈 Production Checklist

### Before Going Live

- [ ] Remove test phone numbers
- [ ] Configure SMS quota limits
- [ ] Enable Firebase App Check
- [ ] Set up Firestore security rules
- [ ] Add production domains to authorized list
- [ ] Test on real devices
- [ ] Monitor authentication metrics
- [ ] Set up error logging
- [ ] Configure rate limiting
- [ ] Add privacy policy link

---

## 💰 Pricing Considerations

### Phone Authentication
- **Free Tier**: 10,000 verifications/month
- **Paid**: $0.06 per verification after free tier
- **SMS Costs**: Vary by country

### Google Sign-In
- **Free**: Unlimited authentications
- **No additional costs**

### Firestore
- **Free Tier**: 50,000 reads/day, 20,000 writes/day
- **Paid**: Pay as you go

---

## 📚 Additional Resources

- [Firebase Phone Auth Docs](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Google Sign-In Docs](https://firebase.google.com/docs/auth/web/google-signin)
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
