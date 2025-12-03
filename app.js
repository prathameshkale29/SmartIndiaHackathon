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
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

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
          window.location.href = 'blockchain.html';
          return null;
        case 'agristack':
          window.location.href = 'agristack.html';
          return null;
        case 'logistics':
          window.location.href = 'logistics.html';
          return null;
        case 'weather':
          return <WeatherPage />;
        case 'schemes':
          return <SchemesPage />;
        case 'calculator':
          return <CalculatorPage />;
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
        <VoiceAssistant />
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

  const adminStats = mockData.dashboardStats;
  const userStats = [
    { title: t('myCrops'), value: '3', change: 0, icon: 'sprout', color: 'from-emerald-500 to-teal-500' },
    { title: t('landArea'), value: '8.5 ' + t('acres'), change: 5, icon: 'map', color: 'from-lime-500 to-green-500' },
    { title: t('avgPrice'), value: '₹5,600', change: 3.2, icon: 'indian-rupee', color: 'from-amber-500 to-yellow-500' },
    { title: t('pendingOrders'), value: '2', change: -20, icon: 'package', color: 'from-teal-500 to-cyan-500' }
  ];

  return (
    <div className="animate-fade-in" data-name="home-page" data-file="app.js">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            {isAdmin ? t('adminDashboard') : t('myDashboard')}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {isAdmin ? t('systemAnalytics') : t('personalInsights')}
          </p>
        </div>
        {!isAdmin && (
          <button className="btn-primary flex items-center gap-2">
            <div className="icon-plus text-lg"></div>
            <span>{t('addCrop')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {(isAdmin ? adminStats : userStats).map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SatelliteWidget />
        <PerformanceScore />
        <PredictiveAnalytics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold mb-3">Live Market Auction</h3>
          <LiveAuction />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">{t('quickActions')}</h3>
          <div className="space-y-2">
            <button onClick={() => setActivePage('contracts')} className="w-full text-left px-4 py-3 bg-[var(--bg-light)] rounded-lg hover:bg-amber-50 transition-all flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <div className="icon-file-text text-lg text-amber-600"></div>
              </div>
              <span>{t('viewContracts')}</span>
            </button>
            <button onClick={() => setActivePage('market')} className="w-full text-left px-4 py-3 bg-[var(--bg-light)] rounded-lg hover:bg-green-50 transition-all flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="icon-trending-up text-lg text-green-600"></div>
              </div>
              <span>{t('checkMarketPrices')}</span>
            </button>
            <button onClick={() => setActivePage('advisor')} className="w-full text-left px-4 py-3 bg-[var(--bg-light)] rounded-lg hover:bg-blue-50 transition-all flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="icon-bot text-lg text-blue-600"></div>
              </div>
              <span>{t('askAIAdvisor')}</span>
            </button>
          </div>
        </div>
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PriceChart />
          <DemandSupplyChart />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">{t('myCropsStatus')}</h3>
            <div className="space-y-3">
              {mockData.userCrops.map((crop, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-light)] rounded-lg hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <div className="icon-sprout text-lg text-green-600"></div>
                    </div>
                    <div>
                      <p className="font-medium">{crop.name}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{crop.area} {t('acres')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[var(--primary-color)]">{crop.status}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{crop.days} days</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <PriceChart />
        </div>
      )}
    </div>
  );
}

function FarmersPage() {
  return (
    <div className="animate-fade-in" data-name="farmers-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('farmers')}</h1>
      <FarmersList />
    </div>
  );
}

function MarketPage() {
  return (
    <div className="animate-fade-in" data-name="market-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('market')}</h1>
      <MarketTable />
    </div>
  );
}

function WarehousePage() {
  return (
    <div data-name="warehouse-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('warehouse')}</h1>
      <WarehouseMap />
    </div>
  );
}

function CreditPage() {
  return (
    <div data-name="credit-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('credit')}</h1>
      <div className="card">
        <p className="text-[var(--text-secondary)]">{t('credit')} module coming soon...</p>
      </div>
    </div>
  );
}

function AdvisorPage() {
  return (
    <div data-name="advisor-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('aiChatAdvisor')}</h1>
      <AIAdvisor />
    </div>
  );
}

function PolicyPage() {
  return (
    <div data-name="policy-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('policy')}</h1>
      <div className="card">
        <p className="text-[var(--text-secondary)]">{t('policy')} insights coming soon...</p>
      </div>
    </div>
  );
}

function ContractsPage() {
  return (
    <div className="animate-fade-in" data-name="contracts-page" data-file="app.js">
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
      <div className="animate-fade-in" data-name="weather-page" data-file="app.js">
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
    <div className="animate-fade-in" data-name="weather-page" data-file="app.js">
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
    <div className="animate-fade-in" data-name="schemes-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('govSchemes')}</h1>
      <SchemesList />
    </div>
  );
}

function CalculatorPage() {
  return (
    <div className="animate-fade-in" data-name="calculator-page" data-file="app.js">
      <h1 className="text-3xl font-bold mb-6">{t('financialCalculator')}</h1>
      <FinancialCalculator />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);