// Internal Component for Route Optimization
function RouteOptimizer({ onRouteCalculated }) {
    const [from, setFrom] = React.useState('Nagpur');
    const [to, setTo] = React.useState('Mumbai');
    const [result, setResult] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API Calculation
        setTimeout(() => {
            const dist = Math.floor(Math.random() * 300) + 400; // 400-700km
            const speed = 55; // avg truck speed
            const time = (dist / speed).toFixed(1);
            const fuel = (dist / 3.5).toFixed(0); // 3.5 km/l mileage
            const cost = (fuel * 95).toLocaleString(); // ₹95/l diesel

            const data = {
                distance: dist,
                duration: `${Math.floor(time)}h ${Math.round((time % 1) * 60)}m`,
                fuel: `${fuel} L`,
                cost: `₹${cost}`,
                traffic: Math.random() > 0.5 ? 'Heavy' : 'Clear',
                savings: `₹${(Math.random() * 500 + 200).toFixed(0)}`
            };

            setResult(data);
            setLoading(false);
            if (onRouteCalculated) onRouteCalculated(data);
        }, 1500);
    };

    return (
        <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Origin</label>
                    <div className="relative">
                        <div className="icon-map-pin absolute left-2 top-2.5 text-gray-400 text-xs"></div>
                        <select value={from} onChange={e => setFrom(e.target.value)} className="w-full pl-7 pr-2 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors">
                            <option>Nagpur</option>
                            <option>Nashik</option>
                            <option>Amravati</option>
                            <option>Wardha</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Destination</label>
                    <div className="relative">
                        <div className="icon-flag absolute left-2 top-2.5 text-gray-400 text-xs"></div>
                        <select value={to} onChange={e => setTo(e.target.value)} className="w-full pl-7 pr-2 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors">
                            <option>Mumbai</option>
                            <option>Pune</option>
                            <option>Aurangabad</option>
                            <option>Delhi</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-medium shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
                {loading ? (
                    <><span className="animate-spin">↻</span> Optimizing...</>
                ) : (
                    <><span className="icon-zap"></span> Find Best Route</>
                )}
            </button>

            {result && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1">
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">Most Efficient</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 mb-3">
                        <div>
                            <p className="text-xs text-indigo-500">Distance</p>
                            <p className="font-bold text-gray-900 dark:text-white">{result.distance} km</p>
                        </div>
                        <div>
                            <p className="text-xs text-indigo-500">Est. Time</p>
                            <p className="font-bold text-gray-900 dark:text-white">{result.duration}</p>
                        </div>
                        <div>
                            <p className="text-xs text-indigo-500">Fuel Est.</p>
                            <p className="font-bold text-gray-900 dark:text-white">{result.fuel}</p>
                        </div>
                        <div>
                            <p className="text-xs text-indigo-500">Cost</p>
                            <p className="font-bold text-gray-900 dark:text-white">{result.cost}</p>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-indigo-200 dark:border-indigo-700">
                        <p className="text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                            <span className="icon-trending-up"></span> Saving <b>{result.savings}</b> vs avg. route.
                        </p>
                    </div>
                </div>
            )}
        </form>
    );
}

