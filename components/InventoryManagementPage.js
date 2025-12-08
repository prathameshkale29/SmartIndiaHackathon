// import { useSharedData } from '../utils/SharedDataContext.js';

function InventoryManagementPage() {
    const { userCrops, farmers } = useSharedData(); // Assuming inventory comes from userCrops or similar in shared state

    // For this demo, let's map userCrops to inventory items if they exist, 
    // or keep the static structure but populated from context if we add a specific 'inventory' array.
    // The current context has 'userCrops' which are growing crops, but let's assume 'warehouses' or similar tracks stock.
    // For now, I'll map the static list to be dynamic if possible, or leave it as a placeholder until we add specific inventory actions.
    // However, the prompt asked to CONNECT roles. 
    // Let's make the "Current Stock" reflect what we have. 
    // We can use a derived state from 'userCrops' where status is 'Harvested' or similar for inventory?
    // Or just use the 'warehouses' data from context.

    // Let's use 'userCrops' to simulate some farm inventory + 'warehouses' for storage capacity.

    const inventoryItems = [
        { id: 'BAT-001', name: 'Soybean Seeds', cat: 'Raw Material', qty: '450 MT', date: '01 Dec 2024', qual: 'Grade A', loc: 'Warehouse A' },
        { id: 'BAT-002', name: 'Mustard Oil', cat: 'Processed', qty: '1200 L', date: '03 Dec 2024', qual: 'Premium', loc: 'Silo 2' },
        // Add dynamic items from userCrops if they are ready?
        ...userCrops.map((c, i) => ({
            id: `FARM-${i}`,
            name: c.name,
            cat: 'Harvest',
            qty: `${c.area * 2} MT`, // Est yield
            date: new Date().toLocaleDateString(),
            qual: 'Standard',
            loc: 'Farm Storage'
        }))
    ];

    return (
        <div className="animate-circular-reveal" data-name="inventory-page">
            <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
            <p className="text-[var(--text-secondary)] mb-6">Track stock levels and warehouse conditions</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card bg-[var(--bg-white)]">
                    <div className="flex justify-between items-start mb-2">
                        <div className="icon-package text-2xl text-[var(--primary-color)]"></div>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Normal</span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm">Total Storage Used</p>
                    <h3 className="text-2xl font-bold">1,240 MT</h3>
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
                                <th className="py-3 px-4 font-medium">Arrival Date</th>
                                <th className="py-3 px-4 font-medium">Quality</th>
                                <th className="py-3 px-4 font-medium">Location</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {inventoryItems.map((row, idx) => (
                                <tr key={idx} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-light)]">
                                    <td className="py-3 px-4 font-medium">{row.id}</td>
                                    <td className="py-3 px-4">{row.name}</td>
                                    <td className="py-3 px-4"><span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">{row.cat}</span></td>
                                    <td className="py-3 px-4 font-semibold">{row.qty}</td>
                                    <td className="py-3 px-4 text-[var(--text-secondary)]">{row.date}</td>
                                    <td className="py-3 px-4"><span className="text-green-600 font-medium">{row.qual}</span></td>
                                    <td className="py-3 px-4 text-[var(--text-secondary)]">{row.loc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
