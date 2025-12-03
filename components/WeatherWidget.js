function WeatherWidget({ location }) {
  const [weatherData, setWeatherData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Default location if none provided
  const activeLocation = location || {
    name: 'Wardha, Maharashtra',
    latitude: 20.7453,
    longitude: 78.6022
  };

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current weather and alerts
        const currentRes = await fetch(`http://localhost:5000/api/weather/current?lat=${activeLocation.latitude}&lon=${activeLocation.longitude}&location=${encodeURIComponent(activeLocation.name)}`);

        if (!currentRes.ok) throw new Error('Weather API failed');

        const currentData = await currentRes.json();

        // Fetch forecast
        const forecastRes = await fetch(`http://localhost:5000/api/weather/forecast?lat=${activeLocation.latitude}&lon=${activeLocation.longitude}`);
        const forecastData = forecastRes.ok ? await forecastRes.json() : { data: { forecast: [] } };

        if (currentData.status === 'error') throw new Error(currentData.error);

        setWeatherData({
          current: currentData.data.current,
          alerts: currentData.data.alerts,
          forecast: forecastData.data?.forecast || []
        });

      } catch (err) {
        console.error('Weather load failed', err);
        setError('Using offline data');

        // Fallback mock data
        setWeatherData({
          current: {
            temp: 28,
            humidity: 65,
            wind_speed: 12,
            weather: [{ main: 'Clouds', description: 'Partly Cloudy' }]
          },
          alerts: [
            { severity: 'low', type: 'normal', message: 'No major weather risks - Normal field operations can continue', icon: '✅' }
          ],
          forecast: [
            { date: 'Tomorrow', temp_max: 32, temp_min: 24, rain_probability: 20, condition: 'Clouds' },
            { date: 'Day 3', temp_max: 31, temp_min: 23, rain_probability: 10, condition: 'Clear' },
            { date: 'Day 4', temp_max: 33, temp_min: 25, rain_probability: 0, condition: 'Clear' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [activeLocation.latitude, activeLocation.longitude, activeLocation.name]);

  if (loading) {
    return (
      <div className="card h-full flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-[var(--text-secondary)]">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const { current, alerts, forecast } = weatherData;

  return (
    <div className="card" data-name="weather-widget">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Weather & Advisory
            {error && <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Offline Mode</span>}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {activeLocation.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{Math.round(current.temp)}°C</p>
          <p className="text-xs text-[var(--text-secondary)] capitalize">
            {current.weather?.[0]?.description || 'Clear'}
          </p>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="space-y-2 mb-4">
        {alerts && alerts.map((alert, idx) => (
          <div key={idx} className={`p-3 rounded-lg border flex items-start gap-3 ${alert.severity === 'high' ? 'bg-red-50 border-red-200 text-red-800' :
              alert.severity === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                'bg-green-50 border-green-200 text-green-800'
            }`}>
            <span className="text-xl">{alert.icon}</span>
            <div>
              <p className="text-sm font-medium">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Current Details */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[var(--bg-light)] p-2 rounded-lg text-center">
          <p className="text-xs text-[var(--text-secondary)]">Humidity</p>
          <p className="font-semibold">{current.humidity}%</p>
        </div>
        <div className="bg-[var(--bg-light)] p-2 rounded-lg text-center">
          <p className="text-xs text-[var(--text-secondary)]">Wind</p>
          <p className="font-semibold">{current.wind_speed} km/h</p>
        </div>
        <div className="bg-[var(--bg-light)] p-2 rounded-lg text-center">
          <p className="text-xs text-[var(--text-secondary)]">Rain</p>
          <p className="font-semibold">{current.rain?.['1h'] || 0} mm</p>
        </div>
      </div>

      {/* Forecast */}
      <div className="border-t pt-3">
        <p className="text-xs font-semibold mb-2 text-[var(--text-secondary)]">Forecast</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {forecast.slice(0, 5).map((day, idx) => (
            <div key={idx} className="min-w-[70px] bg-[var(--bg-light)] p-2 rounded-lg text-center flex-shrink-0">
              <p className="text-[10px] font-medium mb-1">{new Date(day.date || Date.now() + (idx + 1) * 86400000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <p className="text-sm font-bold mb-1">{Math.round(day.temp_max)}°</p>
              <div className="text-[10px] text-[var(--text-secondary)] flex items-center justify-center gap-1">
                <span>💧</span> {day.rain_probability}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
