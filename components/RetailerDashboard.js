function RetailerDashboard({ setActivePage, user }) {
    const stats = [
        { title: 'Daily Sales', value: '₹45,200', change: 18, icon: 'shopping-bag', color: 'from-pink-500 to-rose-500' },
        { title: 'Orders Placed', value: '12', change: 5, icon: 'shopping-cart', color: 'from-blue-500 to-indigo-500' },
        { title: 'Low Stock Items', value: '3', change: -2, icon: 'alert-circle', color: 'from-amber-500 to-orange-500' },
        { title: 'Customer Footfall', value: '145', change: 10, icon: 'users', color: 'from-teal-500 to-cyan-500' }
    ];

    return (
        <div className="animate-circular-reveal">
            {/* Retailer Hero Section */}
            <div className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <div className="icon-store text-9xl"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="bg-emerald-700 border border-emerald-600 text-emerald-100 px-3 py-1 rounded-full text-xs font-medium mb-3 inline-block">Retailer Dashboard</span>
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
                            <p className="text-emerald-200 max-w-xl">Track sales, manage inventory, and restocking based on AI demand forecasts.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setActivePage('demand-forecast')} className="bg-white text-emerald-900 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-2">
                                <div className="icon-bar-chart-2"></div> Forecasts
                            </button>
                            <button onClick={() => setActivePage('inventory')} className="bg-emerald-700 text-white border border-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2">
                                <div className="icon-package"></div> Stock
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Sales & Demand Trend</h3>
                            <button onClick={() => setActivePage('demand-forecast')} className="text-sm text-pink-600 hover:underline">Full Report</button>
                        </div>
                        <SalesChart />
                        <p className="text-center text-xs text-gray-500 mt-2">Sales projection vs Actuals (Last 7 Days)</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-4">Top Selling Products</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center p-1"><img src="agrisync-logo.jpg" className="w-full h-full object-cover rounded" /></div>
                                    <div>
                                        <p className="font-medium">Sunflower Oil (1L)</p>
                                        <p className="text-xs text-gray-500">Fast Moving</p>
                                    </div>
                                </div>
                                <span className="font-bold">₹145</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center p-1"><img src="agrisync-logo.jpg" className="w-full h-full object-cover rounded" /></div>
                                    <div>
                                        <p className="font-medium">Soybean Oil (5L)</p>
                                        <p className="text-xs text-gray-500">Steady</p>
                                    </div>
                                </div>
                                <span className="font-bold">₹680</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-3">Restock Suggestions</h3>
                        <div className="space-y-3">
                            <div className="p-3 border border-gray-200 rounded-lg">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-sm">Groundnut Oil</span>
                                    <span className="text-xs text-red-500 font-bold">Low</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">Only 12 units remaining.</p>
                                <button className="w-full btn-primary text-xs py-1.5">Order Restock</button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setActivePage('procurement')} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="icon-shopping-cart text-2xl text-blue-600 mb-1 mx-auto"></div>
                                <span className="text-xs font-medium">Buy Stock</span>
                            </button>
                            <button onClick={() => setActivePage('traceability')} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="icon-scan-line text-2xl text-gray-600 mb-1 mx-auto"></div>
                                <span className="text-xs font-medium">Scan QR</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
