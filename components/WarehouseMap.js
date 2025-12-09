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
      // Extended Mock Data for Oilseed Warehouses
      // In a real app, this would come from an API endpoint like /api/warehouses
      const mockStorageSites = [
        {
          id: 1,
          name: 'Nashik Central Agro-Logistics',
          location: 'Nashik, MH',
          capacity: 5000,
          currentStock: 3200,
          storedCrops: ['Soybean', 'Groundnut'],
          type: 'Cold Storage + Dry',
          coordinates: { x: 30, y: 40 }
        },
        {
          id: 2,
          name: 'Pune Oilseed Depot',
          location: 'Pune, MH',
          capacity: 2500,
          currentStock: 2400,
          storedCrops: ['Sunflower', 'Safflower'],
          type: 'Silo',
          coordinates: { x: 35, y: 60 }
        },
        {
          id: 3,
          name: 'Latur Soybean Hub',
          location: 'Latur, MH',
          capacity: 8000,
          currentStock: 1500, // High availability
          storedCrops: ['Soybean'],
          type: 'Warehouse',
          coordinates: { x: 60, y: 65 }
        },
        {
          id: 4,
          name: 'Akola Oil Mill Storage',
          location: 'Akola, MH',
          capacity: 1500,
          currentStock: 1200,
          storedCrops: ['Cotton Seed', 'Soybean'],
          type: 'Processing Unit',
          coordinates: { x: 55, y: 35 }
        },
        {
          id: 5,
          name: 'Nagpur Export Terminal',
          location: 'Nagpur, MH',
          capacity: 12000,
          currentStock: 4000,
          storedCrops: ['Groundnut', 'Sesame', 'Mustard'],
          type: 'Export Hub',
          coordinates: { x: 80, y: 45 }
        }
      ];

      setWarehouses(mockStorageSites);
      setLoading(false);

      // Convert to map markers for ISRO Map
      const markers = mockStorageSites.map((w) => {
        const available = w.capacity - w.currentStock;
        const utilization = w.currentStock / w.capacity;

        return {
          label: w.name,
          sub: `Avail: ${available} MT | ${w.storedCrops.join(', ')}`,
          x: w.coordinates.x,
          y: w.coordinates.y,
          // Color coding: Green = Lots of space, Yellow = Half full, Red = Full
          color: utilization > 0.9 ? 'bg-red-500' : (utilization > 0.6 ? 'bg-amber-500' : 'bg-green-500')
        };
      });
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

        {/* Statistics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card bg-blue-50 p-4 border border-blue-100">
            <p className="text-xs text-blue-600 font-bold uppercase">Total Capacity</p>
            <p className="text-2xl font-bold text-gray-800">
              {warehouses.reduce((acc, w) => acc + w.capacity, 0).toLocaleString()} <span className="text-sm font-normal text-gray-500">MT</span>
            </p>
          </div>
          <div className="card bg-green-50 p-4 border border-green-100">
            <p className="text-xs text-green-600 font-bold uppercase">Available Space</p>
            <p className="text-2xl font-bold text-gray-800">
              {warehouses.reduce((acc, w) => acc + (w.capacity - w.currentStock), 0).toLocaleString()} <span className="text-sm font-normal text-gray-500">MT</span>
            </p>
          </div>
          <div className="card bg-amber-50 p-4 border border-amber-100">
            <p className="text-xs text-amber-600 font-bold uppercase">Active Warehouses</p>
            <p className="text-2xl font-bold text-gray-800">{warehouses.length}</p>
          </div>
          <div className="card bg-purple-50 p-4 border border-purple-100">
            <p className="text-xs text-purple-600 font-bold uppercase">Crop Variations</p>
            <p className="text-2xl font-bold text-gray-800">7</p>
          </div>
        </div>

        {/* ISRO Map View */}
        <ISROMap
          title="Satellite Live Storage View (ISRO Data)"
          height="450px"
          markers={mapMarkers}
        />

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            Available Storage Facilities
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Real-time capacity tracking for oilseed storage across the network.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warehouses.map((wh, idx) => {
              const available = wh.capacity - wh.currentStock;
              const percentage = Math.round((wh.currentStock / wh.capacity) * 100);

              return (
                <div
                  key={idx}
                  className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden group ${selectedWarehouse === idx
                    ? 'border-[var(--primary-color)] ring-1 ring-[var(--primary-color)]'
                    : 'border-[var(--border-color)]'
                    }`}
                  onClick={() => setSelectedWarehouse(selectedWarehouse === idx ? null : idx)}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-white
                    ${percentage > 90 ? 'bg-red-500' : (percentage > 60 ? 'bg-amber-500' : 'bg-green-500')}
                `}>
                    {percentage > 90 ? 'FULL' : (percentage > 60 ? 'FILLING FAST' : 'AVAILABLE')}
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200">
                      <div className="icon-warehouse text-2xl text-gray-600"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 truncate">{wh.name}</h4>
                      <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                        <span className="icon-map-pin"></span> {wh.location}
                      </p>

                      <div className="mt-3 space-y-2">
                        {/* Capacity Bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-500">Utilization</span>
                            <span className={`font-bold ${percentage > 90 ? 'text-red-600' : 'text-green-600'}`}>{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${percentage > 90 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                          <div>
                            <p className="text-[var(--text-secondary)]">Available</p>
                            <p className="font-bold text-green-700">{available.toLocaleString()} MT</p>
                          </div>
                          <div>
                            <p className="text-[var(--text-secondary)]">Total</p>
                            <p className="font-semibold">{wh.capacity.toLocaleString()} MT</p>
                          </div>
                        </div>

                        {/* Oilseeds Badge */}
                        <div className="pt-1 flex flex-wrap gap-1">
                          {wh.storedCrops.map(crop => (
                            <span key={crop} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] border border-blue-100">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('WarehouseMap component error:', error);
    return null;
  }
}