function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [role, setRole] = React.useState('farmer');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [authMethod, setAuthMethod] = React.useState('email');
  // Removed Phone Auth Logic as per request (Google Auth & Username/Password only)

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Role definitions
  const roles = [
    { value: 'farmer', label: 'Farmer', icon: 'tractor', description: 'Individual farmers growing oilseeds' },
    { value: 'fpo', label: 'FPO (Farmer Producer Organization)', icon: 'users', description: 'Collective of farmers' },
    { value: 'processor', label: 'Processor', icon: 'factory', description: 'Oil mills and processing units' },
    { value: 'retailer', label: 'Retailer', icon: 'store', description: 'Retailers and distributors' }
  ];

  // Defensive fallback for i18n functions in case script fails to load
  const t = window.t || ((key) => key);
  const getLanguage = window.getLanguage || (() => 'en');
  const setLanguage = window.setLanguage || (() => { });



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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

      // Username Validation: Alphabets & Numbers only, no special characters
      const usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!usernameRegex.test(username)) {
        setError('Username must contain only alphabets and numbers (no special characters)');
        setLoading(false);
        return;
      }

      // Password Validation: 1 Alphabet, 1 Number, 1 Special Character
      // Using a broad set of special characters
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
      if (!passwordRegex.test(password)) {
        setError('Password must contain at least one alphabet, one number, and one special character');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
    }

    try {
      // Use Firebase Auth functions from auth.js
      console.log("Attempting login/register with role:", role);
      let result;
      if (isRegistering) {
        result = await register(username, password, fullName, role);
      } else {
        result = await login(username, password, role);
      }

      if (result.success) {
        console.log("Login successful, calling onLogin with:", result.user);
        onLogin(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
            <img src="agrisync-logo.jpg" alt="Agri-Sync Logo" className="w-24 h-24 mx-auto mb-4 rounded-2xl shadow-lg object-cover" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('appName')}</h1>
            <p className="text-sm text-[var(--text-secondary)]">{t('tagline')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                  placeholder={t('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <div className={showPassword ? "icon-eye-off text-xl" : "icon-eye text-xl"}></div>
                </button>
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('confirmPassword')}</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                    placeholder={t('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <div className={showConfirmPassword ? "icon-eye-off text-xl" : "icon-eye text-xl"}></div>
                  </button>
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
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${role === roleOption.value
                      ? 'bg-[var(--primary-color)] text-white'
                      : 'bg-green-50 text-green-700 border border-green-100 group-hover:bg-green-100'
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
              {loading ? 'Please wait...' : (isRegistering ? t('register') : t('login'))}
            </button>



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
}