function ProcurementManagementPage({ initialTab = 'procurement' }) {
    // Determine active view based on prop
    const [activeTab, setActiveTab] = React.useState(initialTab);
    const [isLoading, setIsLoading] = React.useState(true);
    const [dailyInflows, setDailyInflows] = React.useState([]);
    const [inventory, setInventory] = React.useState([]);

    React.useEffect(() => {
        // Sync internal state if prop changes
        if (initialTab) setActiveTab(initialTab);
    }, [initialTab]);

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await window.MockApiService.getProcurementRequests();
            setDailyInflows(data);
            const invData = await window.MockApiService.getInventory();
            setInventory(invData);
        } catch (error) {
            console.error("Failed to load procurement data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (id) => {
        if (!window.confirm("Verify quality and approve this lot?")) return;

        try {
            // Simulate quality data entry
            const qualityData = {
                moisture: (10 + Math.random() * 4).toFixed(1), // 10-14%
                oilContent: (18 + Math.random() * 5).toFixed(1), // 18-23%
                admixture: (1 + Math.random() * 2).toFixed(1) // 1-3%
            };

            await window.MockApiService.verifyCollection(id, qualityData);
            window.useToast().success(`Lot #${id} Verified & Added to Inventory`);
            loadData(); // Refresh list
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;
        await window.MockApiService.rejectCollection(id, reason);
        window.useToast().error(`Lot #${id} Rejected`);
        loadData();
    };

    const handleSellToProcessor = async (item) => {
        if (!window.confirm(`List ${item.item} for Processors?`)) return;
        // In this mock, listing is automatic based on inventory, but we can simulate a specific action
        // Actually, let's call buyForProcessing from Processor side, OR we can have a "Push" model.
        // My plan said: "List for Processors".
        // MockApiService.getProcessorMarketplace reads from Inventory directly.
        // So just by being in Inventory, it is visible. 
        // But maybe we want to mark it as "For Sale"?
        // Let's just show a toast for now that it is available.
        window.useToast().success(`${item.item} is now visible to Processors`);
    };


    // Helper to filter data based on tab
    // Inflow: Pending or Verified recently
    // Quality: Pending specifically for grading
    const inflows = dailyInflows;
    const pendingQuality = dailyInflows.filter(i => i.status === 'Pending');

    return (
        <div className="animate-circular-reveal" data-name="procurement-management-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Procurement Management</h1>
                    <p className="text-[var(--text-secondary)]">Manage farmer collections and quality checks</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary" onClick={loadData} title="Refresh Data">
                        <div className="icon-refresh-cw"></div>
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <div className="icon-plus"></div>
                        <span>New Entry</span>
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-4 border-b border-[var(--border-color)] mb-6">
                <button
                    className={`pb-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'procurement' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('procurement')}
                >
                    Inflow & Collection
                </button>
                <button
                    className={`pb-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'quality' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('quality')}
                >
                    Quality Grading <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{pendingQuality.length}</span>
                </button>
                <button
                    className={`pb-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'inventory' ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    Inventory & Sales
                </button>
            </div>

            {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading Procurement Data...</div>
            ) : (
                <>
                    {/* View 1: Procurement / Inflow */}
                    {activeTab === 'procurement' && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="card p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 icon-truck text-xl"></div>
                                    <div><p className="text-sm text-gray-500">Daily Inflow</p><p className="text-xl font-bold">45 MT</p></div>
                                </div>
                                <div className="card p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 icon-check-circle text-xl"></div>
                                    <div><p className="text-sm text-gray-500">Verified Lots</p><p className="text-xl font-bold">{inflows.filter(i => i.status === 'Verified').length}</p></div>
                                </div>
                                <div className="card p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 icon-clock text-xl"></div>
                                    <div><p className="text-sm text-gray-500">Pending QC</p><p className="text-xl font-bold">{pendingQuality.length}</p></div>
                                </div>
                                <div className="card p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 icon-wallet text-xl"></div>
                                    <div><p className="text-sm text-gray-500">Payments Due</p><p className="text-xl font-bold">₹ 12.5L</p></div>
                                </div>
                            </div>

                            <div className="card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">ID</th>
                                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Farmer</th>
                                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Crop</th>
                                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Qty (Quintal)</th>
                                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {inflows.map((row) => (
                                                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <td className="p-4 font-mono text-xs">{row.id}</td>
                                                    <td className="p-4 font-medium">{row.farmer}</td>
                                                    <td className="p-4">{row.crop}</td>
                                                    <td className="p-4">{row.quantity}</td>
                                                    <td className="p-4 text-sm text-gray-500">{row.date}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${row.status === 'Verified' ? 'bg-green-100 text-green-700' :
                                                            row.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {row.status === 'Pending' && (
                                                            <div className="flex gap-2">
                                                                <button onClick={() => setActiveTab('quality')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">QC Check</button>
                                                            </div>
                                                        )}
                                                        {row.status === 'Verified' && <span className="text-gray-400 text-sm">Completed</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View 2: Quality Grading */}
                    {activeTab === 'quality' && (
                        <div className="space-y-6">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex gap-3 text-amber-800">
                                <div className="icon-info mt-1"></div>
                                <div>
                                    <h4 className="font-bold">Quality Inspection Queue</h4>
                                    <p className="text-sm">Perform physical and chemical analysis on pending lots. Grade determines procurement price.</p>
                                </div>
                            </div>

                            <div className="card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="p-4">Lot ID</th>
                                                <th className="p-4">Crop</th>
                                                <th className="p-4">Sample Drawn?</th>
                                                <th className="p-4">Moisture %</th>
                                                <th className="p-4">Oil Content %</th>
                                                <th className="p-4">Admixture %</th>
                                                <th className="p-4">Predicted Grade</th>
                                                <th className="p-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {pendingQuality.length === 0 ? (
                                                <tr><td colSpan="8" className="p-8 text-center text-gray-500">No pending lots for quality check.</td></tr>
                                            ) : (
                                                pendingQuality.map((row) => (
                                                    <tr key={row.id}>
                                                        <td className="p-4 font-medium">{row.id}</td>
                                                        <td className="p-4">{row.crop}</td>
                                                        <td className="p-4"><span className="text-green-600 icon-check-circle"></span> Yes</td>
                                                        <td className="p-4 text-gray-400 italic">--</td>
                                                        <td className="p-4 text-gray-400 italic">--</td>
                                                        <td className="p-4 text-gray-400 italic">--</td>
                                                        <td className="p-4"><span className="text-gray-400">Pending Test</span></td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleVerify(row.id)} className="btn-sm bg-green-600 text-white hover:bg-green-700">Approve & Grade</button>
                                                                <button onClick={() => handleReject(row.id)} className="btn-sm bg-red-100 text-red-600 hover:bg-red-200">Reject</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View 3: Inventory & Sales */}
                    {activeTab === 'inventory' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex gap-3 text-blue-800">
                                <div className="icon-box mt-1"></div>
                                <div>
                                    <h4 className="font-bold">FPO Inventory & Sales</h4>
                                    <p className="text-sm">Manage verified stock and list items for Processors to buy.</p>
                                </div>
                            </div>

                            <div className="card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="p-4">Batch ID</th>
                                                <th className="p-4">Item</th>
                                                <th className="p-4">Quantity</th>
                                                <th className="p-4">Location</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {inventory.length === 0 ? (
                                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Inventory is empty.</td></tr>
                                            ) : (
                                                inventory.map((row) => (
                                                    <tr key={row.id}>
                                                        <td className="p-4 font-mono text-xs">{row.batch || row.id}</td>
                                                        <td className="p-4 font-bold">{row.item}</td>
                                                        <td className="p-4">{row.quantity} {row.unit}</td>
                                                        <td className="p-4">{row.location}</td>
                                                        <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Available</span></td>
                                                        <td className="p-4">
                                                            <button
                                                                onClick={() => handleSellToProcessor(row)}
                                                                className="btn-sm bg-blue-600 text-white hover:bg-blue-700 transition"
                                                            >
                                                                List for Processors
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
