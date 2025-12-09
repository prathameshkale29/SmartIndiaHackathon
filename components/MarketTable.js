function MarketTable() {
  const t = (typeof window !== 'undefined' && window.t) ? window.t : (key => key);
  try {
    const [marketData, setMarketData] = React.useState([]);
    const [allMarketData, setAllMarketData] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [selectedState, setSelectedState] = React.useState('');
    const [selectedDistrict, setSelectedDistrict] = React.useState('');
    const [availableStates, setAvailableStates] = React.useState([]);
    const [availableDistricts, setAvailableDistricts] = React.useState([]);

    const fetchMarketPrices = async () => {
      setRefreshing(true);
      setError(null);
      try {
        console.log('Fetching market prices from MockApiService...');
        const data = await window.MockApiService.getMarketPrices();

        if (data && data.length > 0) {
          setAllMarketData(data);

          // Extract unique states and sort them
          const states = [...new Set(data.filter(item => item.state).map(item => item.state))].sort();
          setAvailableStates(states);

          // Show all data initially
          setMarketData(data.slice(0, 50));
          setError(null);
        } else {
          throw new Error("No market data available");
        }

      } catch (err) {
        console.error("Failed to fetch market prices:", err);
        setError("Failed to fetch market data");
      } finally {
        setRefreshing(false);
        setLoading(false);
      }
    };

    React.useEffect(() => {
      fetchMarketPrices();
    }, []);

    // Filter data when state or district changes
    React.useEffect(() => {
      if (allMarketData.length === 0) return;

      let filtered = allMarketData;

      if (selectedState) {
        filtered = filtered.filter(item => item.state === selectedState);
        const districts = [...new Set(filtered.map(item => item.district))].sort();
        setAvailableDistricts(districts);
      } else {
        setAvailableDistricts([]);
        setSelectedDistrict('');
      }

      if (selectedDistrict) {
        filtered = filtered.filter(item => item.district === selectedDistrict);
      }

      setMarketData(filtered.slice(0, 50));
    }, [selectedState, selectedDistrict, allMarketData]);

    const refreshPrices = () => {
      setSelectedState('');
      setSelectedDistrict('');
      fetchMarketPrices();
    };

    const handleStateChange = (e) => {
      setSelectedState(e.target.value);
      setSelectedDistrict('');
    };

    const handleDistrictChange = (e) => {
      setSelectedDistrict(e.target.value);
    };

    return (
      <div className="card" data-name="market-table" data-file="components/MarketTable.js">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{t('currentMarketPrices')}</h3>
              {error && <p className="text-xs text-amber-600 mt-1">{error}</p>}
              <p className="text-xs text-gray-400 mt-1">Source: Live Mandi API (Simulated)</p>
            </div>
            <button
              onClick={refreshPrices}
              disabled={refreshing}
              className="btn-primary flex items-center gap-2"
            >
              <div className={`icon-refresh-cw text-lg ${refreshing ? 'animate-spin' : ''}`}></div>
              <span>{t('refresh')}</span>
            </button>
          </div>

          {/* Location Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-slate-800/50 border border-blue-200 dark:border-slate-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <div className="flex items-center gap-2">
                  <div className="icon-map-pin text-sm"></div>
                  Select State
                </div>
              </label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
              >
                <option value="" className="text-gray-500">All States</option>
                {availableStates.map(state => (
                  <option key={state} value={state} className="text-gray-900 dark:text-white">{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <div className="flex items-center gap-2">
                  <div className="icon-map text-sm"></div>
                  Select District
                </div>
              </label>
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedState}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="text-gray-500">All Districts</option>
                {availableDistricts.map(district => (
                  <option key={district} value={district} className="text-gray-900 dark:text-white">{district}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading market prices...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">{t('region')}</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">{t('crop')}</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">MSP</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">{t('price')}</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">{t('change')}</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.length === 0 ? (
                    <tr><td colSpan="5" className="p-4 text-center">No data found</td></tr>
                  ) : (
                    marketData.map((item, idx) => (
                      <tr key={idx} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-light)] transition-all duration-300">
                        <td className="py-3 px-4">
                          <p className="font-medium">{item.region}</p>
                          <p className="text-xs text-gray-500">{item.district}, {item.state}</p>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{item.crop}</td>
                        <td className="py-3 px-4 text-gray-500">₹{item.msp}</td>
                        <td className="py-3 px-4 font-bold">
                          <span className={`${item.price >= item.msp ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{item.price}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`flex items-center gap-1 ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('MarketTable component error:', error);
    return null;
  }
}