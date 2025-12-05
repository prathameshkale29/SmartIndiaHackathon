function Login({ onLogin }) {
  try {
    const [isRegistering, setIsRegistering] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [role, setRole] = React.useState('farmer');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [authMethod, setAuthMethod] = React.useState('email');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [showOtpInput, setShowOtpInput] = React.useState(false);

    // Placeholder for User's actual Client ID
    // TODO: User needs to replace this
    const GOOGLE_CLIENT_ID = "668817215778-c9f5vqdkfjjbpqnjp7i7g3jrj4599efo.apps.googleusercontent.com";

    // Role definitions
    const roles = [
      { value: 'farmer', label: 'Farmer', icon: 'sprout', description: 'Individual farmers growing oilseeds' },
      { value: 'fpo', label: 'FPO (Farmer Producer Organization)', icon: 'users', description: 'Collective of farmers' },
      { value: 'processor', label: 'Processor', icon: 'factory', description: 'Oil mills and processing units' },
      { value: 'retailer', label: 'Retailer', icon: 'store', description: 'Retailers and distributors' },
      { value: 'government', label: 'Government Official', icon: 'shield', description: 'Government departments and officials' },
      { value: 'admin', label: 'System Administrator', icon: 'settings', description: 'Platform administrators' }
    ];

    // Initialize Google Sign-In
    React.useEffect(() => {
      /* global google */
      if (window.google && window.google.accounts) {
        try {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          // Render the Google button
          google.accounts.id.renderButton(
            document.getElementById("google-signin-btn"),
            { theme: "outline", size: "large", width: "100%" }
          );
        } catch (e) {
          console.error("Google Identity Services Error:", e);
        }
      }
    }, [isRegistering]); // Re-render button if view changes

    // Helper to decode JWT text
    function parseJwt(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    }

    const handleGoogleResponse = (response) => {
      try {
        const credential = response.credential;
        const profile = parseJwt(credential);

        // Map Google profile to our user structure
        const user = {
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          role: role, // Use currently qualified role selection
          authMethod: 'google'
        };

        console.log("Google Login Success:", user);
        onLogin(user);

      } catch (err) {
        console.error("Token parse error:", err);
        setError("Failed to process Google Sign-In");
      }
    };

    const handleSendOTP = async () => {
      if (!phoneNumber) {
        setError('Please enter your phone number');
        return;
      }
      setLoading(true);
      // Simulate API delay for OTP
      setTimeout(() => {
        setLoading(false);
        setShowOtpInput(true);
        alert(`Mock OTP Sent: 123456`); // Demo purpose
      }, 1000);
    };

    const handleVerifyOTP = async () => {
      if (otp !== '123456') {
        setError('Invalid OTP (Use 123456)');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const user = {
          name: 'Phone User',
          phoneNumber: phoneNumber,
          role: role,
          authMethod: 'phone'
        };
        console.log("Phone Login Success:", user);
        onLogin(user);
        setLoading(false);
      }, 1000);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      if (authMethod === 'phone') {
        if (showOtpInput) {
          handleVerifyOTP();
        } else {
          handleSendOTP();
        }
        return;
      }

      setLoading(true);

      // Local Auth Validation
      if (!username || !password) {
        setError('Please enter username and password');
        setLoading(false);
        return;
      }

      if (isRegistering) {
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
      }

      // Simulate API delay
      setTimeout(() => {
        try {
          let result;
          if (isRegistering) {
            result = register(username, password, fullName, role);
          } else {
            result = login(username, password, role);
          }

          if (result.success) {
            onLogin(result.user);
          } else {
            setError(result.message);
          }
        } catch (err) {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }, 800);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[var(--bg-white)] rounded-2xl shadow-xl p-8 animate-fade-in relative">
            <div className="absolute top-4 right-4">
              <select
                value={getLanguage()}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border border-[var(--border-color)] rounded-lg px-2 py-1 bg-[var(--bg-white)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <div className="icon-leaf text-4xl text-white"></div>
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('appName')}</h1>
              <p className="text-sm text-[var(--text-secondary)]">{t('tagline')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Method Switcher */}
              <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('email'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMethod === 'email'
                    ? 'bg-white dark:bg-gray-600 shadow text-[var(--primary-color)]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                    }`}
                >
                  Email / Password
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod('phone'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMethod === 'phone'
                    ? 'bg-white dark:bg-gray-600 shadow text-[var(--primary-color)]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                    }`}
                >
                  Phone OTP
                </button>
              </div>

              {authMethod === 'email' && (
                <>

                  {isRegistering && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('fullName')}</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                        placeholder={t('fullName')}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('username')}</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                      placeholder={t('username')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('password')}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                      placeholder={t('password')}
                    />
                  </div>

                  {isRegistering && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('confirmPassword')}</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                        placeholder={t('confirmPassword')}
                      />
                    </div>
                  )}
                </>
              )}

              {authMethod === 'phone' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    {showOtpInput ? 'Enter OTP' : 'Phone Number'}
                  </label>
                  <div className="space-y-3">
                    {!showOtpInput ? (
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                        placeholder="+919876543210"
                      />
                    ) : (
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)] tracking-widest text-center text-lg"
                        placeholder="123456"
                      />
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                  {isRegistering ? 'Select Your Role' : 'Login As'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {roles.map((roleOption) => (
                    <label
                      key={roleOption.value}
                      className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${role === roleOption.value
                        ? 'border-[var(--primary-color)] bg-green-50 dark:bg-green-900/20'
                        : 'border-[var(--border-color)] hover:border-[var(--primary-color)] hover:bg-gray-50 dark:hover:bg-gray-700/30'
                        }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={roleOption.value}
                        checked={role === roleOption.value}
                        onChange={(e) => setRole(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${role === roleOption.value
                        ? 'bg-[var(--primary-color)] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                        <div className={`icon-${roleOption.icon} text-lg`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[var(--text-primary)] text-sm">{roleOption.label}</div>
                        {isRegistering && (
                          <div className="text-xs text-[var(--text-secondary)] mt-0.5">{roleOption.description}</div>
                        )}
                      </div>
                      {role === roleOption.value && (
                        <div className="icon-check-circle text-[var(--primary-color)] text-xl"></div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (
                  authMethod === 'phone'
                    ? (showOtpInput ? 'Verify & Login' : 'Send OTP')
                    : (isRegistering ? t('register') : t('login'))
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[var(--bg-white)] text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign-In Button Container */}
              <div id="google-signin-btn" className="w-full flex justify-center h-[44px]"></div>
              {!GOOGLE_CLIENT_ID.includes("apps.googleusercontent") && (
                <p className="text-xs text-center text-red-500 mt-2">
                  Developer: Please set GOOGLE_CLIENT_ID in Login.js
                </p>
              )}

            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-sm text-[var(--primary-color)] hover:underline"
              >
                {isRegistering ? t('login') : t('register')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Login component error:', error);
    return null;
  }
}