function WarehousePage() {
    const [activeTab, setActiveTab] = React.useState('warehouses');

    return (
        <div data-name="warehouse-page" data-file="app.js">
            <h1 className="text-3xl font-bold mb-2">Warehouse & Logistics Management</h1>
            <p className="text-[var(--text-secondary)] mb-6">Manage warehouse inventory and logistics operations</p>

            <div className="flex gap-4 border-b border-[var(--border-color)] mb-6">
                <button
                    onClick={() => setActiveTab('warehouses')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'warehouses'
                            ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    Warehouses
                </button>
                <button
                    onClick={() => setActiveTab('logistics')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'logistics'
                            ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    Logistics
                </button>
            </div>

            {activeTab === 'warehouses' && <WarehouseMap />}

            {activeTab === 'logistics' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Active Shipments</p>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">24</p>
                                </div>
                                <div className="icon-truck text-4xl text-blue-500"></div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700 dark:text-green-300 mb-1">On-Time Delivery</p>
                                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">94%</p>
                                </div>
                                <div className="icon-check-circle text-4xl text-green-500"></div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">Transit Time (Avg)</p>
                                    <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">2.5d</p>
                                </div>
                                <div className="icon-clock text-4xl text-amber-500"></div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-xl font-semibold mb-4">Logistics Network</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-[var(--bg-light)] rounded-lg">
                                <h4 className="font-semibold mb-2">Transportation Fleet</h4>
                                <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
                                    <li>15 refrigerated trucks for temperature-sensitive oilseeds</li>
                                    <li>25 standard cargo vehicles for bulk transport</li>
                                    <li>GPS-enabled real-time tracking on all vehicles</li>
                                    <li>Average fleet utilization: 87%</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-[var(--bg-light)] rounded-lg">
                                <h4 className="font-semibold mb-2">Distribution Network</h4>
                                <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
                                    <li>12 regional distribution centers across India</li>
                                    <li>Connected to 45+ procurement centers</li>
                                    <li>Last-mile delivery to 200+ processing units</li>
                                    <li>Average delivery radius: 500 km per hub</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-[var(--bg-light)] rounded-lg">
                                <h4 className="font-semibold mb-2">Cold Chain Management</h4>
                                <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
                                    <li>Temperature-controlled storage at 15-20°C</li>
                                    <li>IoT sensors for real-time monitoring</li>
                                    <li>Automated alerts for temperature deviations</li>
                                    <li>99.2% cold chain compliance rate</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-[var(--bg-light)] rounded-lg">
                                <h4 className="font-semibold mb-2">Route Optimization</h4>
                                <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
                                    <li>AI-powered route planning for fuel efficiency</li>
                                    <li>Dynamic rerouting based on traffic conditions</li>
                                    <li>Multi-stop optimization for consolidated shipments</li>
                                    <li>20% reduction in transportation costs</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-[var(--bg-light)] rounded-lg">
                                <h4 className="font-semibold mb-2">Quality Assurance</h4>
                                <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
                                    <li>Quality checks at loading and unloading points</li>
                                    <li>Moisture and contamination testing</li>
                                    <li>Digital documentation and certificates</li>
                                    <li>Blockchain-based traceability integration</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-xl font-semibold mb-4">Recent Shipments</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <th className="text-left py-3 px-4">Shipment ID</th>
                                        <th className="text-left py-3 px-4">Origin</th>
                                        <th className="text-left py-3 px-4">Destination</th>
                                        <th className="text-left py-3 px-4">Product</th>
                                        <th className="text-left py-3 px-4">Quantity</th>
                                        <th className="text-left py-3 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <td className="py-3 px-4 font-mono text-sm">SHP-2025-001</td>
                                        <td className="py-3 px-4">Pune Warehouse</td>
                                        <td className="py-3 px-4">Mumbai Processing Unit</td>
                                        <td className="py-3 px-4">Soybean</td>
                                        <td className="py-3 px-4">50 MT</td>
                                        <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">In Transit</span></td>
                                    </tr>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <td className="py-3 px-4 font-mono text-sm">SHP-2025-002</td>
                                        <td className="py-3 px-4">Indore Warehouse</td>
                                        <td className="py-3 px-4">Delhi Distribution Center</td>
                                        <td className="py-3 px-4">Mustard</td>
                                        <td className="py-3 px-4">75 MT</td>
                                        <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Delivered</span></td>
                                    </tr>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <td className="py-3 px-4 font-mono text-sm">SHP-2025-003</td>
                                        <td className="py-3 px-4">Rajkot Warehouse</td>
                                        <td className="py-3 px-4">Ahmedabad Oil Mill</td>
                                        <td className="py-3 px-4">Groundnut</td>
                                        <td className="py-3 px-4">30 MT</td>
                                        <td className="py-3 px-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Scheduled</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
