function Sidebar({ activePage, setActivePage, user, isOpen }) {
  try {
    const allMenuItems = [

      // Farmer Specific
      { id: 'home', label: 'Home', icon: 'house', roles: ['admin', 'farmer'] },
      { id: 'my-produce', label: 'My Produce', icon: 'sprout', roles: ['admin', 'farmer'] },
      { id: 'advisor', label: 'AI Advisor', icon: 'bot', roles: ['admin', 'farmer'] },
      { id: 'weather', label: 'Weather Dashboard', icon: 'cloud-sun', roles: ['admin', 'farmer'] },

      // Shared Features (Integrated across roles)
      { id: 'market', label: 'Market Prices', icon: 'trending-up', roles: ['admin', 'farmer', 'fpo', 'processor', 'retailer', 'government'] },
      { id: 'contracts', label: 'Contracts', icon: 'file-check', roles: ['admin', 'farmer', 'fpo', 'processor'] },
      { id: 'finance', label: 'Finance', icon: 'indian-rupee', roles: ['admin', 'farmer', 'fpo'] },
      { id: 'inventory', label: 'Inventory', icon: 'warehouse', roles: ['admin', 'fpo', 'processor', 'retailer'] },
      { id: 'logistics', label: 'Logistics', icon: 'truck', roles: ['admin', 'fpo', 'processor', 'retailer'] },

      { id: 'schemes', label: 'Gov Schemes / Agri-Stack', icon: 'landmark', roles: ['admin', 'farmer'] },
      { id: 'traceability', label: 'Shipment Tracking', icon: 'truck', roles: ['admin', 'farmer', 'retailer', 'government'] },
      { id: 'calculator', label: 'Calculator', icon: 'calculator', roles: ['admin', 'farmer'] },

      // FPO Specific
      { id: 'procurement-mgmt', label: 'Farmer Procurement', icon: 'users', roles: ['admin', 'fpo'] },
      { id: 'quality', label: 'Quality / Grading', icon: 'clipboard-check', roles: ['admin', 'fpo'] },
      { id: 'batches', label: 'Batch Creation', icon: 'box', roles: ['admin', 'fpo'] },
      { id: 'demand-forecast', label: 'Market Demand Forecast', icon: 'bar-chart-2', roles: ['admin', 'fpo'] },

      // Processor Specific
      { id: 'procurement_raw', label: 'Raw Material Procurement', icon: 'shopping-cart', roles: ['admin', 'processor'] },
      { id: 'production_batch', label: 'Batch Processing', icon: 'settings', roles: ['admin', 'processor'] },
      { id: 'dashboard_processor', label: 'Production Dashboard', icon: 'activity', roles: ['admin', 'processor'] },
      { id: 'compliance', label: 'Quality & Compliance', icon: 'shield-check', roles: ['admin', 'processor'] },

      // Retailer Specific
      { id: 'demand-forecast-retailer', label: 'Demand & Sales Forecast', icon: 'bar-chart-2', roles: ['admin', 'retailer'] },
      { id: 'verified_batches', label: 'Verified Batches', icon: 'package-check', roles: ['admin', 'retailer'] },
      { id: 'procurement_orders', label: 'Procurement Orders', icon: 'shopping-bag', roles: ['admin', 'retailer'] },
      { id: 'traceability_viewer', label: 'Traceability Viewer', icon: 'scan-line', roles: ['admin', 'retailer'] },
      { id: 'supply_chain', label: 'Supply Chain', icon: 'share-2', roles: ['admin', 'retailer'] },

      // Other/Utility
      { id: 'procurement', label: 'Procurement', icon: 'shopping-cart', roles: ['admin', 'government'] },
      { id: 'warehouse', label: 'Warehouse & Logistics', icon: 'map-pin', roles: ['admin'] },
      { id: 'farmers', label: t('farmers'), icon: 'users', roles: ['admin', 'government'] },
      { id: 'intercropping', label: 'Agri-Twin (Sim)', icon: 'layers', roles: ['admin', 'farmer', 'fpo'] },
      { id: 'bhuvan', label: 'Oil Palm Zone (ISRO)', icon: 'map', roles: ['admin', 'fpo', 'government'] },
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