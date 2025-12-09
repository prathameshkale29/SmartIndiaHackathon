function IntercroppingSimulator() {
    try {
        const [mainCrop, setMainCrop] = React.useState('Oil Palm');
        const [interCrop, setInterCrop] = React.useState('');
        const [landArea, setLandArea] = React.useState(1); // Acres
        const [simulationResult, setSimulationResult] = React.useState(null);

        // Crop Data with economics
        const cropDatabase = {
            'Oil Palm': { type: 'main', spacing: '9m x 9m', maturity: '3-4 years', incomePerAcre: 150000, color: 'bg-emerald-700' },
            'Coconut': { type: 'main', spacing: '7.5m x 7.5m', maturity: '5-6 years', incomePerAcre: 120000, color: 'bg-green-600' },
            'Cocoa': { type: 'inter', compatibility: ['Oil Palm', 'Coconut'], incomePerAcre: 60000, duration: 'Perennial', color: 'bg-amber-700' },
            'Black Pepper': { type: 'inter', compatibility: ['Coconut'], incomePerAcre: 80000, duration: 'Perennial', color: 'bg-gray-800' },
            'Groundnut': { type: 'inter', compatibility: ['Oil Palm', 'Coconut'], incomePerAcre: 35000, duration: '4 months', color: 'bg-amber-400' },
            'Pulses (Red Gram)': { type: 'inter', compatibility: ['Oil Palm', 'Coconut'], incomePerAcre: 25000, duration: '6 months', color: 'bg-red-500' },
            'Turmeric': { type: 'inter', compatibility: ['Coconut'], incomePerAcre: 100000, duration: '9 months', color: 'bg-yellow-500' }
        };

        const mainCrops = Object.keys(cropDatabase).filter(c => cropDatabase[c].type === 'main');
        const interCrops = Object.keys(cropDatabase).filter(c => cropDatabase[c].type === 'inter');

        const handleSimulate = () => {
            if (!mainCrop || !interCrop) return;

            const main = cropDatabase[mainCrop];
            const inter = cropDatabase[interCrop];

            // Simple economic modeling
            // Assuming intercrop utilizes 30-40% of the space efficiently in early years
            const mainIncome = main.incomePerAcre * landArea;
            // Intercrop income factor (efficiency based on shade/space)
            const efficiency = 0.4;
            const interIncome = inter.incomePerAcre * landArea * efficiency;

            setSimulationResult({
                totalIncome: mainIncome + interIncome,
                extraIncome: interIncome,
                mainIncome: mainIncome,
                mainDetails: main,
                interDetails: inter
            });
        };

        const getRecommendation = () => {
            if (!interCrop || !mainCrop) return null;
            const allowed = cropDatabase[interCrop].compatibility.includes(mainCrop);
            if (allowed) return { status: 'Recommended', class: 'text-green-600 bg-green-100' };
            return { status: 'Not Recommended', class: 'text-red-600 bg-red-100' };
        };

        return (
            <div className="space-y-6" data-name="intercropping-simulator" data-file="components/IntercroppingSimulator.js">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Agri-Twin: Intercropping Simulator</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Visualize multi-layer cropping systems to maximize land utilization and income.</p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
                        <span className="mr-2">💡</span>
                        NMEO-OP Special Feature
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Configuration Panel */}
                    <div className="card lg:col-span-1 space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-2">Plan Your Farm</h3>

                        <div>
                            <label className="block text-sm font-medium mb-2">Primary Plantation Crop</label>
                            <div className="grid grid-cols-2 gap-3">
                                {mainCrops.map(crop => (
                                    <button
                                        key={crop}
                                        onClick={() => { setMainCrop(crop); setSimulationResult(null); }}
                                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${mainCrop === crop
                                                ? 'border-[var(--primary-color)] bg-green-50 text-[var(--primary-color)] ring-1 ring-[var(--primary-color)]'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {crop}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Select Intercrop</label>
                            <select
                                value={interCrop}
                                onChange={(e) => { setInterCrop(e.target.value); setSimulationResult(null); }}
                                className="w-full p-3 border rounded-xl bg-[var(--bg-white)] focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-shadow"
                            >
                                <option value="">-- Choose Compatible Crop --</option>
                                {interCrops.map(crop => (
                                    <option key={crop} value={crop}>
                                        {crop} ({cropDatabase[crop].compatibility.includes(mainCrop) ? 'Compatible' : 'Incompatible'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Land Area (Acres): {landArea}</label>
                            <input
                                type="range"
                                min="1" max="50" step="0.5"
                                value={landArea}
                                onChange={(e) => { setLandArea(Number(e.target.value)); setSimulationResult(null); }}
                                className="w-full accent-[var(--primary-color)]"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>1 Acre</span>
                                <span>50 Acres</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSimulate}
                            disabled={!interCrop}
                            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                        >
                            <div className="icon-cpu text-lg"></div>
                            Run Simulation
                        </button>
                    </div>

                    {/* Visualization & Results */}
                    <div className="card lg:col-span-2 min-h-[400px] flex flex-col">
                        {!simulationResult ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <div className="icon-layers text-2xl"></div>
                                </div>
                                <h4 className="text-lg font-medium text-gray-600">No Simulation Running</h4>
                                <p className="text-sm max-w-xs mt-2">Select crops and click "Run Simulation" to see projected income and layout.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                {/* Result Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Base Income</p>
                                        <p className="text-xl font-bold text-gray-700">₹{simulationResult.mainIncome.toLocaleString()}</p>
                                        <p className="text-xs text-gray-400 mt-1">From {mainCrop}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                        <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Extra Income</p>
                                        <p className="text-xl font-bold text-green-700">+₹{simulationResult.extraIncome.toLocaleString()}</p>
                                        <p className="text-xs text-green-500 mt-1">From {interCrop}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--primary-color)] to-emerald-800 text-white shadow-lg transform scale-105">
                                        <p className="text-xs text-white/80 uppercase tracking-wider">Total Projected</p>
                                        <p className="text-2xl font-bold">₹{simulationResult.totalIncome.toLocaleString()}</p>
                                        <p className="text-xs text-white/80 mt-1">Per Year (Est.)</p>
                                    </div>
                                </div>

                                {/* Visual Layout */}
                                <div>
                                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                                        <div className="icon-grid text-[var(--primary-color)]"></div>
                                        Field Layout Visualization (1 Acre Sample)
                                    </h4>
                                    <div className="bg-[#e4d5b7] p-6 rounded-xl border-4 border-[#d4c5a7] relative overflow-hidden h-64 shadow-inner">
                                        {/* Land Texture */}
                                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dirt.png')]"></div>

                                        {/* Rendering a pattern based on crop types */}
                                        <div className="grid grid-cols-6 gap-4 h-full relative z-10">
                                            {Array(18).fill(null).map((_, i) => (
                                                <div key={i} className="flex flex-col items-center justify-center">
                                                    {/* Main Crop Tree */}
                                                    <div className={`w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white text-xs font-bold z-20 relative ${cropDatabase[mainCrop].color}`}>
                                                        {mainCrop[0]}
                                                    </div>
                                                    <div className="w-1 h-8 bg-amber-900/40 -mt-2"></div>

                                                    {/* Intercrop in between rows - simplified viz */}
                                                    {interCrop && i % 2 !== 0 && (
                                                        <div className={`absolute bottom-2 w-12 h-6 rounded-full opacity-90 flex items-center justify-center text-[10px] text-white font-medium shadow-sm ${cropDatabase[interCrop].color}`}>
                                                            {interCrop.substring(0, 4)}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-2 flex w-full justify-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${cropDatabase[mainCrop].color}`}></div>
                                            <span>{mainCrop} (Main)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${cropDatabase[interCrop].color}`}></div>
                                            <span>{interCrop} (Intercrop)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Compatibility Alert */}
                                {(() => {
                                    const rec = getRecommendation();
                                    if (!rec) return null;
                                    return (
                                        <div className={`p-4 rounded-lg flex items-center gap-3 ${rec.class}`}>
                                            <div className={`text-xl ${rec.status === 'Recommended' ? 'icon-check-circle' : 'icon-x-circle'}`}></div>
                                            <div>
                                                <p className="font-bold">{rec.status} Combination</p>
                                                <p className="text-sm opacity-90">
                                                    {rec.status === 'Recommended'
                                                        ? `${interCrop} thrives well under the shade of ${mainCrop}, maximizing land use efficiency.`
                                                        : `${interCrop} competes for resources with ${mainCrop} and is not advised.`}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })()}

                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('IntercroppingSimulator error:', error);
        return null;
    }
}
