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

    // Initialize Google Sign-In
    React.useEffect(() => {
      /* global google */
      if (window.google) {
        google.accounts.id.initialize({
          client_id: "668817215778-c9f5vqdkfjjbpqnjp7i7g3jrj4599efo.apps.googleusercontent.com",
          callback: handleGoogleResponse
        });
        google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    }, [isRegistering]);

    const handleGoogleResponse = (response) => {
      try {
        // Decode JWT token
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);

        // Login with Google profile
        const result = googleLogin({
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        });

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

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[var(--bg-white)] text-gray-500">Or continue with</span>
                </div>
              </div>

              <div id="googleSignInDiv" className="w-full flex justify-center"></div>

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