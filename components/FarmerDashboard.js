function FarmerDashboard({ setActivePage, user }) {
    const [showAddCropModal, setShowAddCropModal] = React.useState(false);
    const [showListProduceModal, setShowListProduceModal] = React.useState(false);
    const [showInputMarketModal, setShowInputMarketModal] = React.useState(false);

    // Fertilizer Market & Predictor State
    const [marketTab, setMarketTab] = React.useState('market'); // 'market' or 'predict'
    const [inputPrices, setInputPrices] = React.useState([]);
    const [selectedInputType, setSelectedInputType] = React.useState('Urea (Neem Coated)');

    // Prediction Form State
    const [predForm, setPredForm] = React.useState({ crop: 'Soybean', soil: 'Black Soil', stage: 'Sowing', acres: 5 });
    const [prediction, setPrediction] = React.useState(null);
    const [loadingPred, setLoadingPred] = React.useState(false);

    // ADVISORY & PROFILE STATE
    const [showProfileModal, setShowProfileModal] = React.useState(false);

    // COMPARISON TOOL STATE
    const [showCompareModal, setShowCompareModal] = React.useState(false);
    const [comparisonData, setComparisonData] = React.useState([]);
    const [calcArea, setCalcArea] = React.useState(1); // Default 1 Acre
    const [liveBids, setLiveBids] = React.useState([]); // Smart Bidding State

    // Fetch Live Bids
    // Fetch Live Bids (Polling for Real-time feel)
    React.useEffect(() => {
        const fetchBids = async () => {
            const data = await window.MockApiService.getLiveBids();
            setLiveBids(data);
        };
        fetchBids();
        const interval = setInterval(fetchBids, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, []);

    const handleBidAction = async (id, action) => {
        if (!window.MockApiService) return;

        // Optimistic update
        setLiveBids(prev => prev.filter(b => b.id !== id));

        try {
            await window.MockApiService.updateBidStatus(id, action);
            const toast = document.createElement('div');
            toast.className = `fixed bottom-4 right-4 ${action === 'accept' ? 'bg-green-600' : 'bg-red-600'} text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in z-50 font-bold flex items-center gap-2`;
            toast.innerHTML = action === 'accept'
                ? '<div class="icon-check-circle"></div> Bid Accepted! Buyer notified.'
                : '<div class="icon-x-circle"></div> Bid Rejected.';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } catch (e) {
            console.error("Bid action failed", e);
        }
    };

    // Fetch Comparison Data
    React.useEffect(() => {
        if (showCompareModal) {
            window.MockApiService.getCropComparisonData().then(data => {
                setComparisonData(data);
            });
        }
    }, [showCompareModal]);



    const [farmerProfile, setFarmerProfile] = React.useState({
        region: 'Vidarbha', district: 'Wardha', gpa: '', soil: 'Black Soil', organicCarbon: 'Medium', micronutrients: [], landSize: 5
    });
    const [oilseedRecs, setOilseedRecs] = React.useState([]);
    const [showAdvisoryResult, setShowAdvisoryResult] = React.useState(false);

    // Use Shared Data Context
    const {
        userCrops,
        produceListings,
        addCrop,
        addListing: listProduce,
        deleteListing,
        markListingSold
    } = useSharedData();

    const [weatherData, setWeatherData] = React.useState(null);
    const toast = useToast();
    const { addNotification } = useNotification();

    // Mock Weather Data for Widget
    React.useEffect(() => {
        // Simulate fetching local weather
        setWeatherData({
            temp: 28,
            condition: 'Sunny',
            humidity: 65,
            windSpeed: 12,
            location: 'Nagpur, MH' // Default fallback
        });
    }, []);

    // Load Input Prices when Modal Opens
    React.useEffect(() => {
        if (showInputMarketModal && window.MockApiService) {
            window.MockApiService.getInputPrices().then(data => setInputPrices(data));
        }
    }, [showInputMarketModal]);

    const handleAddCrop = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newCrop = {
            name: formData.get('cropName'),
            area: formData.get('landArea'),
            sowingDate: formData.get('sowingDate'),
            status: 'Healthy',
            days: 0
        };
        addCrop(newCrop);
        setShowAddCropModal(false);
        toast.success('New crop added successfully!');
        addNotification('Crop Added', `${newCrop.name} (${newCrop.area} acres) has been added to your farm`, 'success', 'home');
    };

    const handleListProduce = (newListing) => {
        listProduce(newListing);
        toast.success('Produce listed successfully!');
        addNotification('Produce Listed', `${newListing.quantity} quintals of ${newListing.crop} listed for sale at ₹${newListing.pricePerQuintal}/quintal`, 'success', 'home');
    };

    const handleDeleteListing = (id) => {
        deleteListing(id);
        toast.success('Listing deleted successfully');
    };

    const handleMarkSold = (id) => {
        markListingSold(id);
        toast.success('Listing marked as sold!');
        addNotification('Produce Sold', 'Congratulations! Your produce has been marked as sold', 'success', 'home');
    };

    const handleSellToFPO = async (crop) => {
        if (!window.confirm(`Sell ${crop.name} directly to FPO?`)) return;
        try {
            await window.MockApiService.sellToFPO(user?.name, {
                crop: crop.name,
                quantity: crop.area * 5, // Mock yield
                image: "https://via.placeholder.com/150"
            });
            toast.success("Offer sent to FPO Collection Center!");
            addNotification('FPO Offer Sent', `Your offer for ${crop.name} has been sent to FPO.`, 'info', 'procurement');
        } catch (e) {
            console.error(e);
            toast.error("Failed to send offer");
        }
    };

    // Prediction Handler
    const handlePredict = async () => {
        setLoadingPred(true);
        try {
            const res = await window.MockApiService.predictFertilizer(predForm);
            setPrediction(res);
            toast.success("AI Recommendation Generated! 🤖");
        } catch (e) {
            console.error(e);
            toast.error("Prediction failed");
        } finally {
            setLoadingPred(false);
        }
    };

    const totalCrops = userCrops.length;
    const totalLandArea = userCrops.reduce((acc, crop) => acc + Number(crop.area), 0);

    const stats = [
        { title: t('myCrops'), value: totalCrops.toString(), change: 0, icon: 'sprout', color: 'from-emerald-500 to-teal-500' },
        { title: t('landArea'), value: totalLandArea + ' ' + t('acres'), change: 5, icon: 'map', color: 'from-lime-500 to-green-500' },
        { title: t('avgPrice'), value: '₹5,600', change: 3.2, icon: 'indian-rupee', color: 'from-amber-500 to-yellow-500' },
        { title: t('pendingOrders'), value: '2', change: -20, icon: 'package', color: 'from-teal-500 to-cyan-500' }
    ];

    // Filter Logic for Input Market
    const filteredInputs = inputPrices.filter(item => item.product === selectedInputType);
    const bestPrice = filteredInputs.length > 0 ? Math.min(...filteredInputs.map(i => i.price)) : 0;

    return (
        <div className="animate-circular-reveal">
            {/* Hero Section */}
            {/* Hero Section - Compact Version */}
            {/* Hero Section - Mobile Optimized (Image Top, Content Below) */}
            {/* Hero Section - Universal Split Layout (Image Top, Content Below) */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800 transition-transform hover:scale-[1.01] duration-500 group">

                {/* Background Image - Full Block */}
                <img
                    src="hero_banner.png"
                    alt="AgriSync Hero"
                    className="w-full h-48 md:h-64 object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />

                {/* Content Container - Relative Block Below Image */}
                <div className="p-4 md:p-6 relative z-10 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                    <div className="text-gray-900 dark:text-white w-full md:w-auto">
                        <div className="flex items-center gap-3 mb-3 md:mb-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md border-2 border-[var(--accent-color)]">
                                <img src="agrisync-logo.jpg" alt="AgriSync Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-0">
                                    {t('appName')}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{t('tagline')}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-100 dark:border-gray-600 max-w-xl">
                            <p className="text-xs text-gray-700 dark:text-gray-200">
                                Welcome back, <span className="font-bold text-[var(--accent-color)]">{user?.name}</span>!
                                Track your crops & get AI advice.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <button onClick={() => setShowProfileModal(true)} className="flex-1 md:flex-none bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-0.5 border border-white/20 text-sm">
                            <div className="icon-sun text-lg"></div>
                            <span>Advisory</span>
                        </button>
                        <div className="flex gap-2 flex-1 md:flex-none">
                            <button onClick={() => setShowCompareModal(true)} className="flex-1 md:flex-none bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-0.5 border border-blue-200 text-sm">
                                <div className="icon-bar-chart text-lg"></div>
                                <span>Compare</span>
                            </button>
                            <button onClick={() => setShowAddCropModal(true)} className="flex-1 md:flex-none bg-[var(--accent-color)] text-black hover:bg-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-0.5 border border-transparent hover:border-[var(--accent-color)] text-sm">
                                <div className="icon-plus text-lg"></div>
                                <span>{t('addCrop')}</span>
                            </button>
                            <button onClick={() => setShowListProduceModal(true)} className="flex-1 md:flex-none bg-white text-gray-900 border border-gray-200 hover:bg-[var(--accent-color)] hover:text-black flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-0.5 text-sm">
                                <div className="icon-package text-lg"></div>
                                <span>Sell</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ModalDialog
                isOpen={showAddCropModal}
                onClose={() => setShowAddCropModal(false)}
                title="Add New Crop"
                footer={
                    <>
                        <button onClick={() => setShowAddCropModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" form="add-crop-form" className="btn-primary">Add Crop</button>
                    </>
                }
            >
                <form id="add-crop-form" onSubmit={handleAddCrop} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Crop Type</label>
                        <select name="cropName" required className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--bg-white)] text-[var(--text-primary)]">
                            <option value="">Select Crop</option>
                            <option value="Soybean">Soybean</option>
                            <option value="Mustard">Mustard</option>
                            <option value="Groundnut">Groundnut</option>
                            <option value="Sunflower">Sunflower</option>
                            <option value="Sesame">Sesame (Til)</option>
                            <option value="Castor">Castor Seed</option>
                            <option value="Linseed">Linseed (Flax)</option>
                            <option value="Safflower">Safflower (Kardai)</option>
                            <option value="Niger">Niger Seed</option>
                        </select>

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Land Area (Acres)</label>
                        <input name="landArea" type="number" step="0.1" required className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--bg-white)] text-[var(--text-primary)]" placeholder="e.g. 5.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Sowing Date</label>
                        <input name="sowingDate" type="date" required className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--bg-white)] text-[var(--text-primary)]" />
                    </div>
                </form>
            </ModalDialog>

            {/* NEW: FARMER PROFILE & ADVISORY MODAL */}
            <ModalDialog
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                title="🚜 Farmer Advisory Profile"
                size="lg"
            >
                {!showAdvisoryResult ? (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <p className="text-sm text-yellow-800">
                                Please complete your profile to get <b>personalized crop recommendations</b> and <b>price predictions</b>.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Region / District</label>
                                <select
                                    value={farmerProfile.district}
                                    onChange={(e) => setFarmerProfile({ ...farmerProfile, district: e.target.value })}
                                    className="w-full border rounded p-2"
                                >
                                    <option>Wardha</option>
                                    <option>Nagpur</option>
                                    <option>Latur</option>
                                    <option>Akola</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Gram Panchayat (GPA)</label>
                                <input
                                    type="text"
                                    placeholder="Enter Village/Area"
                                    value={farmerProfile.gpa}
                                    onChange={(e) => setFarmerProfile({ ...farmerProfile, gpa: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Soil Type</label>
                                <select
                                    value={farmerProfile.soil}
                                    onChange={(e) => setFarmerProfile({ ...farmerProfile, soil: e.target.value })}
                                    className="w-full border rounded p-2"
                                >
                                    <option>Black Soil (Cotton/Soybean)</option>
                                    <option>Red Soil</option>
                                    <option>Alluvial / Loamy</option>
                                    <option>Clay</option>
                                </select>

                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Organic Carbon (OC)</label>
                                <select
                                    value={farmerProfile.organicCarbon}
                                    onChange={(e) => setFarmerProfile({ ...farmerProfile, organicCarbon: e.target.value })}
                                    className="w-full border rounded p-2"
                                >
                                    <option>Low (&lt; 0.5%)</option>
                                    <option>Medium (0.5% - 0.75%)</option>
                                    <option>High (&gt; 0.75%)</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Micronutrient Deficiency (Select if tested Low)</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Zinc (Zn)', 'Iron (Fe)', 'Manganese (Mn)', 'Copper (Cu)', 'Potassium (K)'].map(micro => (
                                        <label key={micro} className="flex items-center gap-2 bg-gray-50 border px-3 py-1 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={farmerProfile.micronutrients.includes(micro)}
                                                onChange={(e) => {
                                                    const newMicros = e.target.checked
                                                        ? [...farmerProfile.micronutrients, micro]
                                                        : farmerProfile.micronutrients.filter(m => m !== micro);
                                                    setFarmerProfile({ ...farmerProfile, micronutrients: newMicros });
                                                }}
                                                className="rounded text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-sm">{micro}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Land Size (Acres)</label>
                                <input
                                    type="number"
                                    value={farmerProfile.landSize}
                                    onChange={(e) => setFarmerProfile({ ...farmerProfile, landSize: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Irrigation Source</label>
                                <select className="w-full border rounded p-2">
                                    <option>Rainfed</option>
                                    <option>Well / Borewell</option>
                                    <option>Canal</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={async () => {
                                    setLoadingPred(true);
                                    try {
                                        const recs = await window.MockApiService.recommendOilseeds({
                                            region: farmerProfile.district,
                                            soil: farmerProfile.soil,
                                            // New Parameters
                                            gpa: farmerProfile.gpa,
                                            organicCarbon: farmerProfile.organicCarbon,
                                            micronutrients: farmerProfile.micronutrients
                                        });
                                        // Fetch price predictions for each rec
                                        const recsWithPrice = await Promise.all(recs.map(async (r) => {
                                            const pricePred = await window.MockApiService.predictExpectedPrice(r.crop);
                                            return { ...r, ...pricePred };
                                        }));
                                        setOilseedRecs(recsWithPrice);
                                        setShowAdvisoryResult(true);
                                    } catch (e) {
                                        console.error(e);
                                        toast.error("Failed to generate advisory");
                                    } finally {
                                        setLoadingPred(false);
                                    }
                                }}
                                disabled={loadingPred}
                                className="btn-primary flex items-center gap-2"
                            >
                                {loadingPred ? <span className="animate-spin">↻</span> : <span className="icon-cpu"></span>}
                                Generate Advisory
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border-green-100 border">
                            <div>
                                <h3 className="font-bold text-green-800">✅ Recommended Crops for You</h3>
                                <p className="text-xs text-green-600">Based on {farmerProfile.soil} in {farmerProfile.district}</p>
                            </div>
                            <button onClick={() => setShowAdvisoryResult(false)} className="text-sm text-gray-500 underline">Modify Profile</button>
                        </div>

                        {/* NEW: Soil Health Insight Card */}
                        {(farmerProfile.organicCarbon === 'Low (< 0.5%)' || farmerProfile.micronutrients.length > 0) && (
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                    <span className="icon-alert-circle"></span> Soil Health Alerts
                                </h4>
                                <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                                    {farmerProfile.organicCarbon === 'Low (< 0.5%)' && (
                                        <li><b>Low Organic Carbon:</b> Recommended to apply Farm Yard Manure (FYM) @ 10 tons/acre before sowing.</li>
                                    )}
                                    {farmerProfile.micronutrients.includes('Zinc (Zn)') && (
                                        <li><b>Zinc Deficiency:</b> Apply Zinc Sulphate (25kg/acre) during basal dose.</li>
                                    )}
                                    {farmerProfile.micronutrients.includes('Iron (Fe)') && (
                                        <li><b>Iron Deficiency:</b> Spray Ferrous Sulphate (0.5%) if yellowing occurs.</li>
                                    )}
                                    {farmerProfile.micronutrients.includes('Potassium (K)') && (
                                        <li><b>Potassium Deficiency:</b> Apply MOP (Muriate of Potash) @ 20kg/acre.</li>
                                    )}
                                    {farmerProfile.micronutrients.map(m => {
                                        if (m === 'Zinc (Zn)' || m === 'Iron (Fe)' || m === 'Potassium (K)') return null; // Handled above
                                        return <li key={m}><b>{m.split(' ')[0]} Deficiency:</b> Consult local KVK for specific micronutrient mix.</li>
                                    })}
                                </ul>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto">
                            {oilseedRecs.map((rec, idx) => (
                                <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                    {rec.recommendation === 'Sell' ? (
                                        <div className="absolute top-0 right-0 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">High Risk / Sell Early</div>
                                    ) : (
                                        <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">Good to Grow (Hold)</div>
                                    )}

                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">{rec.crop}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${rec.suitability === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {rec.suitability} Suitability
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Exp. Price</p>
                                            <p className="text-lg font-bold text-[var(--primary-color)]">₹{rec.expected_price}/Q</p>
                                            <p className="text-[10px] text-gray-400">MSP: ₹{rec.current_msp}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm bg-gray-50 p-2 rounded">
                                        <div>
                                            <p className="text-xs text-gray-500">Potential Yield</p>
                                            <p className="font-semibold">{rec.potential_yield}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Est. Income</p>
                                            <p className="font-semibold text-green-700">
                                                ₹{(rec.expected_price * farmerProfile.landSize * parseFloat(rec.potential_yield)).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bidding Check / Price Trend Alert */}
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-xs font-bold text-gray-700">Price Prediction (3 Months)</p>
                                            <span className="text-[10px] text-gray-400">AI Confidence: 88%</span>
                                        </div>
                                        <div className="flex gap-1 h-12 items-end">
                                            {rec.future_trend.map((m, i) => (
                                                <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
                                                    <div
                                                        className="w-full bg-blue-200 hover:bg-blue-300 transition-all rounded-t-sm"
                                                        style={{ height: `${(m.price / (rec.expected_price * 1.2)) * 100}%` }}
                                                    ></div>
                                                    <span className="text-[9px] mt-1">{m.month}</span>
                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-[10px] p-1 rounded">₹{m.price}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-2 text-xs text-gray-600 italic">
                                            "{rec.reason}"
                                        </div>
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setShowAddCropModal(true);
                                                setShowProfileModal(false);
                                                // Pre-fill crop would need context/state passing, skipping for simplicity or can implement if needed
                                            }}
                                            className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-black transition"
                                        >
                                            Select & Plan Sowing
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
                }
            </ModalDialog >

            <ListProduceModal
                isOpen={showListProduceModal}
                onClose={() => setShowListProduceModal(false)}
                onAdd={handleListProduce}
            />

            {/* FERTILIZER / INPUT MARKET MODAL with PREDICTOR */}
            <ModalDialog
                isOpen={showInputMarketModal}
                onClose={() => setShowInputMarketModal(false)}
                title="Fertilizer Hub"
                size="lg"
                footer={<button onClick={() => setShowInputMarketModal(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Close</button>}
            >
                <div>
                    {/* Tabs */}
                    <div className="flex gap-4 border-b mb-4">
                        <button
                            onClick={() => setMarketTab('market')}
                            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${marketTab === 'market' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            🛒 Best Market Prices
                        </button>
                        <button
                            onClick={() => setMarketTab('predict')}
                            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${marketTab === 'predict' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            🤖 AI Predictor <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded-full">New</span>
                        </button>
                    </div>

                    {marketTab === 'market' ? (
                        <div className="space-y-4 animate-fade-in">
                            <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                                <div className="flex items-center gap-2">
                                    <div className="icon-search text-green-600"></div>
                                    <span className="font-semibold text-green-800">Find Best Prices</span>
                                </div>
                                <select
                                    value={selectedInputType}
                                    onChange={(e) => setSelectedInputType(e.target.value)}
                                    className="border-green-200 rounded-md px-3 py-1 text-sm bg-white focus:ring-green-500"
                                >
                                    <option>Urea (Neem Coated)</option>
                                    <option>DAP</option>
                                    <option>NPK 10:26:26</option>
                                    <option>MOP (Potash)</option>
                                </select>
                            </div>

                            <div className="overflow-hidden border rounded-lg">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3">Vendor</th>
                                            <th className="px-4 py-3">Product</th>
                                            <th className="px-4 py-3">Distance</th>
                                            <th className="px-4 py-3">Rating</th>
                                            <th className="px-4 py-3 text-right">Price</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {filteredInputs.map((item) => (
                                            <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${item.price === bestPrice ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                    {item.name}
                                                    {item.price === bestPrice && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">BEST PRICE</span>}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.product} <span className="text-xs text-gray-400">({item.unit})</span></td>
                                                <td className="px-4 py-3 text-gray-500">{item.dist}</td>
                                                <td className="px-4 py-3 text-amber-500">★ {item.rating}</td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">₹{item.price}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">
                                                        Order
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredInputs.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">Loading market data...</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-4">
                            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                                <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                                    <span className="icon-sliders"></span> Configure Prediction Filters
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase">Crop</label>
                                        <select
                                            value={predForm.crop}
                                            onChange={e => setPredForm({ ...predForm, crop: e.target.value })}
                                            className="w-full border rounded p-2 text-sm"
                                        >
                                            <option>Soybean</option>
                                            <option>Mustard</option>
                                            <option>Groundnut</option>
                                            <option>Cotton</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase">Soil Type</label>
                                        <select
                                            value={predForm.soil}
                                            onChange={e => setPredForm({ ...predForm, soil: e.target.value })}
                                            className="w-full border rounded p-2 text-sm"
                                        >
                                            <option>Black Soil (Regur)</option>
                                            <option>Red Soil</option>
                                            <option>Alluvial Soil</option>
                                            <option>Clay Loam</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase">Growth Stage</label>
                                        <select
                                            value={predForm.stage}
                                            onChange={e => setPredForm({ ...predForm, stage: e.target.value })}
                                            className="w-full border rounded p-2 text-sm"
                                        >
                                            <option>Sowing / Basal</option>
                                            <option>Vegetative</option>
                                            <option>Flowering</option>
                                            <option>Fruiting</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase">Farm Size (Acres)</label>
                                        <input
                                            type="number"
                                            value={predForm.acres}
                                            onChange={e => setPredForm({ ...predForm, acres: e.target.value })}
                                            className="w-full border rounded p-2 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handlePredict}
                                        disabled={loadingPred}
                                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-purple-700 transition flex items-center gap-2"
                                    >
                                        {loadingPred ? <span className="animate-spin">↻</span> : <span className="icon-cpu"></span>}
                                        Generate AI Plan
                                    </button>
                                </div>
                            </div>

                            {prediction && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="bg-gray-50 border-b p-3 flex justify-between items-center">
                                        <h4 className="font-bold">Recommended Dosage</h4>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                                            {prediction.confidence} Confidence
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm text-gray-500 mb-4 italic">"{prediction.note}"</p>
                                        <div className="space-y-3">
                                            {prediction.recommendation.map((rec, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{rec.product}</p>
                                                        <p className="text-xs text-gray-500">{rec.reason}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-xl text-purple-600">{rec.quantity} <span className="text-sm text-gray-500">{rec.unit}</span></p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-3 border-t text-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedInputType(prediction.recommendation[0].product);
                                                    setMarketTab('market');
                                                }}
                                                className="text-blue-600 font-medium hover:underline text-sm"
                                            >
                                                Check Prices for {prediction.recommendation[0].product} →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </ModalDialog>

            {/* Stats Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 shadow-sm text-white`}>
                            <div className={`icon-${stat.icon} text-lg`}></div>
                        </div>
                        <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-24 md:mb-10">
                <div className="xl:col-span-9 space-y-6">
                    {/* Key Actions Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div onClick={() => setActivePage('weather')} className="cursor-pointer bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-900 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div className="icon-cloud-sun text-2xl text-blue-600"></div>
                                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Today</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{weatherData?.temp}°C {weatherData?.condition}</h3>
                            <p className="text-xs text-gray-500">{weatherData?.location}</p>
                            <p className="text-xs text-blue-600 mt-2 font-medium">View Forecast →</p>
                        </div>

                        <div onClick={() => setActivePage('advisor')} className="cursor-pointer bg-purple-50 dark:bg-purple-900/10 rounded-xl p-6 border border-purple-100 dark:border-purple-900 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div className="icon-bot text-2xl text-purple-600"></div>
                                <span className="animate-pulse w-2 h-2 bg-purple-500 rounded-full"></span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">AI Advisor</h3>
                            <p className="text-xs text-gray-500">2 New recommendations for Soybean crop.</p>
                            <p className="text-xs text-purple-600 mt-2 font-medium">Ask Question →</p>
                        </div>

                        <div onClick={() => setActivePage('market')} className="cursor-pointer bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-100 dark:border-green-900 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div className="icon-trending-up text-2xl text-green-600"></div>
                                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Market Rates</h3>
                            <p className="text-xs text-gray-500">Prices up by 3.2% today.</p>
                            <p className="text-xs text-green-600 mt-2 font-medium">Check Prices →</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Live Auction removed as per request */}

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm h-full">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Crops Status</h3>
                                    <p className="text-xs text-gray-500">Live growth tracking</p>
                                </div>
                                <button onClick={() => setShowAddCropModal(true)} className="text-sm text-[var(--primary-color)] font-medium hover:underline flex items-center gap-1">
                                    <div className="icon-plus"></div> Add
                                </button>
                            </div>
                            <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[300px]">
                                {userCrops.length > 0 ? userCrops.map((crop, idx) => (
                                    <div key={idx} className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-[var(--secondary-color)] transition-colors border border-gray-100 dark:border-gray-600">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 bg-white rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm text-green-600">
                                                <div className="icon-sprout text-lg"></div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-[var(--primary-color)] transition-colors truncate">{crop.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{crop.area} {t('acres')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                                            <span className="inline-block px-2 py-1 bg-green-100/80 text-green-700 text-xs rounded-lg font-medium">
                                                {crop.status}
                                            </span>
                                            <button
                                                onClick={() => handleSellToFPO(crop)}
                                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                                            >
                                                Sell to FPO
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="icon-sprout text-3xl mb-2 opacity-50"></div>
                                        <p>No crops added yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Smart Bidding: Live Bids Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Live Bids 🔨</h3>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse">Live</span>
                        </div>
                        <div className="space-y-4">
                            {liveBids.length > 0 ? liveBids.map((bid) => {
                                const diff = bid.price - bid.expected;
                                const isGood = diff >= 0;
                                return (
                                    <div key={bid.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-white">{bid.buyer}</h4>
                                                <div className="text-xs text-gray-500 mt-0.5">{bid.time} • {bid.crop} ({bid.quantity})</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">₹{bid.price}</div>
                                                <div className="text-[10px] text-gray-500">per Qtl</div>
                                            </div>
                                        </div>

                                        {/* AI Price Check */}
                                        <div className={`text-xs p-2 rounded-lg mb-3 flex items-center gap-2 ${isGood ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-700'}`}>
                                            <div className={isGood ? "icon-check-circle" : "icon-alert-triangle"}></div>
                                            <span className="font-medium">
                                                {isGood
                                                    ? `Great Offer! ₹${diff} above expected.`
                                                    : `Warning: ₹${Math.abs(diff)} below expected value.`
                                                }
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button onClick={() => handleBidAction(bid.id, 'reject')} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 rounded-lg text-sm font-medium transition-colors">Reject</button>
                                            <button onClick={() => handleBidAction(bid.id, 'accept')} className={`flex-1 ${isGood ? 'bg-black hover:bg-gray-800' : 'bg-black hover:bg-gray-800'} text-white py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm`}>Accept Bid</button>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p className="text-center text-gray-500 text-sm py-4">No active bids at the moment.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Price Trends</h3>
                        <PriceChart />
                    </div>


                </div>

                {/* Right Sidebar Column - Quick Actions */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b pb-4">Quick Actions</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <button onClick={() => setActivePage('contracts')} title="View Contracts" className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 dark:hover:from-amber-800/30 dark:hover:to-orange-800/30 border border-amber-100 dark:border-amber-800 rounded-xl flex items-center justify-center hover:shadow-md hover:scale-105 transition-all group">
                                <div className="icon-file-text text-2xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform"></div>
                            </button>
                            <button onClick={() => setActivePage('market')} title="Market Prices" className="aspect-square bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 border border-emerald-100 dark:border-emerald-800 rounded-xl flex items-center justify-center hover:shadow-md hover:scale-105 transition-all group">
                                <div className="icon-trending-up text-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform"></div>
                            </button>
                            <button onClick={() => setActivePage('advisor')} title="AI Advisor" className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 border border-blue-100 dark:border-blue-800 rounded-xl flex items-center justify-center hover:shadow-md hover:scale-105 transition-all group">
                                <div className="icon-bot text-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"></div>
                            </button>
                            <button onClick={() => setShowInputMarketModal(true)} title="Input Market" className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 border border-purple-100 dark:border-purple-800 rounded-xl flex items-center justify-center hover:shadow-md hover:scale-105 transition-all group">
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">%</span>
                                <div className="icon-shopping-bag text-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"></div>
                            </button>
                        </div>
                        <div className="mt-6">
                            <h4 className="font-semibold text-sm mb-3">Recent Alerts</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2 text-xs p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-800 dark:text-yellow-200 border border-yellow-100 dark:border-yellow-800/50">
                                    <div className="icon-alert-triangle mt-0.5 text-yellow-600 dark:text-yellow-400"></div>
                                    <p>Heavy rain alert for next 2 days in your district.</p>
                                </div>
                                <div className="flex items-start gap-2 text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-200 border border-green-100 dark:border-green-800/50">
                                    <div className="icon-check-circle mt-0.5 text-green-600 dark:text-green-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Rates Card FPO/Logistics */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b pb-2">Service Rates 🏷️</h3>

                        {/* FPO Market Rates */}
                        <div className="mb-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">FPO Market Rates</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm p-2 bg-purple-50 rounded-lg border border-purple-100">
                                    <span className="text-purple-900">Avg FPO Premium</span>
                                    <span className="font-bold text-green-600">+2.5%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-gray-700">Mandi Tax</span>
                                    <span className="font-bold text-gray-900">1.5%</span>
                                </div>
                            </div>
                        </div>

                        {/* Logistics Rates */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Logistics (per km)</h4>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <div className="text-xl mb-1">🛺</div>
                                    <div className="text-xs font-bold text-yellow-800">₹18-22</div>
                                    <div className="text-[10px] text-yellow-600">Auto</div>
                                </div>
                                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="text-xl mb-1">🚛</div>
                                    <div className="text-xs font-bold text-blue-800">₹35-45</div>
                                    <div className="text-[10px] text-blue-600">Tempo</div>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="text-xl mb-1">🚚</div>
                                    <div className="text-xs font-bold text-gray-800">₹65-80</div>
                                    <div className="text-[10px] text-gray-600">Truck</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* COMPARISON TOOL MODAL */}
            <ModalDialog
                isOpen={showCompareModal}
                onClose={() => setShowCompareModal(false)}
                title="📊 Oilseed Comparison"
                size="lg"
            >
                <div>
                    <div className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100">
                        <div className="flex items-start gap-2 mb-3">
                            <div className="icon-calculator text-lg mt-0.5 text-blue-700"></div>
                            <p className="text-sm text-blue-900 font-medium">Income Calculator</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-blue-800 mb-1">Enter Your Land Area (Acres)</label>
                                <input
                                    type="number"
                                    value={calcArea}
                                    onChange={(e) => setCalcArea(Math.max(0.1, parseFloat(e.target.value) || 0))}
                                    className="w-full border border-blue-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-blue-700 italic mt-4">
                                    Calculating: Forecast Price × Avg Yield × {calcArea} Acres
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Crop Name</th>
                                    <th className="px-4 py-3">MSP (₹/Qtl)</th>
                                    <th className="px-4 py-3 bg-blue-50 text-blue-800">
                                        Forecast (Harvest)
                                        <div className="text-[9px] font-normal text-blue-600">Expected in 2-3 Months</div>
                                    </th>
                                    <th className="px-4 py-3">Yield</th>
                                    <th className="px-4 py-3 text-right text-green-700 bg-green-50">Est. Income (₹)</th>
                                    <th className="px-4 py-3">Logistics</th>
                                    <th className="px-4 py-3">Demand</th>
                                    <th className="px-4 py-3">Suitability</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {[...comparisonData]
                                    .sort((a, b) => ((b.expected_price || b.msp) * b.yield_avg) - ((a.expected_price || a.msp) * a.yield_avg))
                                    .map((row, idx) => {
                                        const priceToUse = row.expected_price || row.msp;
                                        const estIncome = Math.round(priceToUse * (row.yield_avg || 0) * calcArea);
                                        // Calculate Trend
                                        const diff = priceToUse - row.msp;
                                        const pct = ((diff / row.msp) * 100).toFixed(1);
                                        const isPositive = diff >= 0;

                                        // Calculate Logistics
                                        const totalYield = (row.yield_avg || 0) * calcArea;
                                        let vehicle = { type: 'Truck', icon: '🚚', color: 'bg-gray-100 text-gray-700', cap: '> 25 Qtls' };
                                        if (totalYield <= 5) vehicle = { type: 'Auto', icon: '🛺', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', cap: '< 5 Qtls' };
                                        else if (totalYield <= 25) vehicle = { type: 'Tempo', icon: '🚛', color: 'bg-blue-100 text-blue-800 border-blue-200', cap: '5-25 Qtls' };

                                        return (
                                            <tr key={idx} className={`hover:bg-gray-50 transition-colors ${idx === 0 ? 'bg-green-50/30' : ''}`}>
                                                <td className="px-4 py-3 font-semibold text-gray-900">
                                                    {row.crop}
                                                    {idx === 0 && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-200 px-1 rounded whitespace-nowrap">BEST RETURN</span>}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-700">₹{row.msp}</td>
                                                <td className="px-4 py-3 bg-blue-50">
                                                    <div className="font-bold text-blue-700">₹{priceToUse}</div>
                                                    <div className={`text-[10px] font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                                        {isPositive ? '▲' : '▼'} {Math.abs(pct)}% vs MSP
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{row.yield}</td>
                                                <td className="px-4 py-3 font-bold text-right text-green-700 bg-green-50">
                                                    ₹{estIncome.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs">
                                                        <div className="font-semibold text-gray-700">{totalYield.toFixed(1)} Qtls</div>
                                                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border mt-1 ${vehicle.color} text-[10px]`} title={`Capacity: ${vehicle.cap}`}>
                                                            <span>{vehicle.icon}</span> {vehicle.type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${row.demand.includes('High')
                                                        ? 'bg-green-100 text-green-700 border-green-200'
                                                        : row.demand === 'Moderate'
                                                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                        }`}>
                                                        {row.demand}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-500 italic max-w-[150px] truncate" title={row.suitability}>{row.suitability}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ModalDialog >

        </div >
    );
}
