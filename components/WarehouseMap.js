function WarehouseMap() {
  try {
    const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
    const [warehouses, setWarehouses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const user = getCurrentUser();
    const isAdmin = user?.role === 'admin';

    // Mock ISRO Map Markers based on warehouse data
    const [mapMarkers, setMapMarkers] = React.useState([]);

    React.useEffect(() => {
      // Load data (simulated)
      const data = isAdmin ? window.mockData?.warehouses || [] : window.mockData?.nearbyWarehouses || [];
      // If mockData isn't loaded yet, fallback to simple array
      const safeData = data.length ? data : [
        { id: 1, name: 'Central Warehouse A', location: 'Nashik', capacity: 5000, currentStock: 3200 },
        { id: 2, name: 'Cold Storage Unit 1', location: 'Pune', capacity: 2000, currentStock: 1800 },
        { id: 3, name: 'Rural Collection Center', location: 'Aurangabad', capacity: 1000, currentStock: 450 }
      ];

      setWarehouses(safeData);
      setLoading(false);

      // Convert to map markers
      const markers = safeData.map((w, i) => ({
        label: w.name,
        sub: `${w.currentStock}/${w.capacity} MT`,
        x: 20 + (i * 25), // Distribute
        y: 30 + (i * 10),
        color: (w.currentStock / w.capacity) > 0.9 ? 'bg-red-500' : 'bg-green-500'
      }));
      setMapMarkers(markers);

    }, [isAdmin]);

    if (loading) {
      return (
        <div className="card p-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6" data-name="warehouse-map">

        {/* ISRO Map View */}
        <ISROMap
          title="Warehouse Network (Geospatial View)"
          height="350px"
          markers={mapMarkers}
        />

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {isAdmin ? 'Managed Warehouses' : 'Nearby Storage Facilities'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {warehouses.map((wh, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedWarehouse === idx
                  ? 'border-[var(--primary-color)] shadow-md scale-105'
                  : 'border-[var(--border-color)]'
                  }`}
                onClick={() => setSelectedWarehouse(selectedWarehouse === idx ? null : idx)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="icon-warehouse text-xl text-blue-600"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{wh.name}</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{wh.location}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-secondary)]">Capacity</span>
                      <span className="font-medium">{wh.capacity} MT</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-[var(--text-secondary)]">Current</span>
                      <span className="font-medium text-[var(--primary-color)]">{wh.currentStock} MT</span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[var(--primary-color)] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(wh.currentStock / wh.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('WarehouseMap component error:', error);
    return null;
  }
}