class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    const [activePage, setActivePage] = React.useState('home');
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [showSettings, setShowSettings] = React.useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    React.useEffect(() => {
      initTheme();
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    }, []);

    const handleLogin = (userData) => {
      setUser(userData);
    };

    const handleLogout = () => {
      logout();
      setUser(null);
      setActivePage('home');
    };

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-light)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--primary-color)] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-[var(--primary-color)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-[var(--primary-color)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      );
    }

    if (!user) {
      return <Login onLogin={handleLogin} />;
    }

    const renderContent = () => {
      switch (activePage) {
        case 'home':
          return <HomePage setActivePage={setActivePage} />;
        case 'farmers':
          return <FarmersPage />;
        case 'market':
          return <MarketPage />;
        case 'warehouse':
          return <WarehousePage />;
        case 'credit':
          return <CreditPage />;
        case 'advisor':
          return <AdvisorPage />;
        case 'policy':
          return <PolicyPage />;
        case 'contracts':
          return <ContractsPage />;
        case 'traceability':
          return (
            <div className="animate-circular-reveal" data-name="supply-chain-page" data-file="app.js">
              <BlockchainTracker user={user} />
            </div>
          );
        case 'agristack':
          window.location.href = 'agristack.html';
          return null;
        case 'weather':
          return <WeatherPage />;
        case 'schemes':
          return <SchemesPage />;
        case 'calculator':
          return <CalculatorPage />;
        case 'procurement':
          return (
            <div className="animate-circular-reveal" data-name="procurement-page" data-file="app.js">
              <ProcurementPage />
            </div>
          );
        default:
          return <HomePage />;
      }
    };

    return (
      <div className="flex min-h-screen max-w-full overflow-x-hidden" data-name="app" data-file="app.js">
        <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} isOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <Header
            user={user}
            onLogout={handleLogout}
            onNotificationClick={() => setShowNotifications(true)}
            onSettingsClick={() => setShowSettings(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <main className="flex-1 p-4 md:p-6 overflow-auto max-w-full">
            {renderContent()}
          </main>
        </div>
        {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}

      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

function HomePage({ setActivePage }) {
  const [user, setUser] = React.useState(getCurrentUser());
  const isAdmin = user?.role === 'admin';
  const [showAddCropModal, setShowAddCropModal] = React.useState(false);
  const [userCrops, setUserCrops] = React.useState(mockData.userCrops || []);
  const toast = useToast();
  const { addNotification } = useNotification();

  const handleAddCrop = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCrop = {
      name: formData.get('cropName'),
      area: formData.get('landArea'),
      sowingDate: formData.get('sowingDate'),
      status: 'Healthy',
      days: 0
    };
    setUserCrops([newCrop, ...userCrops]);
    setShowAddCropModal(false);
    toast.success('New crop added successfully!');
    addNotification('Crop Added', `${newCrop.name} (${newCrop.area} acres) has been added to your farm`, 'success');
  };

  const totalCrops = userCrops.length;
  const totalLandArea = userCrops.reduce((acc, crop) => acc + Number(crop.area), 0);

  const adminStats = mockData.dashboardStats;
  const userStats = [
    { title: t('myCrops'), value: totalCrops.toString(), change: 0, icon: 'sprout', color: 'from-emerald-500 to-teal-500' },
    { title: t('landArea'), value: totalLandArea + ' ' + t('acres'), change: 5, icon: 'map', color: 'from-lime-500 to-green-500' },
    { title: t('avgPrice'), value: '₹5,600', change: 3.2, icon: 'indian-rupee', color: 'from-amber-500 to-yellow-500' },
    { title: t('pendingOrders'), value: '2', change: -20, icon: 'package', color: 'from-teal-500 to-cyan-500' }
  ];

  return (
    <div className="animate-circular-reveal" data-name="home-page" data-file="app.js">
      {/* Hero Section - Professional Header */}
      <div className="mb-12 relative rounded-3xl overflow-hidden shadow-2xl min-h-[280px] flex items-end p-8 transition-transform hover:scale-[1.01] duration-500 group">
        <img src="hero_banner.png" alt="AgriSync Hero" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        <div className="relative z-10 w-full flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="text-white">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                <div className="icon-sprout text-3xl text-[var(--accent-color)]"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white mb-0 drop-shadow-md">
                  {t('appName')}
                </h1>
                <p className="text-gray-300 font-medium">{t('tagline')}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-2xl">
              <p className="text-sm text-gray-200">
                Welcome back, <span className="font-bold text-[var(--accent-color)]">{user?.name}</span>!
                {isAdmin ? ' Managing the complete oilseed value chain ecosystem.' : ' Track your crops and connect with the market.'}
              </p>
            </div>
          </div>

          {!isAdmin && (
            <button onClick={() => setShowAddCropModal(true)} className="bg-[var(--accent-color)] text-black hover:bg-white flex items-center gap-2 px-6 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-[var(--accent-color)] group/btn">
              <div className="icon-plus text-xl group-hover/btn:rotate-90 transition-transform"></div>
              <span>{t('addCrop')}</span>
            </button>
          )}
        </div>
      </div>

      <ModalDialog
        isOpen={showAddCropModal}
        onClose={() => setShowAddCropModal(false)}
        title="Add New Crop"
        footer={
          <>
            <button onClick={() => setShowAddCropModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" form="add-crop-form" className="btn-primary">Add Crop</button>
          </>
        }
      >
        <form id="add-crop-form" onSubmit={handleAddCrop} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
            <select name="cropName" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="">Select Crop</option>
              <option value="Soybean">Soybean</option>
              <option value="Mustard">Mustard</option>
              <option value="Groundnut">Groundnut</option>
              <option value="Sunflower">Sunflower</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Land Area (Acres)</label>
            <input name="landArea" type="number" step="0.1" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. 5.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sowing Date</label>
            <input name="sowingDate" type="date" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
        </form>
      </ModalDialog>

      {/* Dashboard Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          {isAdmin ? 'System Overview' : 'Your Dashboard'}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          {isAdmin ? 'Real-time analytics and system-wide metrics' : 'Monitor your farming operations and market opportunities'}
        </p>
      </div>

      {/* Stats Grid - Cleaner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {(isAdmin ? adminStats : userStats).map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <div className={`icon-${stat.icon} text-xl text-white`}></div>
              </div>
              {stat.change !== 0 && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Feature Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
            <div className="icon-satellite text-2xl text-blue-600 dark:text-blue-400"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Satellite Monitoring</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Real-time crop health analysis using satellite imagery</p>
          <SatelliteWidget />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
            <div className="icon-trending-up text-2xl text-purple-600 dark:text-purple-400"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Performance Score</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Track your farming efficiency and productivity</p>
          <PerformanceScore />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
            <div className="icon-brain text-2xl text-amber-600 dark:text-amber-400"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Predictions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Smart forecasting for better decision making</p>
          <PredictiveAnalytics />
        </div>
      </div>

      {/* Market Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Live Market Auction</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time bidding for oilseed contracts</p>
            </div>
          </div>
          <LiveAuction />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => setActivePage('contracts')} className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center gap-3 border border-transparent hover:border-amber-200">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="icon-file-text text-lg text-amber-600 dark:text-amber-400"></div>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">View Contracts</p>
                <p className="text-xs text-gray-500">Browse available tenders</p>
              </div>
            </button>

            <button onClick={() => setActivePage('market')} className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all flex items-center gap-3 border border-transparent hover:border-green-200">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="icon-trending-up text-lg text-green-600 dark:text-green-400"></div>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Market Prices</p>
                <p className="text-xs text-gray-500">Check current rates</p>
              </div>
            </button>

            <button onClick={() => setActivePage('advisor')} className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-3 border border-transparent hover:border-blue-200">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="icon-bot text-lg text-blue-600 dark:text-blue-400"></div>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">AI Advisor</p>
                <p className="text-xs text-gray-500">Get expert guidance</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <PriceChart />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <DemandSupplyChart />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Crops Status</h3>
            <div className="space-y-3">
              {userCrops.map((crop, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <div className="icon-sprout text-xl text-green-600 dark:text-green-400"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{crop.name}</p>
                      <p className="text-sm text-gray-500">{crop.area} {t('acres')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">{crop.status}</p>
                    <p className="text-sm text-gray-500">{crop.days} days</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <PriceChart />
          </div>
        </div>
      )}
    </div>
  );
}

function FarmersPage() {
  return (
    <div className="animate-circular-reveal" data-name="farmers-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('farmers')}</h1>
      <FarmersList />
    </div>
  );
}

function MarketPage() {
  return (
    <div className="animate-circular-reveal" data-name="market-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('market')}</h1>
      <MarketTable />
    </div>
  );
}

function WarehousePage() {
  return (
    <div className="animate-circular-reveal" data-name="warehouse-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('warehouse')}</h1>
      <WarehouseMap />
    </div>
  );
}

function CreditPage() {
  const [loanAmount, setLoanAmount] = React.useState(100000);
  const [interestRate, setInterestRate] = React.useState(7);
  const [tenure, setTenure] = React.useState(12);
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const toast = useToast();
  const { addNotification } = useNotification();

  const monthlyInterest = (interestRate / 12 / 100);
  const emi = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, tenure)) / (Math.pow(1 + monthlyInterest, tenure) - 1);
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - loanAmount;

  const handleApplyLoan = (e) => {
    e.preventDefault();
    toast.success('Loan application submitted successfully! You will receive a confirmation shortly.');
    addNotification('Loan Application Submitted', `Your loan application for ₹${loanAmount.toLocaleString()} has been submitted for review`, 'info');
    setShowApplyModal(false);
  };

  return (
    <div className="animate-circular-reveal" data-name="credit-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">Agricultural Credit & Loans</h1>

      <ModalDialog
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for Agricultural Loan"
        size="md"
        footer={
          <>
            <button onClick={() => setShowApplyModal(false)} className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all">Cancel</button>
            <button type="submit" form="loan-apply-form" className="btn-primary">Submit Application</button>
          </>
        }
      >
        <form id="loan-apply-form" onSubmit={handleApplyLoan} className="space-y-4">
          <div><label className="block text-sm font-medium mb-2">Full Name *</label><input type="text" required className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-2">Loan Purpose *</label><select required className="w-full px-4 py-2 border rounded-lg"><option value="">Select...</option><option>Equipment Purchase</option><option>Crop Cultivation</option><option>Land Development</option></select></div>
          <div><label className="block text-sm font-medium mb-2">Requested Amount *</label><input type="number" required min="10000" className="w-full px-4 py-2 border rounded-lg" /></div>
        </form>
      </ModalDialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Loan Calculator</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-2">Loan Amount: ₹{loanAmount.toLocaleString()}</label><input type="range" min="10000" max="1000000" step="10000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full" /></div>
            <div><label className="block text-sm font-medium mb-2">Interest Rate: {interestRate}%</label><input type="range" min="5" max="15" step="0.5" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full" /></div>
            <div><label className="block text-sm font-medium mb-2">Tenure: {tenure} months</label><input type="range" min="6" max="60" step="6" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full" /></div>
          </div>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20">
          <h3 className="text-lg font-semibold mb-4">Loan Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span>Monthly EMI</span><span className="font-bold text-2xl text-green-600">₹{emi.toFixed(0).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Principal Amount</span><span className="font-medium">₹{loanAmount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Total Interest</span><span className="font-medium">₹{totalInterest.toFixed(0).toLocaleString()}</span></div>
            <div className="flex justify-between border-t pt-3"><span className="font-semibold">Total Amount</span><span className="font-bold">₹{totalAmount.toFixed(0).toLocaleString()}</span></div>
          </div>
          <button onClick={() => setShowApplyModal(true)} className="btn-primary w-full mt-4">Apply for Loan</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-lg transition-all cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3"><div className="icon-landmark text-2xl text-blue-600"></div></div>
          <h4 className="font-semibold mb-2">Kisan Credit Card</h4>
          <p className="text-sm text-[var(--text-secondary)] mb-3">Flexible credit for farming needs at low interest rates</p>
          <p className="text-xs text-green-600 font-medium">Interest from 4%</p>
        </div>
        <div className="card hover:shadow-lg transition-all cursor-pointer">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3"><div className="icon-tractor text-2xl text-purple-600"></div></div>
          <h4 className="font-semibold mb-2">Equipment Loan</h4>
          <p className="text-sm text-[var(--text-secondary)] mb-3">Finance for tractors, harvesters, and farm equipment</p>
          <p className="text-xs text-green-600 font-medium">Up to ₹25 Lakhs</p>
        </div>
        <div className="card hover:shadow-lg transition-all cursor-pointer">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-3"><div className="icon-sprout text-2xl text-amber-600"></div></div>
          <h4 className="font-semibold mb-2">Crop Loan</h4>
          <p className="text-sm text-[var(--text-secondary)] mb-3">Short-term credit for cultivation expenses</p>
          <p className="text-xs text-green-600 font-medium">Subsidized rates</p>
        </div>
      </div>
    </div>
  );
}

function AdvisorPage() {
  return (
    <div className="animate-circular-reveal" data-name="advisor-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('aiChatAdvisor')}</h1>
      <AIAdvisor />
    </div>
  );
}

function PolicyPage() {
  const policies = [
    { title: 'Minimum Support Price (MSP)', category: 'Pricing', description: 'Government-assured minimum price for oilseeds to protect farmers from price fluctuations', impact: 'High', status: 'Active' },
    { title: 'National Oilseeds Mission', category: 'Production', description: 'Comprehensive program to boost oilseed production and reduce import dependency', impact: 'High', status: 'Active' },
    { title: 'PM-AASHA Scheme', category: 'Market', description: 'Price Support Scheme ensuring remunerative prices to farmers', impact: 'Medium', status: 'Active' },
    { title: 'Import Duty on Edible Oils', category: 'Trade', description: 'Current import duty structure affecting domestic oilseed market', impact: 'High', status: 'Under Review' }
  ];

  return (
    <div className="animate-circular-reveal" data-name="policy-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">Agricultural Policy Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20"><div className="flex items-center justify-between"><div><p className="text-sm text-[var(--text-secondary)]">Active Policies</p><p className="text-3xl font-bold text-blue-600">12</p></div><div className="icon-file-text text-4xl text-blue-600"></div></div></div>
        <div className="card bg-green-50 dark:bg-green-900/20"><div className="flex items-center justify-between"><div><p className="text-sm text-[var(--text-secondary)]">Beneficiaries</p><p className="text-3xl font-bold text-green-600">2.5M+</p></div><div className="icon-users text-4xl text-green-600"></div></div></div>
        <div className="card bg-amber-50 dark:bg-amber-900/20"><div className="flex items-center justify-between"><div><p className="text-sm text-[var(--text-secondary)]">Budget Allocation</p><p className="text-3xl font-bold text-amber-600">₹850Cr</p></div><div className="icon-indian-rupee text-4xl text-amber-600"></div></div></div>
      </div>
      <div className="space-y-4">
        {policies.map((policy, idx) => (
          <div key={idx} className="card hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1"><div className="flex items-center gap-2 mb-2"><h3 className="text-lg font-semibold">{policy.title}</h3><span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">{policy.category}</span></div><p className="text-sm text-[var(--text-secondary)]">{policy.description}</p></div>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${policy.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{policy.status}</span>
            </div>
            <div className="flex items-center gap-4 text-sm"><div className="flex items-center gap-1"><div className="icon-trending-up text-[var(--primary-color)]"></div><span>Impact: <strong>{policy.impact}</strong></span></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContractsPage() {
  return (
    <div className="animate-circular-reveal" data-name="contracts-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('contractSystem')}</h1>
      <ContractsList />
    </div>
  );
}




function WeatherPage() {
  // Full India state + district selector using public JSON dataset (iaseth/data-for-india)
  const [districtData, setDistrictData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [selectedState, setSelectedState] = React.useState(null);
  const [selectedDistrict, setSelectedDistrict] = React.useState(null);

  const [activeLocation, setActiveLocation] = React.useState(null);
  const [geoLoading, setGeoLoading] = React.useState(false);
  const [geoError, setGeoError] = React.useState(null);

  function cacheKey(stateName, districtName) {
    return stateName + "|" + districtName;
  }

  async function geocodeStateDistrict(stateName, districtName) {
    if (typeof window === 'undefined') return null;
    window._indiaGeoCache = window._indiaGeoCache || {};
    const key = cacheKey(stateName, districtName);
    if (window._indiaGeoCache[key]) return window._indiaGeoCache[key];

    try {
      const q = encodeURIComponent(districtName + ", " + stateName + ", India");
      const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" + q;
      const res = await fetch(url, {
        headers: { "Accept": "application/json" }
      });
      if (!res.ok) throw new Error("Geocode failed");
      const arr = await res.json();
      if (!Array.isArray(arr) || arr.length === 0) throw new Error("No result");
      const item = arr[0];
      const point = {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      };
      window._indiaGeoCache[key] = point;
      return point;
    } catch (err) {
      console.error("Geocoding error", err);
      return null;
    }
  }

  React.useEffect(() => {
    let cancelled = false;
    async function loadDistricts() {
      setLoading(true);
      setError(null);
      try {
        const url = "https://raw.githubusercontent.com/iaseth/data-for-india/master/data/readable/districts.json";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load districts dataset");
        const json = await res.json();
        const list = json && Array.isArray(json.districts) ? json.districts : json;
        if (!Array.isArray(list)) throw new Error("Unexpected districts format");
        if (cancelled) return;
        setDistrictData(list);

        const defaultState = "Maharashtra";
        const statesSet = Array.from(new Set(list.map(d => d.state)));
        const initialState = statesSet.includes(defaultState) ? defaultState : statesSet[0];
        setSelectedState(initialState);
        const firstDist = list.find(d => d.state === initialState) || list[0];
        setSelectedDistrict(firstDist ? firstDist.district : null);
      } catch (e) {
        console.error("District fetch error", e);
        if (!cancelled) setError("Unable to load India state/district list.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadDistricts();
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    if (!districtData || !selectedState || !selectedDistrict) return;
    let cancelled = false;

    async function updateLocation() {
      setGeoLoading(true);
      setGeoError(null);
      try {
        const dist = districtData.find(
          d => d.state === selectedState && d.district === selectedDistrict
        );
        const districtName = dist ? dist.district : selectedDistrict;
        const point = await geocodeStateDistrict(selectedState, districtName);
        if (cancelled) return;
        if (!point) {
          setGeoError("Could not resolve coordinates for this district. Using fallback.");
          const fallback = { latitude: 22.9734, longitude: 78.6569 }; // central India
          setActiveLocation({
            id: cacheKey(selectedState, selectedDistrict),
            name: districtName + ", " + selectedState,
            latitude: fallback.latitude,
            longitude: fallback.longitude
          });
          return;
        }
        setActiveLocation({
          id: cacheKey(selectedState, selectedDistrict),
          name: districtName + ", " + selectedState,
          latitude: point.latitude,
          longitude: point.longitude
        });
      } catch (e) {
        console.error("updateLocation error", e);
        if (!cancelled) setGeoError("Error while resolving location.");
      } finally {
        if (!cancelled) setGeoLoading(false);
      }
    }

    updateLocation();
    return () => { cancelled = true; };
  }, [districtData, selectedState, selectedDistrict]);

  if (loading || !districtData || !selectedState) {
    return (
      <div className="animate-circular-reveal" data-name="weather-page" data-file="app.js">
        <h1 className="text-3xl font-bold mb-2">Weather & Oilseed Advisory</h1>
        <div className="card p-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Loading Indian states and districts...
          </p>
        </div>
      </div>
    );
  }

  const statesList = Array.from(new Set(districtData.map(d => d.state))).sort();
  const districtsForState = districtData
    .filter(d => d.state === selectedState)
    .map(d => d.district)
    .sort();

  return (
    <div className="animate-circular-reveal" data-name="weather-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-2">Weather & Oilseed Advisory</h1>

      <div className="card mb-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium block mb-1">Select State</label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={selectedState}
              onChange={e => {
                const newState = e.target.value;
                setSelectedState(newState);
                const first = districtData.find(d => d.state === newState);
                setSelectedDistrict(first ? first.district : "");
              }}
            >
              {statesList.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium block mb-1">Select District</label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={selectedDistrict || ""}
              onChange={e => setSelectedDistrict(e.target.value)}
            >
              {districtsForState.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {geoLoading && (
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Resolving location coordinates for forecast...
          </p>
        )}
        {geoError && (
          <p className="mt-2 text-xs text-red-600">
            {geoError}
          </p>
        )}
      </div>

      {activeLocation ? (
        <WeatherWidget location={activeLocation} />
      ) : (
        <div className="card p-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Select a state and district to load weather and advisory.
          </p>
        </div>
      )}
    </div>
  );
}


function SchemesPage() {
  return (
    <div className="animate-circular-reveal" data-name="schemes-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('govSchemes')}</h1>
      <SchemesList />
    </div>
  );
}

function CalculatorPage() {
  return (
    <div className="animate-circular-reveal" data-name="calculator-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('financialCalculator')}</h1>
      <FinancialCalculator />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <ToastProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ToastProvider>
  </ErrorBoundary>
);