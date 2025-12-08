function Sidebar({ activePage, setActivePage, user, isOpen }) {
  try {
    // Removed incorrect useContext call. t() is global.

    const allMenuItems = [
      // Common
      { id: 'home', label: t('home'), icon: 'house', roles: ['admin', 'farmer', 'fpo', 'processor', 'retailer', 'government'] },

      // Farmer Specific
      { id: 'advisor', label: t('advisor'), icon: 'bot', roles: ['admin', 'farmer'] },
      { id: 'weather', label: t('weather'), icon: 'cloud-sun', roles: ['admin', 'farmer'] },
      { id: 'schemes', label: t('schemes'), icon: 'landmark', roles: ['admin', 'farmer'] },

      // FPO Specific
      { id: 'procurement-mgmt', label: 'Procurement Mgmt', icon: 'clipboard-list', roles: ['admin', 'fpo'] },

      // Processor Specific
      { id: 'production', label: 'Production', icon: 'settings', roles: ['admin', 'processor'] },

      // Retailer Specific
      { id: 'demand-forecast', label: 'Demand & Sales Forecast', icon: 'bar-chart-2', roles: ['admin', 'retailer'] },

      // Shared Components
      { id: 'market', label: t('market'), icon: 'trending-up', roles: ['admin', 'farmer', 'fpo', 'processor', 'retailer', 'government'] },
      { id: 'finance', label: 'Finance (Credit/Ins.)', icon: 'indian-rupee', roles: ['admin', 'farmer', 'fpo'] },
      { id: 'inventory', label: 'Inventory', icon: 'package', roles: ['admin', 'fpo', 'processor', 'retailer'] },
      { id: 'logistics', label: 'Logistics', icon: 'truck', roles: ['admin', 'fpo', 'processor'] },
      { id: 'procurement', label: 'Procurement', icon: 'shopping-cart', roles: ['admin', 'processor', 'retailer', 'government'] },
      { id: 'contracts', label: t('contracts'), icon: 'file-check', roles: ['admin', 'farmer', 'fpo', 'processor'] },
      { id: 'warehouse', label: 'Warehouse & Logistics', icon: 'map-pin', roles: ['admin', 'farmer'] },
      { id: 'traceability', label: t('traceability'), icon: 'scan-line', roles: ['admin', 'retailer', 'government'] },
      { id: 'farmers', label: t('farmers'), icon: 'users', roles: ['admin', 'government'] },
      { id: 'calculator', label: t('calculator'), icon: 'calculator', roles: ['admin', 'farmer'] }
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
              <h1 className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>{t('appName')}</h1>
              <p className="text-xs text-[var(--text-secondary)]">{t('tagline')}</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gradient-to-r from-[var(--bg-lighter)] to-[var(--bg-light)] border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md text-white" style={{ background: 'var(--gradient-primary)' }}>
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