function RouteOptimizer({ shipment }) {
  try {
    const [optimizing, setOptimizing] = React.useState(false);
    const [route, setRoute] = React.useState(null);

    const optimizeRoute = () => {
      setOptimizing(true);
      setTimeout(() => {
        const mockRoute = {
          distance: '342 km',
          duration: '5h 30m',
          fuelCost: '₹2,850',
          tollCost: '₹450',
          waypoints: [
            { location: 'Wardha', time: '09:00 AM' },
            { location: 'Nagpur', time: '11:30 AM' },
            { location: 'Pune', time: '03:00 PM' },
            { location: 'Mumbai', time: '06:30 PM' }
          ]
        };
        setRoute(mockRoute);
        setOptimizing(false);
      }, 2000);
    };

    return (
      <div className="card">
        <h3 className="font-semibold mb-4">Route Optimization</h3>
        {!route ? (
          <button onClick={optimizeRoute} disabled={optimizing} className="btn-primary w-full">
            {optimizing ? 'Optimizing...' : 'Optimize Route'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 bg-[var(--bg-light)] rounded">
                <p className="text-[var(--text-secondary)]">Distance</p>
                <p className="font-bold">{route.distance}</p>
              </div>
              <div className="p-2 bg-[var(--bg-light)] rounded">
                <p className="text-[var(--text-secondary)]">Duration</p>
                <p className="font-bold">{route.duration}</p>
              </div>
            </div>
            <div className="space-y-2">
              {route.waypoints.map((wp, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="icon-map-pin text-[var(--primary-color)]"></div>
                  <span className="flex-1">{wp.location}</span>
                  <span className="text-[var(--text-secondary)]">{wp.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('RouteOptimizer error:', error);
    return null;
  }
}