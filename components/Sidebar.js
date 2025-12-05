function Sidebar({ activePage, setActivePage, user, isOpen }) {
  try {
    // Removed incorrect useContext call. t() is global.

    const allMenuItems = [
      { id: 'home', label: t('home'), icon: 'house', roles: ['admin', 'user'] },
      { id: 'farmers', label: t('farmers'), icon: 'users', roles: ['admin', 'user'] },
      { id: 'market', label: t('market'), icon: 'trending-up', roles: ['admin', 'user'] },
      { id: 'warehouse', label: 'Warehouse & Logistics', icon: 'warehouse', roles: ['admin', 'user'] },
      { id: 'contracts', label: t('contracts'), icon: 'file-check', roles: ['admin', 'user'] },
      { id: 'weather', label: t('weather'), icon: 'cloud-sun', roles: ['admin', 'user'] },
      { id: 'schemes', label: t('schemes'), icon: 'landmark', roles: ['admin', 'user'] },
      { id: 'calculator', label: t('calculator'), icon: 'calculator', roles: ['admin', 'user'] },
      { id: 'advisor', label: t('advisor'), icon: 'bot', roles: ['admin', 'user'] },
      { id: 'traceability', label: t('traceability'), icon: 'truck', roles: ['admin', 'user'] },
      { id: 'procurement', label: 'Procurement', icon: 'shopping-cart', roles: ['admin', 'user'] }
    ];

    const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

    return (
      <div className={`bg-[var(--bg-white)] border-r border-[var(--border-color)] flex flex-col transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isOpen ? 'w-64' : 'w-0'}`} data-name="sidebar" data-file="components/Sidebar.js">
        <div className="p-6 border-b border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-white)] to-[var(--bg-light)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg bg-white">
              <img src="agrisync-logo.jpg" alt="AgriSync Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{t('appName')}</h1>
              <p className="text-xs text-[var(--text-secondary)]">{t('tagline')}</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gradient-to-r from-[var(--bg-lighter)] to-[var(--bg-light)] border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
              <div className="icon-user text-sm text-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-[var(--text-secondary)] capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`sidebar-link ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <div className={`icon-${item.icon} text-xl`}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
          {t('copyright')}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Sidebar component error:', error);
    return null;
  }
}