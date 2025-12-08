function OilPalmZoningMap() {
    try {
        const [activeLayer, setActiveLayer] = React.useState('suitability');
        const [selectedRegion, setSelectedRegion] = React.useState(null);
        const [isAnalyzing, setIsAnalyzing] = React.useState(false);

        // Dummy regions for simulation
        const regions = [
            { id: 1, name: 'Zone A (Wardha North)', potential: 'High', soil: 'Loamy', water: 'Available', color: 'bg-green-500', score: 92 },
            { id: 2, name: 'Zone B (Nagpur West)', potential: 'Medium', soil: 'Clay', water: 'Moderate', color: 'bg-yellow-500', score: 65 },
            { id: 3, name: 'Zone C (Amravati East)', potential: 'Low', soil: 'Sandy', water: 'Scarcity', color: 'bg-red-500', score: 34 },
            { id: 4, name: 'Zone D (Yavatmal Central)', potential: 'High', soil: 'Alluvial', water: 'Abundant', color: 'bg-green-600', score: 88 },
        ];

        const handleRegionClick = (region) => {
            setIsAnalyzing(true);
            setSelectedRegion(null);
            setTimeout(() => {
                setSelectedRegion(region);
                setIsAnalyzing(false);
            }, 800);
        };

        return (
            <div className="space-y-6 animate-fade-in" data-name="oil-palm-zoning-map" data-file="components/OilPalmZoningMap.js">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <img src="https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/images/bhuvan.png" alt="" className="h-6 opacity-80" onError={(e) => e.target.style.display = 'none'} />
                            <span>Oil Palm Potential Area Zoning</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Powered by ISRO Bhuvan Satellite Imagery & Geospatial Data
                        </p>
                    </div>
                    <div className="bg-blue-900 text-white px-3 py-1.5 rounded text-xs font-mono tracking-wide shadow-md">
                        SAT_FEED: LIVE | RES: 10m
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                    {/* Map Interface (Simulation) */}
                    <div className="lg:col-span-3 card p-0 overflow-hidden relative border-2 border-blue-900/10">
                        {/* Map Toolbar */}
                        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-sm rounded shadow-lg flex flex-col overflow-hidden border">
                            <button
                                onClick={() => setActiveLayer('suitability')}
                                className={`px-4 py-2 hover:bg-gray-100 border-b flex items-center gap-2 ${activeLayer === 'suitability' ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-700'}`}
                            >
                                <div className="icon-layers"></div> Suitability Index
                            </button>
                            <button
                                onClick={() => setActiveLayer('water')}
                                className={`px-4 py-2 hover:bg-gray-100 border-b flex items-center gap-2 ${activeLayer === 'water' ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-700'}`}
                            >
                                <div className="icon-droplet"></div> Water Table
                            </button>
                            <button
                                onClick={() => setActiveLayer('soil')}
                                className={`px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${activeLayer === 'soil' ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-700'}`}
                            >
                                <div className="icon-disc"></div> Soil Types
                            </button>
                        </div>

                        {/* Map Visual (CSS Graphic) */}
                        <div className="w-full h-full bg-[#cad2d3] relative group cursor-crosshair">
                            {/* Water Body */}
                            <div className="absolute top-10 right-20 w-32 h-32 bg-blue-300 rounded-full blur-xl opacity-60"></div>

                            {/* Grid Lines */}
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'linear-gradient(#00000005 1px, transparent 1px), linear-gradient(90deg, #00000005 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}></div>

                            {/* Zones */}
                            <div className="absolute inset-0 p-20 flex flex-wrap gap-8 justify-center items-center">
                                {regions.map((region) => (
                                    <div
                                        key={region.id}
                                        onClick={() => handleRegionClick(region)}
                                        className={`w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-lg border-4 border-white/50 opacity-80 hover:opacity-100 animate-pulse-slow
                                            ${activeLayer === 'suitability' ? region.color : 'bg-gray-400'}
                                        `}
                                    >
                                        <span className="text-white font-bold drop-shadow-md text-xs text-center px-2">{region.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Compass */}
                            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow">
                                <span className="font-bold text-gray-600 text-xs">N</span>
                            </div>
                        </div>

                        {/* Loading Overlay */}
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
                                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="font-mono text-sm">PROCESSING SATELLITE DATA...</p>
                                <p className="text-xs text-white/70">Source: IRS-P6 (Resourcesat-2)</p>
                            </div>
                        )}
                    </div>

                    {/* Analysis Panel */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <div className="card bg-blue-900 text-white p-4">
                            <h3 className="font-bold border-b border-blue-700 pb-2 mb-2 flex justify-between">
                                <span>Analysis Report</span>
                                <span className="font-mono text-xs opacity-70">ID: OP-2025</span>
                            </h3>

                            {!selectedRegion ? (
                                <div className="py-8 text-center text-blue-200 text-sm">
                                    <p>Select a zone on the map to view detailed feasibility report.</p>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <label className="text-xs text-blue-300 uppercase">Selected Zone</label>
                                        <p className="font-bold text-lg">{selectedRegion.name}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-800/50 p-2 rounded">
                                            <label className="text-xs text-blue-300">Suitability</label>
                                            <p className={`font-bold ${selectedRegion.potential === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {selectedRegion.potential}
                                            </p>
                                        </div>
                                        <div className="bg-blue-800/50 p-2 rounded">
                                            <label className="text-xs text-blue-300">Score</label>
                                            <p className="font-bold text-white">{selectedRegion.score}/100</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-blue-300 mb-1 block">Parameters</label>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between border-b border-blue-800 pb-1">
                                                <span>Soil Texture</span>
                                                <span className="font-mono">{selectedRegion.soil}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-blue-800 pb-1">
                                                <span>Water Access</span>
                                                <span className="font-mono">{selectedRegion.water}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Slope</span>
                                                <span className="font-mono">&lt; 15°</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-sm font-bold shadow-lg transition-colors mt-2">
                                        Download GIS Report
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="card flex-1">
                            <h4 className="font-semibold text-sm mb-3">Legend</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded text-xs text-center text-white font-bold">H</div>
                                    <span className="text-gray-600">High Potential (Recommended)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded text-xs text-center text-white font-bold">M</div>
                                    <span className="text-gray-600">Moderate (Needs Irrigation)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded text-xs text-center text-white font-bold">L</div>
                                    <span className="text-gray-600">Low (Not Suitable)</span>
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-4">
                                <p className="text-xs text-gray-500">
                                    <strong>Note:</strong> Data derived from ISRO Bhuvan (LULC 50k) and Groundwater Board datasets.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('OilPalmZoningMap error:', error);
        return null;
    }
}
