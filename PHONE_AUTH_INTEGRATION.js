// Phone Authentication Component for Login.js
// Add this to your Login component to enable phone number authentication

// ============================================
// STEP 1: Add Phone Auth State Variables
// ============================================

const [authMethod, setAuthMethod] = React.useState('email'); // 'email' or 'phone'
const [phoneNumber, setPhoneNumber] = React.useState('');
const [otp, setOtp] = React.useState('');
const [showOtpInput, setShowOtpInput] = React.useState(false);
const [otpSent, setOtpSent] = React.useState(false);

// ============================================
// STEP 2: Add Phone Auth Handler Functions
// ============================================

const handleSendOTP = async () => {
    if (!phoneNumber) {
        setError('Please enter your phone number');
        return;
    }

    // Validate phone number format
    if (!phoneNumber.startsWith('+')) {
        setError('Phone number must include country code (e.g., +91 for India)');
        return;
    }

    setLoading(true);
    setError('');

    try {
        const result = await window.firebaseAuth.sendOTP(phoneNumber, 'recaptcha-container');

        if (result.success) {
            setOtpSent(true);
            setShowOtpInput(true);
            setError('');
            // Show success message
            alert(result.message);
        } else {
            setError(result.message);
        }
    } catch (error) {
        setError('Failed to send OTP. Please try again.');
    } finally {
        setLoading(false);
    }
};

const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
    }

    setLoading(true);
    setError('');

    try {
        const result = await window.firebaseAuth.verifyOTP(otp, fullName, role);

        if (result.success) {
            onLogin(result.user);
        } else if (result.requiresName) {
            // New user needs to provide name
            setError('Please enter your full name to complete registration');
            setIsRegistering(true);
        } else {
            setError(result.message);
        }
    } catch (error) {
        setError('Invalid OTP. Please try again.');
    } finally {
        setLoading(false);
    }
};

const handleResendOTP = async () => {
    setOtp('');
    setOtpSent(false);
    setShowOtpInput(false);
    await handleSendOTP();
};

// ============================================
// STEP 3: Add Phone Auth UI to Login Form
// ============================================

// Add auth method toggle buttons before the form
<div className="flex gap-2 mb-4">
    <button
        type="button"
        onClick={() => {
            setAuthMethod('email');
            setError('');
            setOtpSent(false);
            setShowOtpInput(false);
        }}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${authMethod === 'email'
                ? 'bg-[var(--primary-color)] text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-[var(--text-primary)]'
            }`}
    >
        <div className="flex items-center justify-center gap-2">
            <div className="icon-mail text-lg"></div>
            <span>Email</span>
        </div>
    </button>
    <button
        type="button"
        onClick={() => {
            setAuthMethod('phone');
            setError('');
        }}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${authMethod === 'phone'
                ? 'bg-[var(--primary-color)] text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-[var(--text-primary)]'
            }`}
    >
        <div className="flex items-center justify-center gap-2">
            <div className="icon-phone text-lg"></div>
            <span>Phone</span>
        </div>
    </button>
</div>

// Replace email/password inputs with conditional rendering
{
    authMethod === 'email' ? (
        <>
            {/* Existing email/password fields */}
            {isRegistering && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                        placeholder="Enter your full name"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Email
                </label>
                <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                    placeholder="Enter your password"
                />
            </div>

            {isRegistering && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                        placeholder="Confirm your password"
                    />
                </div>
            )}
        </>
    ) : (
    <>
        {/* Phone authentication fields */}
        {isRegistering && (
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                    placeholder="Enter your full name"
                />
            </div>
        )}

        <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Phone Number
            </label>
            <div className="flex gap-2">
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={otpSent}
                    className="flex-1 px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)] disabled:opacity-50"
                    placeholder="+91 9876543210"
                />
                {!otpSent && (
                    <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="btn-primary px-6 whitespace-nowrap"
                    >
                        Send OTP
                    </button>
                )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
                Include country code (e.g., +91 for India)
            </p>
        </div>

        {showOtpInput && (
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Enter OTP
                </label>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength="6"
                    className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)] text-center text-2xl tracking-widest"
                    placeholder="000000"
                />
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-[var(--text-secondary)]">
                        OTP sent to {phoneNumber}
                    </p>
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-xs text-[var(--primary-color)] hover:underline"
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        )}
    </>
)
}

// ============================================
// STEP 4: Update Submit Button
// ============================================

<button
  type="submit"
  disabled={loading || (authMethod === 'phone' && !otpSent && !showOtpInput)}
  className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
  onClick={(e) => {
    e.preventDefault();
    if (authMethod === 'phone' && showOtpInput) {
      handleVerifyOTP();
    } else {
      handleSubmit(e);
    }
  }}
>
  {loading ? 'Please wait...' : 
   authMethod === 'phone' && showOtpInput ? 'Verify OTP' :
   isRegistering ? 'Register' : 'Login'}
</button>

// ============================================
// STEP 5: Add reCAPTCHA Container
// ============================================

// Add this div before the closing form tag
<div id="recaptcha-container"></div>

// ============================================
// STEP 6: Enable Phone Auth in Firebase Console
// ============================================

/*
1. Go to Firebase Console → Authentication → Sign-in method
2. Click on "Phone" provider
3. Toggle "Enable"
4. Add your app domain to authorized domains
5. For testing, you can add test phone numbers:
   - Go to "Phone numbers for testing"
   - Add: +91 1234567890 with code: 123456
6. Click "Save"

Note: For production, you'll need to:
- Set up App Verification (reCAPTCHA)
- Configure SMS quota limits
- Consider using Firebase App Check for security
*/
