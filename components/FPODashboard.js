function FPODashboard({ setActivePage, user }) {
    const [procurementStats, setProcurementStats] = React.useState({
        dailyCollection: 23, // MT
        totalFarmers: 142,
        pendingQc: 5,
        avgPrice: 4850
    });

    const stats = [
        { title: 'Total Collection', value: '450 MT', change: 12, icon: 'layers', color: 'from-blue-500 to-indigo-500' },
        { title: 'Active Farmers', value: '142', change: 5, icon: 'users', color: 'from-green-500 to-emerald-500' },
        { title: 'Pending Payments', value: '₹1.2L', change: -8, icon: 'clock', color: 'from-amber-500 to-orange-500' },
        { title: 'Logistics Active', value: '8 Trucks', change: 0, icon: 'truck', color: 'from-purple-500 to-pink-500' }
    ];

    return (
        <div className="animate-circular-reveal">
            {/* FPO Hero Section */}
            <div className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <div className="icon-users text-9xl"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <span className="bg-blue-800/50 border border-blue-700/50 text-blue-200 px-3 py-1 rounded-full text-xs font-medium mb-3 inline-block">FPO Dashboard</span>
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
                            <p className="text-blue-200 max-w-xl">Manage farmer collections, quality checks, and logistics efficiency from a single command center.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            <button onClick={() => setActivePage('procurement-mgmt')} className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                                <div className="icon-clipboard-list"></div> Procurement
                            </button>
                            <button onClick={() => setActivePage('logistics')} className="bg-blue-800 text-white border border-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <div className="icon-truck"></div> Logistics
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Recent Inflows</h3>
                            <button onClick={() => setActivePage('procurement-mgmt')} className="text-sm text-blue-600 hover:underline">View All</button>
                        </div>
                        {/* Reuse snippets from ProcurementManagementPage table concept */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Farmer</th>
                                        <th className="px-4 py-3 text-left">Crop</th>
                                        <th className="px-4 py-3 text-left">Qty</th>
                                        <th className="px-4 py-3 text-left">Quality</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                    {[
                                        { farmer: "Ramesh Kumar", crop: "Soybean", qty: "15 Qt", quality: "Grade A", status: "Verified" },
                                        { farmer: "Suresh Patil", crop: "Mustard", qty: "8 Qt", quality: "Grade B", status: "Pending" },
                                        { farmer: "Anita Devi", crop: "Groundnut", qty: "12 Qt", quality: "Grade A", status: "Verified" },
                                        { farmer: "Mahesh Babu", crop: "Soybean", qty: "20 Qt", quality: "Grade A", status: "Verified" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 font-medium">{row.farmer}</td>
                                            <td className="px-4 py-3">{row.crop}</td>
                                            <td className="px-4 py-3">{row.qty}</td>
                                            <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${row.quality === 'Grade A' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{row.quality}</span></td>
                                            <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${row.status === 'Verified' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{row.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-4">Market Demand</h3>
                        <DemandSupplyChart />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setActivePage('inventory')} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="icon-package text-2xl text-purple-600 mb-1 mx-auto"></div>
                                <span className="text-xs font-medium">Inventory</span>
                            </button>
                            <button onClick={() => setActivePage('contracts')} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="icon-file-text text-2xl text-amber-600 mb-1 mx-auto"></div>
                                <span className="text-xs font-medium">Contracts</span>
                            </button>
                            <button onClick={() => setActivePage('finance')} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="icon-indian-rupee text-2xl text-green-600 mb-1 mx-auto"></div>
                                <span className="text-xs font-medium">Payments</span>
                            </button>
                            <button onClick={() => setActivePage('market')} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="icon-bar-chart-2 text-2xl text-blue-600 mb-1 mx-auto"></div>
                                <span className="text-xs font-medium">Trends</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
