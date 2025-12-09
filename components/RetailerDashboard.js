function RetailerDashboard({ setActivePage, user }) {
    const [activeTab, setActiveTab] = React.useState('dashboard');
    const [marketItems, setMarketItems] = React.useState([]);
    const [inventory, setInventory] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const toast = useToast();

    React.useEffect(() => {
        if (activeTab === 'marketplace') loadMarketplace();
        if (activeTab === 'inventory') loadInventory();
    }, [activeTab]);

    const loadMarketplace = async () => {
        setIsLoading(true);
        try {
            const data = await window.MockApiService.getRetailerMarketplace();
            setMarketItems(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const loadInventory = async () => {
        setIsLoading(true);
        try {
            const data = await window.MockApiService.getRetailerStock();
            setInventory(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuy = async (item) => {
        if (!window.confirm(`Purchase ${item.item} from Processor?`)) return;
        const res = await window.MockApiService.buyForRetail("Current Retailer", item.id);
        if (res.success) {
            toast.success("Order Placed Successfully!");
            loadMarketplace(); // Refresh market
        }
    };

    const stats = [
        { title: 'Daily Sales', value: '₹45,200', change: 18, icon: 'shopping-bag', color: 'from-pink-500 to-rose-500' },
        { title: 'Orders Placed', value: '12', change: 5, icon: 'shopping-cart', color: 'from-blue-500 to-indigo-500' },
        { title: 'Low Stock Items', value: '3', change: -2, icon: 'alert-circle', color: 'from-amber-500 to-orange-500' },
        { title: 'Customer Footfall', value: '145', change: 10, icon: 'users', color: 'from-teal-500 to-cyan-500' }
    ];


    const [traceData, setTraceData] = React.useState(null);
    const [traceLoading, setTraceLoading] = React.useState(false);

    const handleTrace = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const batchId = formData.get('batchId');
        if (!batchId) return;

        setTraceLoading(true);
        try {
            const data = await window.MockApiService.getTraceabilityData(batchId);
            setTraceData(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch traceability data");
        } finally {
            setTraceLoading(false);
        }
    };

    return (
        <div className="animate-circular-reveal">
            {/* Retailer Hero Section */}
            <div className="mb-6 p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <div className="icon-store text-9xl"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <span className="bg-emerald-700 border border-emerald-600 text-emerald-100 px-3 py-1 rounded-full text-xs font-medium mb-3 inline-block">Retailer Dashboard</span>
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
                            <p className="text-emerald-200 max-w-xl">Track sales, manage inventory, and restocking based on AI demand forecasts.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${activeTab === 'dashboard' ? 'bg-white text-emerald-900' : 'bg-emerald-700 text-white hover:bg-emerald-600'}`}>
                                <div className="icon-grid"></div> Dashboard
                            </button>
                            <button onClick={() => setActiveTab('marketplace')} className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${activeTab === 'marketplace' ? 'bg-white text-emerald-900' : 'bg-emerald-700 text-white hover:bg-emerald-600'}`}>
                                <div className="icon-shopping-cart"></div> Buy Stock
                            </button>
                            <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${activeTab === 'inventory' ? 'bg-white text-emerald-900' : 'bg-emerald-700 text-white hover:bg-emerald-600'}`}>
                                <div className="icon-package"></div> My Inventory
                            </button>
                            <button onClick={() => setActiveTab('traceability')} className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${activeTab === 'traceability' ? 'bg-white text-emerald-900' : 'bg-emerald-700 text-white hover:bg-emerald-600'}`}>
                                <div className="icon-search"></div> Traceability
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
                <>
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
                        </div>

                        <div className="space-y-6">
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
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold mb-3">Restock Suggestions</h3>
                                <div className="space-y-3">
                                    <div className="p-3 border border-gray-200 rounded-lg">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium text-sm">Groundnut Oil</span>
                                            <span className="text-xs text-red-500 font-bold">Low</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">Only 12 units remaining.</p>
                                        <button onClick={() => setActiveTab('marketplace')} className="w-full btn-primary text-xs py-1.5">Order Restock</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* MARKETPLACE TAB */}
            {activeTab === 'marketplace' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Wholesale Marketplace (Processors)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="col-span-full text-center p-10">Loading Marketplace...</div>
                        ) : marketItems.length === 0 ? (
                            <div className="col-span-full text-center p-10 bg-gray-50 rounded-xl">No finished goods available from Processors securely.</div>
                        ) : (
                            marketItems.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition card">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{item.item}</h3>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Finished Good</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">From: {item.seller || 'Processor'}</p>
                                    <p className="text-sm text-gray-500 mb-4">Location: {item.location}</p>
                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <span className="font-bold text-xl">₹{item.pricePerUnit}</span>
                                        <button onClick={() => handleBuy(item)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700">
                                            Place Order
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* INVENTORY TAB */}
            {activeTab === 'inventory' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">My Store Inventory</h2>
                    <div className="card overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4">Item</th>
                                    <th className="p-4">Quantity</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {inventory.length === 0 ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">Your inventory is empty.</td></tr>
                                ) : (
                                    inventory.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="p-4 font-bold">{row.item}</td>
                                            <td className="p-4">{row.quantity} {row.unit}</td>
                                            <td className="p-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">In Stock</span></td>
                                            <td className="p-4 text-sm text-gray-500">Procured from Processor</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TRACEABILITY TAB */}
            {activeTab === 'traceability' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                        <h2 className="text-2xl font-bold mb-4">Blockchain Product Verification</h2>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">Verify the complete journey of your products from farm to store. Enter the Batch ID found on the product packaging.</p>

                        <form onSubmit={handleTrace} className="max-w-md mx-auto flex gap-2 mb-8">
                            <input
                                name="batchId"
                                placeholder="Enter Batch ID (e.g., BATCH-XYZ-123)"
                                className="flex-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
                                required
                            />
                            <button type="submit" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                                {traceLoading ? <span className="animate-spin icon-loader"></span> : <div className="icon-search"></div>}
                                Verify
                            </button>
                        </form>

                        {traceData && (
                            <div className="text-left animate-fade-in">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-6 mb-8">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-xl text-emerald-800 dark:text-emerald-400">{traceData.product}</h3>
                                            <p className="text-sm text-emerald-600 dark:text-emerald-500">Origin: {traceData.origin}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500">Batch ID</div>
                                            <div className="font-mono font-bold">{traceData.batchId}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative border-l-2 border-emerald-200 dark:border-emerald-800 ml-4 space-y-8 pb-4">
                                    {traceData.stages.map((stage, idx) => (
                                        <div key={idx} className="relative pl-8">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-gray-800"></div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold">{stage.stage}</h4>
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{stage.status}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    <div><span className="icon-calendar mr-1"></span> {stage.date}</div>
                                                    {stage.location && <div><span className="icon-map-pin mr-1"></span> {stage.location}</div>}
                                                    {stage.result && <div><span className="icon-check-circle mr-1"></span> {stage.result}</div>}
                                                </div>
                                                <div className="text-xs font-mono text-gray-400 truncate bg-gray-50 dark:bg-gray-900 p-1.5 rounded">
                                                    Hash: {stage.hash}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
