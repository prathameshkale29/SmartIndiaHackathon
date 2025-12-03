function AgriStackDashboard({ user }) {
  try {
    const [syncStatus, setSyncStatus] = React.useState('synced');
    const [farmerData, setFarmerData] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState('overview');
    const [showSchemeModal, setShowSchemeModal] = React.useState(false);

    React.useEffect(() => {
      loadAgriStackData();
    }, []);

    const loadAgriStackData = () => {
      if (typeof window.agriStack !== 'undefined') {
        const data = window.agriStack.getData(user.id || 'user_1');
        if (data) {
          setFarmerData(data);
        } else {
          // Auto-sync if no data found
          syncNow();
        }
      }
    };

    const syncNow = async () => {
      setSyncStatus('syncing');
      if (typeof window.agriStack !== 'undefined') {
        const result = await window.agriStack.sync(user.id || 'user_1');
        if (result.success) {
          setFarmerData(result.data);
          setSyncStatus('synced');
        } else {
          setSyncStatus('error');
          console.error(result.error);
        }
      }
    };

    const applyForScheme = (schemeName) => {
      alert(`Application submitted for ${schemeName}`);
      setShowSchemeModal(false);
    };

    return (
      <div className="space-y-6">
        <div className="card bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-2xl border-4 border-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
                <div className="icon-database text-4xl"></div>
                Agri-Stack Integration
              </h2>
              <p className="text-lg font-medium">Connected to National Agriculture Database</p>
            </div>
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="icon-check-circle text-5xl"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border-2 border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Sync Status</h3>
              <button onClick={syncNow} disabled={syncStatus === 'syncing'} className="btn-primary text-sm shadow-lg">
                <div className={`icon-refresh-cw text-lg ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}></div>
                Sync Now
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className={`w-4 h-4 rounded-full ${syncStatus === 'synced' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className="text-base font-medium">{syncStatus === 'synced' ? '✓ All data synchronized' : '⟳ Syncing...'}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] font-medium">Last sync: {farmerData?.lastSync ? new Date(farmerData.lastSync).toLocaleString() : 'Never'}</p>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border-2 border-purple-200 dark:border-purple-700">
            <h3 className="font-bold text-lg mb-4">Farmer ID</h3>
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-inner">
              <p className="text-3xl font-mono font-bold text-[var(--primary-color)] mb-2">{farmerData?.farmerId || 'Loading...'}</p>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="icon-shield-check text-lg"></div>
                <p className="text-sm font-bold">Verified by Government</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex gap-2 mb-6 bg-[var(--bg-light)] rounded-xl p-2 overflow-x-auto">
            <button onClick={() => setActiveTab('overview')} className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-white dark:hover:bg-gray-800'}`}>Overview</button>
            <button onClick={() => setActiveTab('land')} className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'land' ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-white dark:hover:bg-gray-800'}`}>Land Records</button>
            <button onClick={() => setActiveTab('pmkisan')} className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'pmkisan' ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-white dark:hover:bg-gray-800'}`}>PM-Kisan</button>
            <button onClick={() => setActiveTab('soil')} className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'soil' ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-white dark:hover:bg-gray-800'}`}>Soil Health</button>
            <button onClick={() => setActiveTab('kcc')} className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'kcc' ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:bg-white dark:hover:bg-gray-800'}`}>KCC</button>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg text-white hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                  <div className="icon-check-circle text-3xl text-green-600"></div>
                </div>
                <div>
                  <p className="font-bold text-lg">PM-Kisan</p>
                  <p className="text-sm font-medium">{farmerData?.pmKisan?.status || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg text-white hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                  <div className="icon-map text-3xl text-blue-600"></div>
                </div>
                <div>
                  <p className="font-bold text-lg">Total Land</p>
                  <p className="text-sm font-medium">{farmerData?.totalLand || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl shadow-lg text-white hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                  <div className="icon-leaf text-3xl text-amber-600"></div>
                </div>
                <div>
                  <p className="font-bold text-lg">Soil Health Card</p>
                  <p className="text-sm font-medium">{farmerData?.soilHealth?.status || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl shadow-lg text-white hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                  <div className="icon-credit-card text-3xl text-purple-600"></div>
                </div>
                <div>
                  <p className="font-bold text-lg">KCC</p>
                  <p className="text-sm font-medium">{farmerData?.kcc?.status || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'land' && (
            <div className="space-y-4">
              {farmerData?.landRecords?.map((record, idx) => (
                <div key={idx} className="p-4 bg-[var(--bg-light)] rounded-lg border border-[var(--border-color)]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Survey Number</p>
                      <p className="font-medium">{record.surveyNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Village</p>
                      <p className="font-medium">{record.village}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Area</p>
                      <p className="font-medium">{record.area}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Soil Type</p>
                      <p className="font-medium">{record.soilType}</p>
                    </div>
                  </div>
                </div>
              ))}
              {!farmerData?.landRecords && <p className="text-center text-[var(--text-secondary)]">No land records found.</p>}
            </div>
          )}

          {activeTab === 'pmkisan' && farmerData?.pmKisan && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[var(--text-secondary)]">Beneficiary ID</span>
                  <span className="font-medium">{farmerData.pmKisan.beneficiaryId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Status</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full">{farmerData.pmKisan.status}</span>
                </div>
              </div>
              <h4 className="font-medium">Payment History</h4>
              <div className="space-y-2">
                {farmerData.pmKisan.installments.map((inst, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-light)] rounded-lg">
                    <div>
                      <p className="font-medium">₹{inst.amount}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{inst.date}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full">{inst.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'soil' && farmerData?.soilHealth && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Test Date</p>
                    <p className="font-medium">{farmerData.soilHealth.testDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">pH Level</p>
                    <p className="font-medium">{farmerData.soilHealth.params.pH}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Organic Carbon</p>
                    <p className="font-medium">{farmerData.soilHealth.params.oc}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">EC</p>
                    <p className="font-medium">{farmerData.soilHealth.params.ec}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-amber-200 dark:border-amber-700">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Recommendations</p>
                  <p className="text-sm">{farmerData.soilHealth.recommendations}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kcc' && farmerData?.kcc && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Status</p>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full">{farmerData.kcc.status}</span>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Credit Limit</p>
                    <p className="font-medium text-lg">{farmerData.kcc.limit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Utilized</p>
                    <p className="font-medium text-lg">{farmerData.kcc.utilized}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Available</p>
                    <p className="font-medium text-lg text-green-600">{farmerData.kcc.available}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Applied Schemes</h3>
            <button onClick={() => setShowSchemeModal(true)} className="btn-primary text-sm">Apply for Scheme</button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-[var(--bg-light)] rounded-lg">
              <div>
                <p className="font-medium">PM-KUSUM</p>
                <p className="text-xs text-[var(--text-secondary)]">Applied on 2025-01-10</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Applied</span>
            </div>
          </div>
        </div>

        {showSchemeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowSchemeModal(false)}>
            <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-semibold mb-4">Apply for Scheme</h3>
              <div className="space-y-3">
                <button onClick={() => applyForScheme('PM-KUSUM')} className="w-full p-3 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] text-left">
                  <p className="font-medium">PM-KUSUM</p>
                  <p className="text-xs text-[var(--text-secondary)]">Solar pump subsidy scheme</p>
                </button>
                <button onClick={() => applyForScheme('PMFBY')} className="w-full p-3 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] text-left">
                  <p className="font-medium">PMFBY</p>
                  <p className="text-xs text-[var(--text-secondary)]">Crop insurance scheme</p>
                </button>
              </div>
              <button onClick={() => setShowSchemeModal(false)} className="mt-4 w-full px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)]">Close</button>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('AgriStackDashboard error:', error);
    return null;
  }
}