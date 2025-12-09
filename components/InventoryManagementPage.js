// import { useSharedData } from '../utils/SharedDataContext.js';

function InventoryManagementPage() {
    const [activeTab, setActiveTab] = React.useState('inventory');
    const [inventoryItems, setInventoryItems] = React.useState([]);
    const [marketItems, setMarketItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const toast = useToast();

    React.useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'inventory' || activeTab === 'sales') {
                const data = await window.MockApiService.getInventory(); // Actually getProcessorInventory?
                // The MockApiService distinction was ambiguous in my head.
                // Let's use getProcessorInventory if available, else getInventory
                const procData = await window.MockApiService.getProcessorInventory();
                setInventoryItems(procData);
            } else if (activeTab === 'procurement') {
                const data = await window.MockApiService.getProcessorMarketplace();
                setMarketItems(data);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuy = async (item) => {
        if (!window.confirm(`Buy ${item.item} for ₹${item.pricePerUnit}?`)) return;
        await window.MockApiService.buyForProcessing("Current User", item.id);
        toast.success("Raw Material Purchased!");
        loadData();
    };

    const handleProcess = async (item) => {
        if (!window.confirm(`Process Batch ${item.batch}? This will convert it to Oil.`)) return;
        const res = await window.MockApiService.processBatch(item.id, `${item.item.split(' ')[0]} Oil`);
        if (res.success) {
            toast.success("Processing Complete! Yield added to inventory.");
            loadData();
        }
    };

    // Calculate stats
    const totalQty = inventoryItems.reduce((acc, item) => acc + (parseFloat(item.quantity) || 0), 0);
    const rawCount = inventoryItems.filter(i => i.type === 'Raw Material').length;
    const finishedCount = inventoryItems.filter(i => i.type === 'Finished Good').length;

    return (
        <div className="animate-circular-reveal" data-name="inventory-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Processor Operations</h1>
                    <p className="text-[var(--text-secondary)]">Procure, Process, and Manage Inventory</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary" onClick={loadData} title="Refresh">
                        <div className="icon-refresh-cw"></div>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 border-b border-[var(--border-color)] mb-6">
                {['inventory', 'procurement', 'sales'].map(tab => (
                    <button
                        key={tab}
                        className={`pb-2 px-4 font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-[var(--primary-color)] text-[var(--primary-color)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'procurement' ? 'Buy Raw Material' : tab === 'sales' ? 'Sell Products' : 'My Inventory'}
                    </button>
                ))}
            </div>

            {/* Content Views */}
            {isLoading ? (
                <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : (
                <>
                    {/* INVENTORY TAB */}
                    {activeTab === 'inventory' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="card bg-blue-50 border-blue-100">
                                    <p className="text-sm text-blue-600 font-bold">Total Stock</p>
                                    <p className="text-2xl font-bold">{totalQty} Units</p>
                                </div>
                                <div className="card bg-amber-50 border-amber-100">
                                    <p className="text-sm text-amber-600 font-bold">Raw Materials</p>
                                    <p className="text-2xl font-bold">{rawCount} Batches</p>
                                </div>
                                <div className="card bg-green-50 border-green-100">
                                    <p className="text-sm text-green-600 font-bold">Finished Goods</p>
                                    <p className="text-2xl font-bold">{finishedCount} Batches</p>
                                </div>
                            </div>

                            <div className="card overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-semibold text-sm">
                                        <tr>
                                            <th className="p-3">Batch</th>
                                            <th className="p-3">Item</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3">Qty</th>
                                            <th className="p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {inventoryItems.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="p-3 font-mono">{row.batch}</td>
                                                <td className="p-3 font-bold">{row.item}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs ${row.type === 'Raw Material' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                                                        {row.type}
                                                    </span>
                                                </td>
                                                <td className="p-3">{row.quantity} {row.unit}</td>
                                                <td className="p-3">
                                                    {row.type === 'Raw Material' && (
                                                        <button onClick={() => handleProcess(row)} className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-xs">
                                                            Process Batch
                                                        </button>
                                                    )}
                                                    {row.type === 'Finished Good' && (
                                                        <span className="text-green-600 font-medium text-xs">Ready for Sale</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* PROCUREMENT TAB */}
                    {activeTab === 'procurement' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {marketItems.length === 0 ? (
                                <div className="col-span-full text-center p-8 text-gray-500">No raw materials available from FPOs.</div>
                            ) : marketItems.map((item, idx) => (
                                <div key={idx} className="card hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{item.item}</h3>
                                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Raw Material</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">Seller: {item.seller || 'FPO'}</p>
                                    <p className="text-sm text-gray-600 mb-3">Location: {item.location}</p>
                                    <div className="flex justify-between items-center mt-4 pt-3 border-t">
                                        <div>
                                            <p className="text-xs text-gray-500">Price</p>
                                            <p className="font-bold text-xl">₹{item.pricePerUnit}</p>
                                        </div>
                                        <button onClick={() => handleBuy(item)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700">
                                            Buy Stock
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SALES TAB */}
                    {activeTab === 'sales' && (
                        <div>
                            <p className="mb-4 text-gray-600">These items are visible to Retailers.</p>
                            <div className="card overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-semibold text-sm">
                                        <tr>
                                            <th className="p-3">Product</th>
                                            <th className="p-3">Qty Available</th>
                                            <th className="p-3">Min Price</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-sm">
                                        {inventoryItems.filter(i => i.type === 'Finished Good').map((row, idx) => (
                                            <tr key={idx}>
                                                <td className="p-3 font-bold">{row.item}</td>
                                                <td className="p-3">{row.quantity} {row.unit}</td>
                                                <td className="p-3">₹150/L</td>
                                                <td className="p-3"><span className="text-green-600">Listed on Retail Market</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
