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
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
              <p className="text-xs text-[var(--text-secondary)] capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-[var(--secondary-color)] rounded-full flex items-center justify-center">
              <div className="icon-user text-xl text-[var(--primary-color)]"></div>
            </div>
            <button
              onClick={onLogout}
              className="ml-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex items-center gap-2"
              title={t('logout')}
            >
              <div className="icon-log-out text-lg"></div>
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}