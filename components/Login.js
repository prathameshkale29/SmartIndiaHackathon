function Login({ onLogin }) {
  try {
    const [isRegistering, setIsRegistering] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [role, setRole] = React.useState('user');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleGoogleAuth = () => {
      try {
        // Redirect to backend Google OAuth route (configure this in your backend)
        window.location.href = '/auth/google';
      } catch (err) {
        console.error('Google auth redirect failed:', err);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      if (!username || !password) {
        setError('Please enter username and password');
        return;
      }

      if (isRegistering) {
        if (!fullName) {
          setError('Please enter your full name');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
      }

      setLoading(true);
      
      setTimeout(() => {
        if (isRegistering) {
          const result = register(username, password, fullName, role);
          if (result.success) {
            onLogin(result.user);
          } else {
            setError(result.message);
          }
        } else {
          const result = login(username, password, role);
          if (result.success) {
            onLogin(result.user);
          } else {
            setError(result.message);
          }
        }
        setLoading(false);
      }, 800);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4" data-name="login" data-file="components/Login.js">
        <div className="w-full max-w-md">
          <div className="bg-[var(--bg-white)] rounded-2xl shadow-xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <div className="icon-leaf text-4xl text-white"></div>
              </div>
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

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('accountType')}</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all bg-[var(--bg-white)] text-[var(--text-primary)]"
                >
                  <option value="user">{t('farmer')}</option>
                  <option value="admin">{t('admin')}</option>
                </select>
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
                {isRegistering ? t('register') : t('login')}
              </button>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full border border-gray-300 py-3 text-base font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                >
                  <span className="icon-google"></span>
                  <span>{isRegistering ? 'Sign up with Google' : 'Sign in with Google'}</span>
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setUsername('');
                  setPassword('');
                  setConfirmPassword('');
                  setFullName('');
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