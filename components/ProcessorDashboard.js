function ProcessorDashboard({ setActivePage, user }) {
    const stats = [
        { title: 'Processing Output', value: '12 MT', change: 8, icon: 'settings', color: 'from-orange-500 to-red-500' },
        { title: 'Raw Material', value: '85 MT', change: -12, icon: 'layers', color: 'from-amber-500 to-yellow-500' },
        { title: 'Dispatch Ready', value: '450 L', change: 15, icon: 'package', color: 'from-blue-500 to-cyan-500' },
        { title: 'Efficiency', value: '94%', change: 2, icon: 'activity', color: 'from-green-500 to-emerald-500' }
    ];

    return (
        <div className="animate-circular-reveal">
            {/* Processor Hero Section */}
            <div className="mb-8 p-8 rounded-3xl bg-gradient-to-r from-slate-800 to-gray-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <div className="icon-factory text-9xl"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <span className="bg-slate-700 border border-slate-600 text-slate-200 px-3 py-1 rounded-full text-xs font-medium mb-3 inline-block">Processor Dashboard</span>
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
                            <p className="text-slate-300 max-w-xl">Monitor production lines, raw material inventory, and dispatch schedules.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setActivePage('production')} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-500 transition-colors flex items-center gap-2">
                                <div className="icon-settings"></div> Production
                            </button>
                            <button onClick={() => setActivePage('inventory')} className="bg-slate-700 text-white border border-slate-600 px-4 py-2 rounded-lg font-semibold hover:bg-slate-600 transition-colors flex items-center gap-2">
                                <div className="icon-package"></div> Inventory
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
                            <h3 className="text-lg font-bold">Production Overview</h3>
                            <button onClick={() => setActivePage('production')} className="text-sm text-orange-600 hover:underline">View Schedule</button>
                        </div>
                        {/* Tiny version of Production Schedule */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <span className="text-xs font-bold text-gray-500 w-16">08:00 AM</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Batch #402 - Soybean Crushing</p>
                                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1"><div className="bg-green-500 h-1.5 rounded-full w-3/4"></div></div>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Running</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <span className="text-xs font-bold text-gray-500 w-16">02:00 PM</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Batch #403 - Filtration</p>
                                </div>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Scheduled</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-4">Market Trends</h3>
                        <PriceChart />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-4">Stock Alerts</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 border border-red-100 bg-red-50 rounded-lg">
                                <div className="icon-alert-triangle text-red-500 mt-1"></div>
                                <div>
                                    <p className="text-sm font-bold text-red-800">Mustard Seeds Low</p>
                                    <p className="text-xs text-red-600">Stock below 15 MT. Order immediately.</p>
                                    <button className="mt-2 text-xs bg-red-600 text-white px-2 py-1 rounded">Order Now</button>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 border border-orange-100 bg-orange-50 rounded-lg">
                                <div className="icon-clock text-orange-500 mt-1"></div>
                                <div>
                                    <p className="text-sm font-bold text-orange-800">Maintenance Due</p>
                                    <p className="text-xs text-orange-600">Conveyor Belt B needs checkup tomorrow.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setActivePage('logistics')} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="icon-truck text-2xl text-purple-600 mb-1 mx-auto"></div>
                                <span className="text-xs font-medium">Logistics</span>
                            </button>
                            <button onClick={() => setActivePage('contracts')} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                <div className="icon-file-text text-2xl text-amber-600 mb-1 mx-auto"></div>
                                <span className="text-xs font-medium">Contracts</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
