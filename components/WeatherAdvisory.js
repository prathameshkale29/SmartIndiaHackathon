function WeatherAdvisory() {
    const [districtData, setDistrictData] = React.useState(null);
    const [selectedState, setSelectedState] = React.useState('');
    const [selectedDistrict, setSelectedDistrict] = React.useState('');
    const [selectedCrop, setSelectedCrop] = React.useState('Soybean');

    const [weatherData, setWeatherData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [geoLoading, setGeoLoading] = React.useState(false);

    // Full list of Indian Oilseeds
    const oilseedCrops = [
        'Mustard', 'Soybean', 'Groundnut', 'Sunflower', 'Sesame',
        'Safflower', 'Niger Seed', 'Castor', 'Linseed', 'Oil Palm', 'Coconut', 'Rapeseed'
    ];

    // Cache for geocoding
    const geoCache = React.useRef({});

    // Fetch Districts Data on Mount
    React.useEffect(() => {
        const loadDistricts = async () => {
            try {
                const response = await fetch("https://raw.githubusercontent.com/iaseth/data-for-india/master/data/readable/districts.json");
                if (!response.ok) throw new Error("Failed to load districts");
                const json = await response.json();
                const list = json.districts || json;
                setDistrictData(list);

                // Set default
                const defaultState = "Maharashtra";
                if (list.some(d => d.state === defaultState)) {
                    setSelectedState(defaultState);
                    const dists = list.filter(d => d.state === defaultState);
                    if (dists.length > 0) setSelectedDistrict(dists[0].district);
                } else {
                    setSelectedState(list[0].state);
                    setSelectedDistrict(list[0].district);
                }
            } catch (e) {
                console.error("Error loading districts:", e);
                setError("Unable to load state/district list.");
            }
        };
        loadDistricts();
    }, []);

    const fetchWeatherData = async (lat, lon) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`
            );
            if (!response.ok) throw new Error('Failed to fetch weather data');
            const data = await response.json();
            setWeatherData(data);
        } catch (err) {
            console.error(err);
            setError('Unable to fetch weather data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const getCoordinates = async (state, district) => {
        const key = `${state}-${district}`;
        if (geoCache.current[key]) return geoCache.current[key];

        setGeoLoading(true);
        try {
            const q = encodeURIComponent(`${district}, ${state}, India`);
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data && data.length > 0) {
                const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
                geoCache.current[key] = coords;
                return coords;
            }
            throw new Error("Location not found");
        } catch (e) {
            console.error("Geocoding failed:", e);
            // Fallback to center of India
            return { lat: 20.5937, lon: 78.9629 };
        } finally {
            setGeoLoading(false);
        }
    };

    // Update Weather when location changes
    React.useEffect(() => {
        const updateWeather = async () => {
            if (selectedState && selectedDistrict) {
                // Add a small delay
                const timer = setTimeout(async () => {
                    const coords = await getCoordinates(selectedState, selectedDistrict);
                    if (coords) {
                        fetchWeatherData(coords.lat, coords.lon);
                    }
                }, 500);
                return () => clearTimeout(timer);
            }
        };
        updateWeather();
    }, [selectedState, selectedDistrict]);

    const getWeatherDescription = (code) => {
        if (code === 0) return 'Clear sky';
        if (code === 1) return 'Mainly clear';
        if (code === 2) return 'Partly cloudy';
        if (code === 3) return 'Overcast';
        if (code === 45 || code === 48) return 'Fog';
        if (code >= 51 && code <= 55) return 'Drizzle';
        if (code >= 61 && code <= 65) return 'Rain';
        if (code >= 71 && code <= 77) return 'Snow';
        if (code >= 80 && code <= 82) return 'Rain showers';
        if (code >= 95) return 'Thunderstorm';
        return 'Unknown';
    };

    const getAdvisory = (current, forecast, crop) => {
        if (!current) return { type: 'neutral', text: 'Loading advisory...' };

        const rain = current.rain;
        const wind = current.wind_speed_10m;
        const temp = current.temperature_2m;
        const humidity = current.relative_humidity_2m;

        const items = [];
        let status = 'normal';

        // 1. REAL-TIME Weather Alerts (More sensitive thresholds)
        if (rain > 5) {
            items.push(`Continuous rain (${rain}mm) detected. Pause all sowing and spraying activities.`);
            status = 'warning';
        } else if (rain > 0.5) {
            items.push(`Light rain (${rain}mm) currently falling. Ensure drainage in low-lying fields.`);
        } else if (humidity > 85 && temp < 25) {
            items.push(`High humidity (${humidity}%) with moderate temps. Ideal condition for fungal growth. Monitor crop closely.`);
        } else if (humidity < 30 && temp > 35) {
            items.push(`Dry heat alert (Humidity: ${humidity}%, Temp: ${temp}°C). crop may suffer moisture stress. Irrigate immediately.`);
            status = 'warning';
        }

        if (wind > 20) {
            items.push(`Strong winds (${wind} km/h) detected. Risk of lodging for tall crops. Provide mechanical support if possible.`);
            status = 'warning';
        } else if (wind > 12) {
            items.push(`Moderate breeze (${wind} km/h). Avoid spraying pesticides as drift may occur.`);
        }

        if (temp > 38) {
            items.push(`Heatwave conditions (${temp}°C). Apply light frequent irrigation (mulching recommended).`);
            status = 'warning';
        } else if (temp < 12) {
            items.push(`Low temperature alert (${temp}°C). Smoke/irrigate field in early morning to prevent frost damage.`);
        }

        // 2. Crop Specific Agronomic Rules
        const lowerCrop = crop.toLowerCase();

        // ---------------- SOYBEAN ----------------
        if (lowerCrop.includes('soybean')) {
            if (humidity > 80) items.push('High humidity poses risk of Rust and Leaf Spot. Check for lesions on leaves.');
            if (rain < 1 && temp > 30) items.push('Pod-filling stage is critical. Ensure soil moisture is adequate.');
            if (wind > 15) items.push('Lodging risk for mature pods due to wind.');
        }
        // ---------------- GROUNDNUT ----------------
        else if (lowerCrop.includes('groundnut')) {
            if (rain > 2) items.push('Soil moisture is high. Avoid harvesting to prevent aflatoxin contamination / pod sprouting.');
            if (temp > 32 && humidity < 50) items.push('Heat stress may affect pegging. Light irrigation recommended.');
            if (humidity > 90) items.push('Leaf spot (Tikka disease) risk is high. Spray fungicide if spots appear.');
        }
        // ---------------- MUSTARD ----------------
        else if (lowerCrop.includes('mustard')) {
            if (humidity > 75 && temp < 20) items.push('Cool and humid weather favors Aphids and White Rust. Inspect undersides of leaves.');
            if (temp < 5) items.push('Critical Frost Alert! Irrigate this evening to save pods from freezing.');
            if (temp > 30) items.push('High temperature may force early maturity and shrivelled seeds.');
        }
        // ---------------- SUNFLOWER ----------------
        else if (lowerCrop.includes('sunflower')) {
            if (humidity > 80 && rain > 0) items.push('Head Rot risk is severe in wet weather. Ensure water does not stagnate near heads.');
            if (wind > 15) items.push('Tall crop prone to lodging. Avoid top-heavy nitrogen application.');
            if (temp > 35) items.push('High heat during flowering triggers pollen sterility. Irrigate frequently.');
        }
        // ---------------- SESAME (Til) ----------------
        else if (lowerCrop.includes('sesame')) {
            if (temp < 15) items.push('Sesame is sensitive to cold. Growth may be stunted at current low temps.');
            if (rain > 5) items.push('Waterlogging is fatal for Sesame (Phytophthora blight risk). Drain field immediately.');
            if (humidity > 85) items.push('High humidity favors Phyllody and Leaf Spot. Keep field clean of weeds.');
        }
        // ---------------- SAFFLOWER ----------------
        else if (lowerCrop.includes('safflower')) {
            if (humidity > 80) items.push('Aphid infestation is likely in cloudy/humid weather. Monitor shoot tips.');
            if (rain > 10) items.push('Excess moisture leads to root rot. Safflower is drought tolerant but flood sensitive.');
        }
        // ---------------- NIGER SEED ----------------
        else if (lowerCrop.includes('niger')) {
            if (wind > 20) items.push('Plant is delicate. High wind can cause breakage. Delay inter-culture operations.');
            if (humidity > 90) items.push('Powdery mildew risk. Ensure good air circulation in field.');
        }
        // ---------------- CASTOR ----------------
        else if (lowerCrop.includes('castor')) {
            if (humidity > 90 && temp < 25) items.push('Ideal conditions for Botrytis Gray Rot (Gray Mold). Avoid overhead irrigation.');
            if (wind > 25) items.push('Heavy winds can uproot tall castor plants. Earthing up is recommended.');
            if (temp > 38) items.push('Sex expression may be affected by extreme heat (more male flowers).');
        }
        // ---------------- LINSEED ----------------
        else if (lowerCrop.includes('linseed')) {
            if (humidity > 85) items.push('Powdery Mildew and Rust are favored by current humid conditions.');
            if (temp > 32) items.push('High heat during seed setting causes shrivelling. Provide light irrigation.');
            if (rain > 5 && humidity > 80) items.push('Alternaria blight risk is high.');
        }
        // ---------------- OIL PALM ----------------
        else if (lowerCrop.includes('palm')) {
            if (temp < 18) items.push('Low temperature hampers productivity. Growth slows down markedly.');
            if (rain < 2 && temp > 32) items.push('High water requirement crop. Ensure adequate irrigation as rainfall is low currently.');
            if (wind > 30) items.push('Frond breakage risk. Inspect older fronds.');
        }
        // ---------------- COCONUT ----------------
        else if (lowerCrop.includes('coconut')) {
            if (temp > 35) items.push('Button shedding may increase due to heat. Mulch the basins.');
            if (rain > 15) items.push('Mahali (Fruit Rot) risk in Arecanut/Coconut. Spray Bordeaux mixture if rain persists.');
            if (humidity > 90) items.push('Bud Rot incidence increases in high humidity.');
        }
        // ---------------- RAPESEED ----------------
        else if (lowerCrop.includes('rapeseed')) {
            if (temp > 27) items.push('Sensitive to heat at flowering. High temp causes flower abortion.');
            if (humidity > 80) items.push('Alternaria blight and Aphids are major threats in this weather.');
        }

        // Default 'Good' message only if list is empty
        if (items.length === 0) {
            items.push(`Current weather (Temp: ${temp}°C, Humidity: ${humidity}%) is generally favorable for ${crop}. Standard agronomic practices apply.`);
        }

        return {
            status,
            text: items.join(' '),
            items
        };
    };

    const advisory = weatherData ? getAdvisory(weatherData.current, weatherData.daily, selectedCrop) : null;

    const statesList = districtData ? [...new Set(districtData.map(d => d.state))].sort() : [];
    const districtsList = (districtData && selectedState)
        ? districtData.filter(d => d.state === selectedState).map(d => d.district).sort()
        : [];

    return (
        <div className="space-y-6" data-name="weather-advisory">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#14532D]">Weather & Oilseed Advisory</h2>
                    <p className="text-sm text-gray-500">Real-time forecast and crop-specific guidance</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold border border-green-200">
                    Govt. Data Integration
                </div>
            </div>

            {/* Controls */}
            <div className="card bg-white p-4">
                {districtData ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <select
                                value={selectedState}
                                onChange={(e) => {
                                    const newState = e.target.value;
                                    setSelectedState(newState);
                                    const dists = districtData.filter(d => d.state === newState);
                                    if (dists.length > 0) setSelectedDistrict(dists[0].district);
                                }}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                            >
                                {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
                            >
                                {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Crop</label>
                            <select
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500 font-semibold"
                            >
                                {oilseedCrops.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">Loading location data...</p>
                )}
            </div>

            {/* Loading/Error States */}
            {(loading || geoLoading) && (
                <div className="card p-8 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-gray-500">{geoLoading ? 'Locating District...' : 'Fetching Forecast...'}</p>
                </div>
            )}

            {error && (
                <div className="card p-4 bg-red-50 border-red-200 text-red-700">
                    {error}
                </div>
            )}

            {/* Weather Display */}
            {!loading && !geoLoading && !error && weatherData && (
                <div className="space-y-6">
                    {/* Main Weather Card */}
                    <div className="card border-2 border-[var(--border-color)]">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="icon-map-pin"></span> {selectedDistrict}, {selectedState}
                                </h3>
                                <p className="text-sm text-gray-500">{new Date().toDateString()}</p>
                            </div>
                            <div className="text-right mt-2 md:mt-0">
                                <p className="text-4xl font-bold text-[var(--primary-color)]">{weatherData.current.temperature_2m}{weatherData.current_units.temperature_2m}</p>
                                <p className="font-medium">{getWeatherDescription(weatherData.current.weather_code)}</p>
                            </div>
                        </div>

                        {/* Advisory Banner */}
                        <div className={`p-4 rounded-lg mb-6 flex items-start gap-4 ${advisory.status === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
                            <div className={`mt-1 p-2 rounded-full ${advisory.status === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                <div className={advisory.status === 'warning' ? 'icon-alert-triangle text-xl' : 'icon-check-circle text-xl'}></div>
                            </div>
                            <div>
                                <h4 className={`font-bold mb-1 ${advisory.status === 'warning' ? 'text-amber-800' : 'text-green-800'}`}>
                                    Advisory for {selectedCrop}
                                </h4>
                                {advisory.items.map((item, idx) => (
                                    <p key={idx} className="font-medium text-sm text-gray-700 mb-1 last:mb-0">
                                        • {item}
                                    </p>
                                ))}
                                <p className="text-[10px] text-gray-400 mt-2 italic">Source: National Agromet Advisory Service (Simulated)</p>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-[var(--bg-light)] p-3 rounded-lg text-center">
                                <p className="text-xs text-gray-500">Humidity</p>
                                <p className="font-bold text-lg">{weatherData.current.relative_humidity_2m}%</p>
                            </div>
                            <div className="bg-[var(--bg-light)] p-3 rounded-lg text-center">
                                <p className="text-xs text-gray-500">Wind</p>
                                <p className="font-bold text-lg">{weatherData.current.wind_speed_10m} km/h</p>
                            </div>
                            <div className="bg-[var(--bg-light)] p-3 rounded-lg text-center">
                                <p className="text-xs text-gray-500">Rain</p>
                                <p className="font-bold text-lg">{weatherData.current.rain} mm</p>
                            </div>
                            <div className="bg-[var(--bg-light)] p-3 rounded-lg text-center">
                                <p className="text-xs text-gray-500">Feels Like</p>
                                <p className="font-bold text-lg">{weatherData.current.apparent_temperature}°C</p>
                            </div>
                        </div>

                        {/* Forecast Row */}
                        <div>
                            <h4 className="font-semibold mb-3 text-sm text-gray-600">5-Day Forecast</h4>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                {weatherData.daily.time.slice(0, 5).map((date, idx) => (
                                    <div key={idx} className="bg-white border p-2 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">
                                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </p>
                                        <div className="my-1 text-2xl">
                                            {weatherData.daily.precipitation_probability_max[idx] > 50 ? '🌧️' : '☀️'}
                                        </div>
                                        <p className="text-lg font-bold mb-1">{Math.round(weatherData.daily.temperature_2m_max[idx])}°</p>
                                        <div className="text-xs text-blue-600 flex justify-center items-center gap-1">
                                            <span className="icon-droplet text-[10px]"></span> {weatherData.daily.precipitation_probability_max[idx]}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