function LogisticsPage() {
    const [shipments, setShipments] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showDispatchModal, setShowDispatchModal] = React.useState(false);
    const [mapMarkers, setMapMarkers] = React.useState([]);
    const [mapRoutes, setMapRoutes] = React.useState([]);
    const toast = window.useToast();

    React.useEffect(() => {
        loadShipments();
        const interval = setInterval(loadShipments, 15000);
        return () => clearInterval(interval);
    }, []);

    const loadShipments = async () => {
        // Don't set loading true on poll to avoid flicker, only initial
        try {
            if (window.MockApiService && window.MockApiService.getShipments) {
                const data = await window.MockApiService.getShipments();
                setShipments(data);

                // Map shipments to ISRO Map markers
                const markers = data.map((s, i) => ({
                    label: s.id,
                    sub: s.status,
                    x: 40 + (i * 10) % 50, // Wrap around to keep on map
                    y: 30 + (i * 15) % 50,
                    color: s.status === 'In Transit' ? 'bg-blue-500' : s.status === 'Arrived' ? 'bg-green-500' : 'bg-red-500'
                }));
                setMapMarkers(markers);

                const routes = data.filter(s => s.status === 'In Transit').map((s, i) => ({
                    from: { x: 50, y: 50 },
                    to: { x: 40 + (i * 10) % 50, y: 30 + (i * 15) % 50 },
                    color: '#3b82f6'
                }));
                setMapRoutes(routes);
            }
        } catch (error) {
            console.error("Failed to load shipments", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDispatch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newShipment = {
            dest: formData.get('dest'),
            driver: formData.get('driver'),
            cargo: formData.get('cargo'),
            quantity: formData.get('quantity'),
            unit: 'MT',
            item: formData.get('cargo').split('(')[0].trim() // simple parse
        };

        setIsLoading(true);
        await window.MockApiService.dispatchShipment(newShipment);
        toast.success("Shipment Dispatched! 🚚");
        setShowDispatchModal(false);
        loadShipments();
    };

    const handleUpdateStatus = async (id, status) => {
        await window.MockApiService.updateShipmentStatus(id, status);
        toast.info(`Status updated to ${status}`);
        if (status === 'Arrived') toast.success("Inventory automatically updated! (Unified Sync)");
        loadShipments();
    };

    return (
        <div className="animate-circular-reveal" data-name="logistics-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Logistics & Transport</h1>
                    <p className="text-[var(--text-secondary)]">Unified Sync: Dispatch updates Inventory automatically.</p>
                </div>
                <button onClick={() => setShowDispatchModal(true)} className="btn-primary flex items-center gap-2">
                    <span className="icon-plus"></span> Dispatch Shipment
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Active Shipments</h3>
                        <div className="icon-truck text-2xl text-blue-600"></div>
                    </div>
                    <p className="text-3xl font-bold text-blue-900 dark:text-white">{shipments.filter(s => s.status === 'In Transit').length}</p>
                </div>
                <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-green-900 dark:text-green-100">Completed</h3>
                        <div className="icon-check-circle text-2xl text-green-600"></div>
                    </div>
                    <p className="text-3xl font-bold text-green-900 dark:text-white">{shipments.filter(s => s.status === 'Arrived').length}</p>
                </div>
                <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">Total Volume</h3>
                        <div className="icon-package text-2xl text-purple-600"></div>
                    </div>
                    <p className="text-3xl font-bold text-purple-900 dark:text-white">{shipments.reduce((acc, s) => acc + (parseFloat(s.quantity) || 0), 0)} MT</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* ISRO MAP */}
                    <ISROMap
                        title="Live Fleet Tracking (ISRO Gagan)"
                        height="450px"
                        markers={mapMarkers}
                        routes={mapRoutes}
                    />

                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Shipment Manifest</h3>
                            <button onClick={loadShipments} className="text-sm text-[var(--primary-color)] hover:underline flex items-center gap-1">
                                <span className={isLoading ? 'animate-spin' : ''}>↻</span> Refresh
                            </button>
                        </div>
                        <div className="space-y-4">
                            {shipments.map((trip, idx) => (
                                <div key={idx} className="border border-[var(--border-color)] rounded-lg p-4 hover:shadow-md transition-shadow relative group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                <div className="icon-truck text-gray-600 dark:text-gray-300"></div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{trip.id} <span className="text-xs font-normal text-gray-500">via {trip.driver}</span></p>
                                                <p className="text-xs text-[var(--text-secondary)]">{trip.cargo}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${trip.status === 'Arrived' ? 'bg-green-100 text-green-700' :
                                                trip.status === 'Delayed' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {trip.status}
                                            </span>

                                            {/* Demo Control: Update Status */}
                                            {trip.status === 'In Transit' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(trip.id, 'Arrived')}
                                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                                                    title="Simulate Arrival & Sync Inventory"
                                                >
                                                    Mark Arrived
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] border-t border-[var(--border-color)] pt-3">
                                        <div className="flex items-center gap-1">
                                            <div className="icon-map-pin"></div>
                                            <span>Dest: <span className="text-gray-900 dark:text-white font-medium">{trip.dest}</span></span>
                                        </div>
                                        {trip.progress && (
                                            <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-1.5 ml-2">
                                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${trip.progress}%` }}></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Smart Route Optimizer */}
                    <div className="card bg-white dark:bg-gray-800 shadow-lg border border-blue-100 dark:border-blue-900">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <span className="icon-map text-blue-600 dark:text-blue-400"></span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Smart Route Optimizer</h3>
                        </div>

                        <RouteOptimizer onRouteCalculated={(route) => {
                            // Visualize on Map (Demo)
                            setMapRoutes([{
                                from: { x: 20, y: 30 },
                                to: { x: 70, y: 60 },
                                color: '#10b981', // Green for optimal 
                                dashed: false
                            }, {
                                from: { x: 20, y: 30 },
                                to: { x: 70, y: 60 },
                                mid: { x: 45, y: 80 }, // Curve
                                color: '#ef4444', // Red for traffic
                                dashed: true
                            }]);
                        }} />
                    </div>

                    <div className="card bg-[var(--bg-light)]">
                        <h3 className="font-semibold mb-2">Fleet Insights</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-white rounded border border-l-4 border-l-green-500">
                                <span>Fuel Efficiency</span>
                                <span className="font-bold text-green-700">94%</span>
                            </div>
                            <div className="flex justify-between p-2 bg-white rounded border border-l-4 border-l-amber-500">
                                <span>Maintenance Due</span>
                                <span className="font-bold text-amber-700">2 Trucks</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dispatch Modal */}
            <ModalDialog
                isOpen={showDispatchModal}
                onClose={() => setShowDispatchModal(false)}
                title="Dispatch New Shipment"
                size="md"
                footer={null} // custom footer in form
            >
                <form onSubmit={handleDispatch} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Destination</label>
                        <select name="dest" className="w-full border rounded p-2" required>
                            <option value="Select">Select Destination...</option>
                            <option value="Central Warehouse (Nashik)">Central Warehouse (Nashik)</option>
                            <option value="Processing Unit A (Pune)">Processing Unit A (Pune)</option>
                            <option value="Export Hub (Mumbai)">Export Hub (Mumbai)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Cargo Description</label>
                        <input name="cargo" placeholder="e.g. Soybean (20MT)" className="w-full border rounded p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity (MT)</label>
                        <input name="quantity" type="number" placeholder="20" className="w-full border rounded p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Assign Driver</label>
                        <input name="driver" placeholder="Driver Name" className="w-full border rounded p-2" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowDispatchModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                        <button type="submit" className="btn-primary">Dispatch Truck 🚚</button>
                    </div>
                </form>
            </ModalDialog>
        </div>
    );
}
