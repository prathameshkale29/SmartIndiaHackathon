function LogisticsPage() {
    return (
        <div className="animate-circular-reveal" data-name="logistics-page">
            <h1 className="text-3xl font-bold mb-2">Logistics & Transport</h1>
            <p className="text-[var(--text-secondary)] mb-6">Optimized routing and real-time delivery tracking</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Active Shipments</h3>
                        <div className="icon-truck text-2xl text-blue-600"></div>
                    </div>
                    <p className="text-3xl font-bold text-blue-900 dark:text-white">12</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">8 In-Transit • 4 Loading</p>
                </div>
                <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-green-900 dark:text-green-100">On-Time Delivery</h3>
                        <div className="icon-clock text-2xl text-green-600"></div>
                    </div>
                    <p className="text-3xl font-bold text-green-900 dark:text-white">96%</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">↑ 2% vs last week</p>
                </div>
                <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">Vehicle Utilization</h3>
                        <div className="icon-package text-2xl text-purple-600"></div>
                    </div>
                    <p className="text-3xl font-bold text-purple-900 dark:text-white">88%</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Optimized loading capacity</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Live Tracking</h3>
                        <button className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg transition-colors">
                            Map View
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { id: 'TRK-8921', dest: 'Mumbai Central', status: 'In Transit', eta: '4h 30m', driver: 'Rajesh Singh', cargo: 'Soybean (20MT)' },
                            { id: 'TRK-8922', dest: 'FPO Warehouse B', status: 'Arrived', eta: '-', driver: 'Sunil Kumar', cargo: 'Mustard Seeds (15MT)' },
                            { id: 'TRK-8925', dest: 'Processing Unit A', status: 'Delayed', eta: '1h 15m', driver: 'Amit Verma', cargo: 'Groundnut (18MT)' },
                        ].map((trip, idx) => (
                            <div key={idx} className="border border-[var(--border-color)] rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <div className="icon-truck text-gray-600 dark:text-gray-300"></div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{trip.id}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">{trip.cargo}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{trip.dest}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">Driver: {trip.driver}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${trip.status === 'Arrived' ? 'bg-green-100 text-green-700' :
                                                trip.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {trip.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3">
                                    <div className="flex items-center gap-1">
                                        <div className="icon-clock"></div>
                                        <span>ETA: <span className="text-gray-900 dark:text-white font-medium">{trip.eta}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="icon-map-pin"></div>
                                        <span>Current: <span className="text-gray-900 dark:text-white font-medium">Nashik Highway, KM 45</span></span>
                                    </div>
                                    <button className="ml-auto text-[var(--primary-color)] hover:underline">Track Live</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card bg-[var(--bg-light)]">
                        <h3 className="font-semibold mb-4">Route Optimization</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Origin</label>
                                <select className="w-full text-sm border-gray-300 rounded-lg p-2"><option>Main Warehouse (Nashik)</option></select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Destination</label>
                                <select className="w-full text-sm border-gray-300 rounded-lg p-2"><option>Processing Unit (Pune)</option></select>
                            </div>
                            <div className="pt-2">
                                <p className="text-xs text-green-600 mb-2 font-medium flex items-center gap-1"><div className="icon-check"></div> Fuel efficient route found</p>
                                <button className="btn-primary w-full text-sm">Optimize & Book</button>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="font-semibold mb-3">Available Vehicles</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm p-2 bg-[var(--bg-light)] rounded">
                                <span>Large Truck (20T)</span>
                                <span className="font-bold text-green-600">2 Available</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-2 bg-[var(--bg-light)] rounded">
                                <span>Medium Truck (10T)</span>
                                <span className="font-bold text-amber-600">1 Available</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-2 bg-[var(--bg-light)] rounded">
                                <span>Pickup Van (2T)</span>
                                <span className="font-bold text-gray-500">0 Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
