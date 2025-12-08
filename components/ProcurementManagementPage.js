function ProcurementManagementPage({ initialTab = 'procurement' }) {
    const [activeTab, setActiveTab] = React.useState(initialTab);

    // Update active tab if prop changes
    React.useEffect(() => {
        if (initialTab) setActiveTab(initialTab);
    }, [initialTab]);

    const [dailyInflows, setDailyInflows] = React.useState([
        { id: 1, farmer: "Ramesh Kumar", crop: "Soybean", quantity: 15, quality: "Grade A", date: "2024-12-07", status: "Verified", moisture: 12, oil: 18, admixture: 1 },
        { id: 2, farmer: "Suresh Patil", crop: "Mustard", quantity: 8, quality: "Grade B", date: "2024-12-07", status: "Pending", moisture: 14, oil: 38, admixture: 3 },
        { id: 3, farmer: "Anita Devi", crop: "Groundnut", quantity: 12, quality: "Grade A", date: "2024-12-06", status: "Verified", moisture: 9, oil: 45, admixture: 0.5 },
    ]);

    return (
        <div className="animate-circular-reveal" data-name="procurement-management-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1">
                        {activeTab === 'quality' ? 'Quality Control' : 'Procurement Management'}
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        {activeTab === 'quality' ? 'Inspect and grade incoming produce' : 'Manage farmer collections and verified stocks'}
                    </p>
                </div>
                {activeTab === 'procurement' && (
                    <button className="btn-primary flex items-center gap-2">
                        <div className="icon-plus"></div>
                        <span>New Entry</span>
                    </button>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6 border-b border-[var(--border-color)]">
                <button
                    onClick={() => setActiveTab('procurement')}
                    className={`pb-2 px-1 font-medium text-sm transition-all border-b-2 ${activeTab === 'procurement' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Inflow & Collection
                </button>
                <button
                    onClick={() => setActiveTab('quality')}
                    className={`pb-2 px-1 font-medium text-sm transition-all border-b-2 ${activeTab === 'quality' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Quality Grading
                </button>
            </div>

            {activeTab === 'procurement' ? (
                <>
                    {/* Procurement View */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-100">
                            <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Today's Collection</p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">23 MT</p>
                        </div>
                        <div className="card bg-green-50 dark:bg-green-900/20 border-green-100">
                            <p className="text-sm text-green-600 dark:text-green-300 mb-1">Total Farmers</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">142</p>
                        </div>
                        <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-100">
                            <p className="text-sm text-amber-600 dark:text-amber-300 mb-1">Pending Invoices</p>
                            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">12</p>
                        </div>
                        <div className="card bg-purple-50 dark:bg-purple-900/20 border-purple-100">
                            <p className="text-sm text-purple-600 dark:text-purple-300 mb-1">Avg. Purchase Price</p>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">₹4,850/q</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Recent Inflows</h3>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Search farmer..." className="px-3 py-1 text-sm border border-[var(--border-color)] rounded-lg bg-[var(--bg-light)]" />
                                <button className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)]">
                                    <div className="icon-filter text-sm"></div>
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Farmer</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Crop</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Quantity (Qtls)</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {dailyInflows.map((inflow) => (
                                        <tr key={inflow.id} className="hover:bg-[var(--bg-light)] transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">{inflow.date}</td>
                                            <td className="px-4 py-3 whitespace-nowrap font-medium">{inflow.farmer}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">{inflow.crop}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">{inflow.quantity}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${inflow.status === 'Verified' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${inflow.status === 'Verified' ? 'bg-blue-600' : 'bg-gray-500'}`}></span>
                                                    {inflow.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                                <button className="text-[var(--primary-color)] hover:text-[var(--primary-dark)] font-medium">Receipt</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Quality View */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card border-amber-100 bg-amber-50/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Pending Checks</p>
                                    <h3 className="text-3xl font-bold text-amber-900 mt-1">5</h3>
                                </div>
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-600 icon-clock"></div>
                            </div>
                        </div>
                        <div className="card border-red-100 bg-red-50/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-red-800">Rejected Lots (Today)</p>
                                    <h3 className="text-3xl font-bold text-red-900 mt-1">2</h3>
                                </div>
                                <div className="p-2 bg-red-100 rounded-lg text-red-600 icon-x-circle"></div>
                            </div>
                        </div>
                        <div className="card border-green-100 bg-green-50/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-green-800">Avg Quality Score</p>
                                    <h3 className="text-3xl font-bold text-green-900 mt-1">94%</h3>
                                </div>
                                <div className="p-2 bg-green-100 rounded-lg text-green-600 icon-check-circle"></div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Quality Inspection Queue</h3>
                            <button className="btn-primary text-sm">AI Quality Analysis</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Lot ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Crop</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Moisture %</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Oil Content %</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Admixture %</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Grade</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {dailyInflows.map((row) => (
                                        <tr key={row.id} className="hover:bg-[var(--bg-light)] transition-colors">
                                            <td className="px-4 py-3 text-sm font-mono text-gray-500">LOT-{202400 + row.id}</td>
                                            <td className="px-4 py-3 font-medium">{row.crop}</td>
                                            <td className="px-4 py-3 text-sm">{row.moisture}%</td>
                                            <td className="px-4 py-3 text-sm">{row.oil}%</td>
                                            <td className="px-4 py-3 text-sm">{row.admixture}%</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${row.quality === 'Grade A' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {row.quality}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-1 text-green-600 hover:bg-green-50 rounded" title="Approve">
                                                        <div className="icon-check"></div>
                                                    </button>
                                                    <button className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject">
                                                        <div className="icon-x"></div>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
