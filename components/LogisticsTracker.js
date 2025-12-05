function LogisticsTracker({ user }) {
  try {
    const [shipments, setShipments] = React.useState([]);
    const [selectedShipment, setSelectedShipment] = React.useState(null);
    const [showRouteModal, setShowRouteModal] = React.useState(false);

    React.useEffect(() => {
      loadShipments();
    }, []);

    const loadShipments = () => {
      const mockShipments = [
        {
          id: 'SHP001',
          crop: 'Mustard Seeds',
          quantity: 50,
          from: 'Wardha, Maharashtra',
          to: 'Mumbai, Maharashtra',
          status: 'In Transit',
          vehicle: 'MH-12-AB-1234',
          driver: 'Suresh Patil',
          driverPhone: '+91 98765-43210',
          temperature: '18°C',
          humidity: '45%',
          eta: '2 hours 30 mins',
          progress: 65,
          distance: '342 km',
          currentLocation: 'Near Pune Toll Plaza',
          route: [
            { location: 'Wardha', time: '09:00 AM', status: 'completed' },
            { location: 'Nagpur', time: '11:30 AM', status: 'completed' },
            { location: 'Pune', time: '03:00 PM', status: 'in-progress' },
            { location: 'Mumbai', time: '06:30 PM', status: 'pending' }
          ],
          temperatureLog: [
            { time: '09:00', temp: 17 },
            { time: '11:00', temp: 18 },
            { time: '13:00', temp: 19 },
            { time: '15:00', temp: 18 }
          ]
        },
        {
          id: 'SHP002',
          crop: 'Soybean',
          quantity: 75,
          from: 'Indore, MP',
          to: 'Delhi',
          status: 'Scheduled',
          vehicle: 'MP-09-XY-5678',
          driver: 'Rajesh Kumar',
          driverPhone: '+91 98765-54321',
          temperature: '20°C',
          humidity: '50%',
          eta: '8 hours',
          progress: 0,
          distance: '780 km',
          currentLocation: 'Warehouse',
          route: [],
          temperatureLog: []
        }
      ];
      setShipments(mockShipments);
      setSelectedShipment(mockShipments[0]);
    };

    const optimizeRoute = () => {
      setShowRouteModal(true);
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Logistics & Transportation</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:scale-105 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <div className="icon-truck text-3xl text-blue-600"></div>
              </div>
              <div>
                <p className="text-3xl font-bold">12</p>
                <p className="text-base font-medium">Active Shipments</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:scale-105 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <div className="icon-check-circle text-3xl text-green-600"></div>
              </div>
              <div>
                <p className="text-3xl font-bold">45</p>
                <p className="text-base font-medium">Completed Today</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl hover:scale-105 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <div className="icon-alert-triangle text-3xl text-red-600"></div>
              </div>
              <div>
                <p className="text-3xl font-bold">2</p>
                <p className="text-base font-medium">Delayed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-1">
            <h3 className="font-semibold mb-4">Active Shipments</h3>
            <div className="space-y-3">
              {shipments.map(ship => (
                <div
                  key={ship.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${selectedShipment?.id === ship.id
                      ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border-2 border-[var(--primary-color)] shadow-lg'
                      : 'bg-[var(--bg-light)] hover:shadow-md hover:scale-102'
                    }`}
                  onClick={() => setSelectedShipment(ship)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg text-[var(--primary-color)]">{ship.id}</p>
                      <p className="text-base font-medium text-[var(--text-primary)] mt-1">{ship.crop}</p>
                    </div>
                    <span className={`px-3 py-1.5 text-sm font-bold rounded-lg ${ship.status === 'In Transit'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-400 text-white'
                      }`}>{ship.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <div className="icon-map-pin text-base text-[var(--primary-color)]"></div>
                    <span className="flex-1">{ship.from}</span>
                    <div className="icon-arrow-right text-base text-[var(--primary-color)]"></div>
                    <span className="flex-1 text-right">{ship.to}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                    <div className="icon-clock text-base"></div>
                    <span className="font-medium">ETA: {ship.eta}</span>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-[var(--primary-color)] h-2 rounded-full transition-all" style={{ width: `${ship.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedShipment && (
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Shipment {selectedShipment.id}</h3>
                  <button onClick={optimizeRoute} className="btn-primary text-sm flex items-center gap-2">
                    <div className="icon-route text-lg"></div>
                    <span>Optimize Route</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-4 bg-gradient-to-br from-red-400 to-red-600 rounded-xl shadow-lg text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="icon-thermometer text-2xl"></div>
                      <span className="text-sm font-semibold">Temperature</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedShipment.temperature}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="icon-droplets text-2xl"></div>
                      <span className="text-sm font-semibold">Humidity</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedShipment.humidity}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="icon-map-pin text-2xl"></div>
                      <span className="text-sm font-semibold">Distance</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedShipment.distance}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="icon-clock text-2xl"></div>
                      <span className="text-sm font-semibold">ETA</span>
                    </div>
                    <p className="text-2xl font-bold">{selectedShipment.eta}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-[var(--bg-light)] rounded-lg">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Vehicle Number</p>
                    <p className="font-medium">{selectedShipment.vehicle}</p>
                  </div>
                  <div className="p-3 bg-[var(--bg-light)] rounded-lg">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Driver</p>
                    <p className="font-medium">{selectedShipment.driver}</p>
                  </div>
                  <div className="p-3 bg-[var(--bg-light)] rounded-lg">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Contact</p>
                    <p className="font-medium">{selectedShipment.driverPhone}</p>
                  </div>
                  <div className="p-3 bg-[var(--bg-light)] rounded-lg">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Current Location</p>
                    <p className="font-medium">{selectedShipment.currentLocation}</p>
                  </div>
                </div>
              </div>

              {selectedShipment.route.length > 0 && (
                <div className="card">
                  <h4 className="font-semibold mb-4">Route Timeline</h4>
                  <div className="relative pl-8">
                    {selectedShipment.route.map((stop, idx) => (
                      <div key={idx} className="mb-8 relative">
                        <div className={`absolute left-[-32px] w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${stop.status === 'completed' ? 'bg-green-500' :
                            stop.status === 'in-progress' ? 'bg-blue-500' :
                              'bg-gray-400'
                          }`}>
                          <div className={`icon-${stop.status === 'completed' ? 'check' :
                              stop.status === 'in-progress' ? 'truck' :
                                'circle'
                            } text-white text-xl`}></div>
                        </div>
                        {idx < selectedShipment.route.length - 1 && (
                          <div className="absolute left-[-26px] top-12 w-1 h-full bg-gray-300"></div>
                        )}
                        <div className="flex justify-between items-center bg-[var(--bg-light)] p-4 rounded-xl shadow-md">
                          <div>
                            <p className="font-bold text-lg text-[var(--text-primary)]">{stop.location}</p>
                            <p className="text-sm text-[var(--text-secondary)] font-medium">{stop.time}</p>
                          </div>
                          <span className={`px-3 py-1.5 text-sm font-bold rounded-lg capitalize ${stop.status === 'completed' ? 'bg-green-500 text-white' :
                              stop.status === 'in-progress' ? 'bg-blue-500 text-white' :
                                'bg-gray-400 text-white'
                            }`}>{stop.status.replace('-', ' ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedShipment.temperatureLog.length > 0 && (
                <div className="card">
                  <h4 className="font-semibold mb-4">Cold Chain Monitoring</h4>
                  <div className="space-y-2">
                    {selectedShipment.temperatureLog.map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[var(--bg-light)] rounded">
                        <span className="text-sm">{log.time}</span>
                        <span className="font-medium">{log.temp}°C</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="icon-check-circle text-lg text-green-600"></div>
                      <p className="text-sm">Temperature within safe range (15-20°C)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {showRouteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowRouteModal(false)}>
            <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-semibold mb-4">Route Optimization</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-[var(--bg-light)] rounded-lg text-center">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Estimated Distance</p>
                    <p className="text-2xl font-bold text-[var(--primary-color)]">342 km</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-light)] rounded-lg text-center">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Estimated Time</p>
                    <p className="text-2xl font-bold text-[var(--primary-color)]">5h 30m</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-light)] rounded-lg text-center">
                    <p className="text-xs text-[var(--text-secondary)] mb-1">Fuel Cost</p>
                    <p className="text-2xl font-bold text-[var(--primary-color)]">₹2,850</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
                  <h4 className="font-semibold mb-3">Optimized Route</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="icon-map-pin text-sm text-[var(--primary-color)]"></div>
                      <span className="flex-1">Wardha → Nagpur (NH44)</span>
                      <span className="text-sm text-[var(--text-secondary)]">95 km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="icon-map-pin text-sm text-[var(--primary-color)]"></div>
                      <span className="flex-1">Nagpur → Pune (NH65)</span>
                      <span className="text-sm text-[var(--text-secondary)]">185 km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="icon-map-pin text-sm text-[var(--primary-color)]"></div>
                      <span className="flex-1">Pune → Mumbai (NH48)</span>
                      <span className="text-sm text-[var(--text-secondary)]">62 km</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">This route avoids 2 toll plazas and saves approximately 30 minutes compared to alternative routes.</p>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowRouteModal(false)} className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)]">Close</button>
                <button onClick={() => { alert('Route applied!'); setShowRouteModal(false); }} className="flex-1 btn-primary">Apply Route</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('LogisticsTracker error:', error);
    return null;
  }
}