function SatelliteWidget({ location, crop }) {
    const [satelliteData, setSatelliteData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Default location if none provided
    const activeLocation = location || {
        name: 'Wardha, Maharashtra',
        latitude: 20.7453,
        longitude: 78.6022
    };

    React.useEffect(() => {
        const fetchSatelliteData = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = `/api/satellite/crop-health?lat=${activeLocation.latitude}&lon=${activeLocation.longitude}&crop=${crop || 'mustard'}&location=${encodeURIComponent(activeLocation.name)}`;

                const response = await fetch(url);

                if (!response.ok) throw new Error('Satellite API failed');

                const result = await response.json();

                if (result.status === 'error') throw new Error(result.error);

                setSatelliteData(result.data);

            } catch (err) {
                console.error('Satellite load failed', err);
                setError('Using offline demo data');

                // Fallback demo data
                setSatelliteData({
                    ndvi: 0.72,
                    health_score: 86,
                    status: 'healthy',
                    optimal_ndvi: 0.7,
                    deviation: 0.02,
                    recommendations: [
                        'Crop health is excellent - maintain current practices',
                        'Continue regular monitoring'
                    ],
                    alerts: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSatelliteData();
    }, [activeLocation.latitude, activeLocation.longitude, crop]);

    if (loading) {
        return (
            <div className="card h-full flex items-center justify-center min-h-[200px]">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-[var(--text-secondary)]">Analyzing satellite imagery...</p>
                </div>
            </div>
        );
    }

    if (!satelliteData) return null;

    const { ndvi, health_score, status, recommendations, alerts } = satelliteData;

    // Determine color based on health score
    const healthColor = health_score > 80 ? 'text-green-600' : (health_score > 60 ? 'text-amber-600' : 'text-red-600');
    const healthBg = health_score > 80 ? 'bg-green-100' : (health_score > 60 ? 'bg-amber-100' : 'bg-red-100');
    const progressBarColor = health_score > 80 ? 'bg-green-500' : (health_score > 60 ? 'bg-amber-500' : 'bg-red-500');

    return (
        <div className="card" data-name="satellite-widget">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        Satellite Crop Health
                        {error && <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Demo Mode</span>}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Sentinel-2 Imagery Analysis
                    </p>
                </div>
                <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${healthBg} ${healthColor} inline-block`}>
                        Score: {health_score}/100
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * health_score) / 100}
                            className={healthColor}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-bold">NDVI</span>
                        <span className={`text-sm font-semibold ${healthColor}`}>{ndvi}</span>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--text-secondary)]">Vegetation Status</span>
                        <span className={`font-medium capitalize ${healthColor}`}>{status}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className={`h-2 rounded-full ${progressBarColor}`} style={{ width: `${health_score}%` }}></div>
                    </div>

                    <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                        <span>Stressed</span>
                        <span>Moderate</span>
                        <span>Healthy</span>
                    </div>
                </div>
            </div>

            {alerts && alerts.length > 0 && (
                <div className="mb-4 space-y-2">
                    {alerts.map((alert, idx) => (
                        <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-start">
                            <span className="text-red-600">⚠️</span>
                            <p className="text-sm text-red-800">{alert.message}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-[var(--bg-light)] p-3 rounded-lg">
                <p className="text-xs font-semibold mb-2 text-[var(--text-secondary)]">AI Recommendations</p>
                <ul className="space-y-1">
                    {recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
