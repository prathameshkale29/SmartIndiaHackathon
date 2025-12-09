function Header({ user, onLogout, onNotificationClick, onSettingsClick, onToggleSidebar }) {
  try {
    const { unreadCount } = useNotification();

    return (
      <header className="bg-[var(--bg-white)] border-b border-[var(--border-color)] px-6 py-4" data-name="header" data-file="components/Header.js">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onToggleSidebar} className="mr-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="icon-menu text-xl text-[var(--text-secondary)]"></div>
            </button>
            <button onClick={onNotificationClick} className="relative">
              <div className="icon-bell text-xl text-[var(--text-secondary)] cursor-pointer hover:text-[var(--primary-color)] transition-colors"></div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={onSettingsClick}>
              <div className="icon-settings text-xl text-[var(--text-secondary)] cursor-pointer hover:text-[var(--primary-color)] transition-colors"></div>
            </button>
          </div>

          {/* User Profile Section */}
          <UserProfileDropdown user={user} />


        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}

function UserProfileDropdown({ user }) {
  const [showAccountMenu, setShowAccountMenu] = React.useState(false);
  const [otherAccounts, setOtherAccounts] = React.useState([]);

  React.useEffect(() => {
    if (typeof getMockUsers === 'function') {
      const allUsers = getMockUsers();
      setOtherAccounts(allUsers);
    }
  }, [user]);

  const handleSwitchAccount = (targetUser) => {
    if (typeof saveUserToLocal === 'function') {
      const sessionUser = { ...targetUser };
      delete sessionUser.password;
      saveUserToLocal(sessionUser);
      window.location.reload();
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
        onClick={() => setShowAccountMenu(!showAccountMenu)}
      >
        <div className="flex flex-col items-end hidden sm:flex">
          <p className="text-sm font-medium leading-none">{user?.name}</p>
          <p className="text-xs text-[var(--text-secondary)] capitalize">{user?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-white overflow-hidden ring-2 ring-white" style={{ background: 'var(--gradient-primary)' }}>
          <div className="icon-user text-sm text-white"></div>
        </div>
        <div className={`icon-chevron-down text-gray-400 text-xs transition-transform ${showAccountMenu ? 'rotate-180' : ''}`}></div>
      </div>

      {/* Account Dropdown */}
      {showAccountMenu && (
        <div className="absolute top-full right-0 w-64 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-50">
          <div className="p-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
            Switch Account
          </div>
          <div className="max-h-64 overflow-y-auto">
            {otherAccounts.length > 0 ? (
              otherAccounts.map(acc => (
                <div
                  key={acc.email}
                  onClick={() => handleSwitchAccount(acc)}
                  className={`flex items-center gap-3 p-3 hover:bg-green-50 cursor-pointer transition-colors ${acc.email === user?.email ? 'bg-green-50/50' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${acc.email === user?.email ? 'bg-green-600' : 'bg-gray-400'}`}>
                    {acc.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${acc.email === user?.email ? 'text-green-700' : 'text-gray-700'}`}>
                      {acc.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{acc.role}</p>
                  </div>

                  {/* Remove Account Action */}
                  {acc.email !== user?.email && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove account ${acc.name}?`)) {
                          if (typeof removeMockUser === 'function') {
                            removeMockUser(acc.email);
                            setOtherAccounts(getMockUsers()); // Refresh list
                          }
                        }
                      }}
                      className="p-1 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove Account"
                    >
                      <div className="icon-trash-2 text-xs"></div>
                    </button>
                  )}

                  {acc.email === user?.email && <div className="icon-check text-green-600"></div>}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-400">
                No other accounts found.
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
            <button
              onClick={() => {
                if (typeof logout === 'function') {
                  logout();
                  window.location.reload();
                }
              }}
              className="flex items-center justify-center gap-2 text-xs text-red-500 hover:text-red-700 font-medium w-full py-1.5 hover:bg-red-50 rounded"
            >
              <span className="icon-log-out"></span> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}