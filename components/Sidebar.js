function Sidebar({ activePage, setActivePage, user, isOpen }) {
  try {
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
    const [showAccountMenu, setShowAccountMenu] = React.useState(false);
    const [otherAccounts, setOtherAccounts] = React.useState([]);

    React.useEffect(() => {
      // Load other available accounts
      if (typeof getMockUsers === 'function') {
        const allUsers = getMockUsers();
        // Filter out current user if possible, or just show all
        // The user object might not have uid if it came from session storage sometimes, but auth.js adds it.
        // let's just show all for simplicity of switching back and forth
        setOtherAccounts(allUsers);
      }
    }, [user]);

    const handleSwitchAccount = (targetUser) => {
      if (typeof saveUserToLocal === 'function') {
        // We need to save the target user as the current user
        // targetUser from getMockUsers has a password which we should ideally strip, but saveUserToLocal handles it?
        // saveUserToLocal just saves what is passed.
        const sessionUser = { ...targetUser };
        delete sessionUser.password; // clean up
        saveUserToLocal(sessionUser);
        window.location.reload();
      }
    };
    const t = (typeof window !== 'undefined' && window.t) ? window.t : (key => key);
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
      { id: 'traceability', label: 'Shipment Tracking', icon: 'truck', roles: ['admin', 'retailer', 'government'] },
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
      { id: 'intercropping', label: 'Agri-Twin (Sim)', icon: 'layers', roles: ['admin', 'farmer'] },
      { id: 'bhuvan', label: 'Oil Palm Zone (ISRO)', icon: 'map', roles: ['admin', 'government'] },
    ];

    const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

    return (
      <>
        {/* Desktop/Tablet Sidebar */}
        {/* Desktop/Tablet Sidebar */}
        <div className={`hidden md:flex bg-[var(--bg-white)] border-r border-[var(--border-color)] flex-col transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isOpen ? 'w-64' : 'w-0'}`} data-name="sidebar" data-file="components/Sidebar.js">
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

          {/* Interactive Profile Section */}
          <div className="relative">
            <div
              className="px-4 py-3 bg-gradient-to-r from-[var(--bg-lighter)] to-[var(--bg-light)] border-b border-[var(--border-color)] cursor-pointer hover:bg-gray-50 transition-colors group"
              onClick={() => setShowAccountMenu(!showAccountMenu)}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md text-white overflow-hidden" style={{ background: 'var(--gradient-primary)' }}>
                  {/* If user has an image, show it, else icon */}
                  <div className="icon-user text-sm text-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] capitalize">{user?.role}</p>
                </div>
                <div className={`icon-chevron-down text-gray-400 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`}></div>
              </div>
            </div>

            {/* Account Dropdown */}
            {showAccountMenu && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-50">
                <div className="p-2 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">
                  Switch Account
                </div>
                <div className="max-h-48 overflow-y-auto">
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
                    className="text-xs text-red-500 hover:text-red-700 font-medium w-full py-1"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
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

        {/* Mobile Bottom Navigation - Expanded */}
        < div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" >
          <div className="flex justify-around items-center h-16 px-2">
            {/* Show top 4 items */}
            {menuItems.slice(0, 4).map(item => (
              <button
                key={item.id}
                onClick={() => { setActivePage(item.id); setShowMobileMenu(false); }}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activePage === item.id ? 'text-[var(--primary-color)]' : 'text-gray-400'}`}
              >
                <div className={`icon-${item.icon} text-2xl mb-0.5 transition-transform ${activePage === item.id ? 'scale-110' : ''}`}></div>
                <span className="text-[10px] font-medium truncate w-16 text-center">{item.label}</span>
                {activePage === item.id && <div className="h-1 w-1 bg-[var(--primary-color)] rounded-full absolute bottom-1"></div>}
              </button>
            ))}

            {/* More Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${showMobileMenu ? 'text-[var(--primary-color)]' : 'text-gray-400'}`}
            >
              <div className="icon-grid text-2xl mb-0.5"></div>
              <span className="text-[10px] font-medium text-center">More</span>
            </button>
          </div>
        </div >

        {/* Mobile Full Menu Drawer */}
        {
          showMobileMenu && (
            <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowMobileMenu(false)}>
              <div className="bg-white rounded-t-2xl max-h-[75vh] overflow-y-auto w-full p-4 animate-slide-up shadow-2xl pb-20" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="font-bold text-lg text-gray-800">All Menu Options</h3>
                  <button onClick={() => setShowMobileMenu(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <div className="icon-x text-lg"></div>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setActivePage(item.id); setShowMobileMenu(false); }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${activePage === item.id ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}
                    >
                      <div className={`icon-${item.icon} text-2xl mb-2`}></div>
                      <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        }
      </>
    );
  } catch (error) {
    console.error('Sidebar component error:', error);
    return null;
  }
}