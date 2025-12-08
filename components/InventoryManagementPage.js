// import { useSharedData } from '../utils/SharedDataContext.js';

function InventoryManagementPage() {
    const [inventoryItems, setInventoryItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        setIsLoading(true);
        try {
            const data = await window.MockApiService.getInventory();
            setInventoryItems(data);
        } catch (error) {
            console.error("Failed to load inventory", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate stats
    const totalQty = inventoryItems.reduce((acc, item) => {
        // Simple parsing: "120 MT" -> 120
        const val = parseFloat(item.quantity) || 0;
        return acc + val;
    }, 0);

    return (
        <div className="animate-circular-reveal" data-name="inventory-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Inventory Management</h1>
                    <p className="text-[var(--text-secondary)]">Track stock levels and warehouse conditions</p>
                </div>
                <button className="btn-secondary" onClick={loadInventory} title="Refresh Inventory">
                    <div className="icon-refresh-cw"></div>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card bg-[var(--bg-white)]">
                    <div className="flex justify-between items-start mb-2">
                        <div className="icon-package text-2xl text-[var(--primary-color)]"></div>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Normal</span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm">Total Storage Used</p>
                    <h3 className="text-2xl font-bold">{totalQty} MT</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Capacity: 2,000 MT</p>
                </div>
                <div className="card bg-[var(--bg-white)]">
                    <div className="flex justify-between items-start mb-2">
                        <div className="icon-thermometer text-2xl text-amber-500"></div>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Optimal</span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm">Avg Temperature</p>
                    <h3 className="text-2xl font-bold">24°C</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Range: 20°C - 26°C</p>
                </div>
                <div className="card bg-[var(--bg-white)]">
                    <div className="flex justify-between items-start mb-2">
                        <div className="icon-droplet text-2xl text-blue-500"></div>
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">Warning</span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm">Avg Humidity</p>
                    <h3 className="text-2xl font-bold">62%</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Target: &lt;60%</p>
                </div>
                <div className="card bg-[var(--bg-white)]">
                    <div className="flex justify-between items-start mb-2">
                        <div className="icon-truck text-2xl text-purple-500"></div>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Today</span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm">Pending Dispatches</p>
                    <h3 className="text-2xl font-bold">3 Orders</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Total: 45 MT</p>
                </div>
            </div>

            <div className="card mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Current Stock</h3>
                    <button className="text-sm text-[var(--primary-color)] font-medium">Download Report</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] text-sm text-[var(--text-secondary)]">
                                <th className="py-3 px-4 font-medium">Batch ID</th>
                                <th className="py-3 px-4 font-medium">Item Name</th>
                                <th className="py-3 px-4 font-medium">Category</th>
                                <th className="py-3 px-4 font-medium">Quantity</th>
                                <th className="py-3 px-4 font-medium">Type</th>
                                <th className="py-3 px-4 font-medium">Details</th>
                                <th className="py-3 px-4 font-medium">Location</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isLoading ? (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading Inventory...</td></tr>
                            ) : inventoryItems.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Inventory Empty</td></tr>
                            ) : (
                                inventoryItems.map((row, idx) => (
                                    <tr key={idx} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-light)]">
                                        <td className="py-3 px-4 font-medium">{row.batch || row.id}</td>
                                        <td className="py-3 px-4">{row.item || row.name}</td>
                                        <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">{row.type || row.cat}</span></td>
                                        <td className="py-3 px-4 font-semibold">{row.quantity} {row.unit}</td>
                                        <td className="py-3 px-4 text-[var(--text-secondary)]">{row.type}</td>
                                        <td className="py-3 px-4 text-xs font-mono text-gray-500">{JSON.stringify(row.qualityDetails || {})}</td>
                                        <td className="py-3 px-4 text-[var(--text-secondary)]">{row.location || row.loc}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
