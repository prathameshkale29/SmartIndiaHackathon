function FarmerDashboard({ setActivePage, user }) {
    const [showAddCropModal, setShowAddCropModal] = React.useState(false);
    const [showListProduceModal, setShowListProduceModal] = React.useState(false);

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

    const totalCrops = userCrops.length;
    const totalLandArea = userCrops.reduce((acc, crop) => acc + Number(crop.area), 0);

    const stats = [
        { title: t('myCrops'), value: totalCrops.toString(), change: 0, icon: 'sprout', color: 'from-emerald-500 to-teal-500' },
        { title: t('landArea'), value: totalLandArea + ' ' + t('acres'), change: 5, icon: 'map', color: 'from-lime-500 to-green-500' },
        { title: t('avgPrice'), value: '₹5,600', change: 3.2, icon: 'indian-rupee', color: 'from-amber-500 to-yellow-500' },
        { title: t('pendingOrders'), value: '2', change: -20, icon: 'package', color: 'from-teal-500 to-cyan-500' }
    ];

    return (
        <div className="animate-circular-reveal">
            {/* Hero Section */}
            <div className="mb-12 relative rounded-3xl overflow-hidden shadow-2xl min-h-[280px] flex items-end p-8 transition-transform hover:scale-[1.01] duration-500 group">
                <img src="hero_banner.png" alt="AgriSync Hero" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                <div className="relative z-10 w-full flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="text-white">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-[var(--accent-color)]">
                                <img src="agrisync-logo.jpg" alt="AgriSync Logo" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-white mb-0 drop-shadow-md">
                                    {t('appName')}
                                </h1>
                                <p className="text-gray-300 font-medium">{t('tagline')}</p>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 max-w-2xl">
                            <p className="text-sm text-gray-200">
                                Welcome back, <span className="font-bold text-[var(--accent-color)]">{user?.name}</span>!
                                Track your crops, get AI advice, and connect with the market.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setShowAddCropModal(true)} className="bg-[var(--accent-color)] text-black hover:bg-white flex items-center gap-2 px-6 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-[var(--accent-color)] group/btn">
                            <div className="icon-plus text-xl group-hover/btn:rotate-90 transition-transform"></div>
                            <span>{t('addCrop')}</span>
                        </button>
                        <button onClick={() => setShowListProduceModal(true)} className="bg-white text-gray-900 hover:bg-[var(--accent-color)] hover:text-black flex items-center gap-2 px-6 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1 border-2 border-white group/btn">
                            <div className="icon-package text-xl"></div>
                            <span>List Produce</span>
                        </button>
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

            <ListProduceModal
                isOpen={showListProduceModal}
                onClose={() => setShowListProduceModal(false)}
                onAdd={handleListProduce}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <div className={`icon-${stat.icon} text-xl text-white`}></div>
                            </div>
                            {stat.change !== 0 && (
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {stat.change > 0 ? '+' : ''}{stat.change}%
                                </span>
                            )}
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-10">
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm h-full">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Live Market Auction</h3>
                                    <p className="text-xs text-gray-500">Real-time bidding</p>
                                </div>
                                <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                            <LiveAuction />
                        </div>

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
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-green-600">
                                                <div className="icon-sprout text-lg"></div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-[var(--primary-color)] transition-colors">{crop.name}</p>
                                                <p className="text-xs text-gray-500">{crop.area} {t('acres')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-2 py-1 bg-green-100/80 text-green-700 text-xs rounded-lg font-medium mb-1">
                                                {crop.status}
                                            </span>
                                            <p className="text-xs text-gray-400">{crop.days} days</p>
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
                            <button onClick={() => setActivePage('traceability')} title="Supply Chain" className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 border border-purple-100 dark:border-purple-800 rounded-xl flex items-center justify-center hover:shadow-md hover:scale-105 transition-all group">
                                <div className="icon-truck text-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"></div>
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
                                    <p>Soil test report is ready.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
