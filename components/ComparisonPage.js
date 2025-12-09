function ComparisonPage() {
    const [comparisonData, setComparisonData] = React.useState([]);
    const [calcArea, setCalcArea] = React.useState(1); // Default 1 Acre

    React.useEffect(() => {
        if (window.MockApiService) {
            window.MockApiService.getCropComparisonData().then(data => {
                setComparisonData(data);
            });
        }
    }, []);

    return (
        <div className="animate-circular-reveal" data-name="comparison-page" data-file="components/ComparisonPage.js">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                {/* Logo with explicit path */}
                <img
                    src="./agrisync-logo.jpg"
                    alt="AgriSync Logo"
                    className="w-12 h-12 rounded-full border-2 border-green-500 shadow-md object-cover"
                />

                {/* Fallback Icon (Visible only if image fails to load - handled by CSS in production, but for now enforcing image) */}
                {/* <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <div className="icon-bar-chart text-2xl"></div>
                </div> */}
                Crop Comparison Tool
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calculator Section */}
                <div className="lg:col-span-1">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 sticky top-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="icon-calculator text-2xl mt-1 text-blue-700 dark:text-blue-400"></div>
                            <div>
                                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200">Income Calculator</h3>
                                <p className="text-xs text-blue-700 dark:text-blue-300 opacity-80">Estimate returns based on land size</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">Enter Your Land Area (Acres)</label>
                            <input
                                type="number"
                                value={calcArea}
                                onChange={(e) => setCalcArea(Math.max(0.1, parseFloat(e.target.value) || 0))}
                                className="w-full border border-blue-300 dark:border-blue-700 rounded-xl px-4 py-3 text-lg font-bold text-blue-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>

                        <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
                            <p className="text-xs text-blue-700 dark:text-blue-300 italic">
                                <span className="font-bold">Formula:</span> Forecast Price × Avg Yield × {calcArea} Acres
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-bold uppercase text-xs border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4">Crop Name</th>
                                        <th className="px-6 py-4">MSP (₹/Qtl)</th>
                                        <th className="px-6 py-4 bg-blue-50/50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300">
                                            Forecast (Harvest)
                                            <div className="text-[9px] font-normal text-blue-600 dark:text-blue-400 capitalize">Expected in 2-3 Months</div>
                                        </th>
                                        <th className="px-6 py-4">Yield (Qt/Ac)</th>
                                        <th className="px-6 py-4 text-right text-green-700 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10">Est. Income (₹)</th>
                                        <th className="px-6 py-4">Attributes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                    {[...comparisonData]
                                        .sort((a, b) => ((b.expected_price || b.msp) * b.yield_avg) - ((a.expected_price || a.msp) * a.yield_avg))
                                        .map((row, idx) => {
                                            const priceToUse = row.expected_price || row.msp;
                                            const estIncome = Math.round(priceToUse * (row.yield_avg || 0) * calcArea);
                                            // Calculate Trend
                                            const diff = priceToUse - row.msp;
                                            const pct = ((diff / row.msp) * 100).toFixed(1);
                                            const isPositive = diff >= 0;

                                            // Calculate Logistics
                                            const totalYield = (row.yield_avg || 0) * calcArea;
                                            let vehicle = { type: 'Truck', icon: '🚚', color: 'bg-gray-100 text-gray-700', cap: '> 25 Qtls' };
                                            if (totalYield <= 5) vehicle = { type: 'Auto', icon: '🛺', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', cap: '< 5 Qtls' };
                                            else if (totalYield <= 25) vehicle = { type: 'Tempo', icon: '🚛', color: 'bg-blue-100 text-blue-800 border-blue-200', cap: '5-25 Qtls' };

                                            return (
                                                <tr key={idx} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${idx === 0 ? 'bg-green-50/30 dark:bg-green-900/10' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900 dark:text-white text-base mb-1">{row.crop}</div>
                                                        {idx === 0 && <span className="inline-block text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded-full font-bold shadow-sm">🏆 BEST RETURN</span>}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400">₹{row.msp}</td>
                                                    <td className="px-6 py-4 bg-blue-50/30 dark:bg-blue-900/5">
                                                        <div className="font-bold text-blue-700 dark:text-blue-400 text-base">₹{priceToUse}</div>
                                                        <div className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                                            {isPositive ? '▲' : '▼'} {Math.abs(pct)}% vs MSP
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{row.yield}</td>
                                                    <td className="px-6 py-4 font-bold text-right text-green-700 dark:text-green-400 bg-green-50/30 dark:bg-green-900/5 text-lg">
                                                        ₹{estIncome.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${row.demand.includes('High')
                                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                                : row.demand === 'Moderate'
                                                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                                                }`}>
                                                                {row.demand} Demand
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2" title={`Capacity: ${vehicle.cap}`}>
                                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${vehicle.color} text-[10px] whitespace-nowrap`}>
                                                                <span>{vehicle.icon}</span> {vehicle.type} required
                                                            </span>
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 italic truncate max-w-[120px]" title={row.suitability}>{row.suitability}</div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

window.ComparisonPage = ComparisonPage;
