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

// Import Shared Data Context
// Import Shared Data Context - already loaded globally
// import { SharedDataProvider } from './utils/SharedDataContext.js';

function App() {
  try {
    const [activePage, setActivePage] = React.useState('home');
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [showSettings, setShowSettings] = React.useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [showAIWidget, setShowAIWidget] = React.useState(false); // Global AI Widget State

    React.useEffect(() => {
      initTheme();
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    }, []);

    const handleLogin = (userData) => {
      console.log("App.js handleLogin called with:", userData);
      // Force clear any cached user first
      setUser(null);
      // Then set the new user data
      setTimeout(() => setUser(userData), 0);
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
        case 'intercropping':
          return (
            <div className="animate-circular-reveal" data-name="intercropping-page" data-file="app.js">
              <IntercroppingSimulator />
            </div>
          );
        case 'bhuvan':
          return (
            <div className="animate-circular-reveal" data-name="bhuvan-page" data-file="app.js">
              <OilPalmZoningMap />
            </div>
          );
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
        case 'comparison':
          return <ComparisonPage />;
        case 'procurement':
          return (
            <div className="animate-circular-reveal" data-name="procurement-page" data-file="app.js">
              <ProcurementPage />
            </div>
          );
        case 'finance':
          return <FinancePage />;
        case 'procurement-mgmt':
          return <ProcurementManagementPage initialTab="procurement" />;
        case 'production':
          return <ProductionSchedulingPage />;
        case 'inventory':
          return <InventoryManagementPage />;
        case 'demand-forecast':
          return <DemandForecastPage />;
        case 'logistics':
          return <LogisticsPage />;
        case 'quality':
          return <ProcurementManagementPage initialTab="quality" />;
        case 'batches':
          return (
            <div className="animate-circular-reveal" data-name="batch-creation-page" data-file="app.js">
              <BlockchainTracker user={user} />
            </div>
          );

        // Processor Aliases
        case 'procurement_raw':
          return <ProcurementPage />;
        case 'production_batch':
          return <ProductionSchedulingPage />;
        case 'dashboard_processor':
          return <ProcessorDashboard setActivePage={setActivePage} user={user} />;
        case 'compliance':
          return (
            <div className="animate-circular-reveal" data-name="compliance-page" data-file="app.js">
              {/* Wrapped ComplianceStatus in a page-like container */}
              <h1 className="text-3xl font-bold mb-6">Quality & Compliance</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComplianceStatus />
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <div><p className="font-bold text-green-800">FSSAI License</p><p className="text-xs text-green-600">Valid till 2028</p></div>
                      <div className="icon-check-circle text-green-600 text-xl"></div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div><p className="font-bold text-blue-800">Organic Certificate</p><p className="text-xs text-blue-600">Renewed: Dec 2024</p></div>
                      <div className="icon-shield text-blue-600 text-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        // contracts, inventory, logistics, market handled by main cases above

        // Retailer Aliases
        case 'my-produce':
          return <MyProducePage user={user} setActivePage={setActivePage} />;
        case 'verified_batches':
          return (
            <div className="animate-circular-reveal" data-name="verified-batches-page" data-file="app.js">
              {/* Could pass a specific filter prop if component supported it, for now reusing BlockchainTracker */}
              <BlockchainTracker user={user} />
            </div>
          );
        // inventory handled by main case
        case 'procurement_orders':
          return <ProcurementPage />;
        case 'traceability_viewer':
          return (
            <div className="animate-circular-reveal" data-name="traceability-viewer-page" data-file="app.js">
              {/* Emulate focusing on tracking */}
              <h1 className="text-3xl font-bold mb-6">Traceability Viewer</h1>
              <QRScanner />
              <div className="mt-8">
                <BlockchainTracker user={user} />
              </div>
            </div>
          );
        case 'supply_chain':
          return <LogisticsPage />;
        // demand-forecast-retailer maps to DemandForecastPage if needed, or we can alias it:
        case 'demand-forecast-retailer':
          return <DemandForecastPage />;

        default:
          return <HomePage />;
      }
    };

    return (
      <SharedDataProvider>
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
          {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} onNavigate={setActivePage} />}
          {showSettings && <Settings onClose={() => setShowSettings(false)} />}

          {/* Global AI Advisor Floating Widget */}
          <div className="fixed bottom-24 md:bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
            {/* Widget Container */}
            <div className={`transition-all duration-300 origin-bottom-right pointer-events-auto ${showAIWidget ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none h-0 w-0 overflow-hidden'}`}>
              <div className="w-[350px] h-[500px] shadow-2xl rounded-2xl">
                <AIAdvisor variant="widget" activePage={activePage} onClose={() => setShowAIWidget(false)} isVisible={showAIWidget} />
              </div>
            </div>

            {/* FAB Button */}
            <button
              onClick={() => setShowAIWidget(!showAIWidget)}
              className={`pointer-events-auto w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${showAIWidget ? 'bg-red-500 rotate-45' : 'bg-gradient-to-r from-green-500 to-emerald-600 animate-pulse-slow'}`}
            >
              <div className={`text-2xl text-white transition-all ${showAIWidget ? 'icon-plus' : 'icon-message-circle'}`}>
                {showAIWidget ? '+' : '🤖'}
              </div>
            </button>
          </div>

        </div>
      </SharedDataProvider>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

function HomePage({ setActivePage }) {
  const [user, setUser] = React.useState(getCurrentUser());

  React.useEffect(() => {
    // Listen for user role updates
    const checkUser = () => {
      const currentUser = getCurrentUser();
      if (currentUser?.role !== user?.role) {
        setUser(currentUser);
      }
    };
    // Poll for changes (simple way since we don't have a global store subscription set up perfectly yet)
    const interval = setInterval(checkUser, 1000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return <div className="p-8 text-center">Loading user profile...</div>;

  // Dispatch based on role
  switch (user.role) {
    case 'farmer':
      return <FarmerDashboard setActivePage={setActivePage} user={user} />;
    case 'fpo':
      return <FPODashboard setActivePage={setActivePage} user={user} />;
    case 'processor':
      return <ProcessorDashboard setActivePage={setActivePage} user={user} />;
    case 'retailer':
      return <RetailerDashboard setActivePage={setActivePage} user={user} />;
    case 'admin':
    case 'government':
      // For now, Admin/Gov gets the Farmer view (or a specific one if requested later)
      // but with Admin privileges enabled inside FarmerDashboard if needed.
      // Or we can default to FarmerDashboard checking for isAdmin.
      return <FarmerDashboard setActivePage={setActivePage} user={user} />;
    default:
      return <FarmerDashboard setActivePage={setActivePage} user={user} />;
  }
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
  return <WeatherAdvisory />;
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