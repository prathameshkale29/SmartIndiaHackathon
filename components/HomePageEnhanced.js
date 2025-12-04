// Enhanced HomePage with Add Crop Modal
function HomePage({ setActivePage }) {
    const [user, setUser] = React.useState(getCurrentUser());
    const isAdmin = user?.role === 'admin';
    const [showAddCropModal, setShowAddCropModal] = React.useState(false);
    const toast = useToast();

    const adminStats = mockData.dashboardStats;
    const userStats = [
        { title: t('myCrops'), value: '3', change: 0, icon: 'sprout', color: 'from-emerald-500 to-teal-500' },
        { title: t('landArea'), value: '8.5 ' + t('acres'), change: 5, icon: 'map', color: 'from-lime-500 to-green-500' },
        { title: t('avgPrice'), value: '₹5,600', change: 3.2, icon: 'indian-rupee', color: 'from-amber-500 to-yellow-500' },
        { title: t('pendingOrders'), value: '2', change: -20, icon: 'package', color: 'from-teal-500 to-cyan-500' }
    ];

    const handleAddCrop = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const cropData = {
            crop: formData.get('crop'),
            area: formData.get('area'),
            sowingDate: formData.get('sowingDate')
        };

        toast.success(`Successfully added ${cropData.crop} crop (${cropData.area} acres)!`);
        setShowAddCropModal(false);
        e.target.reset();
    };

    return (
        <div className="animate-fade-in" data-name="home-page" data-file="app.js">
            {/* Add Crop Modal */}
            <ModalDialog
                isOpen={showAddCropModal}
                onClose={() => setShowAddCropModal(false)}
                title="Add New Crop"
                size="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddCropModal(false)}
                            className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="add-crop-form"
                            className="btn-primary"
                        >
                            <div className="flex items-center gap-2">
                                <div className="icon-plus"></div>
                                <span>Add Crop</span>
                            </div>
                        </button>
                    </>
                }
            >
                <form id="add-crop-form" onSubmit={handleAddCrop} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Crop Type *</label>
                        <select name="crop" required className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none">
                            <option value="">Select crop...</option>
                            <option value="Mustard">Mustard</option>
                            <option value="Soybean">Soybean</option>
                            <option value="Groundnut">Groundnut</option>
                            <option value="Sunflower">Sunflower</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Land Area (acres) *</label>
                        <input
                            type="number"
                            name="area"
                            required
                            min="0.1"
                            step="0.1"
                            placeholder="e.g., 5.5"
                            className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Sowing Date *</label>
                        <input
                            type="date"
                            name="sowingDate"
                            required
                            className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
                        />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-xs text-[var(--text-secondary)]">
                            <strong>Note:</strong> Your crop will be registered in the system and you'll receive AI-powered recommendations for optimal yield.
                        </p>
                    </div>
                </form>
            </ModalDialog>

            {/* Hero Section - Professional Header */}
            <div className="mb-12 pb-8 border-b border-[var(--border-color)]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
                            <div className="icon-leaf text-4xl text-white"></div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-1">
                                {t('appName')}
                            </h1>
                            <p className="text-base text-[var(--text-secondary)]">{t('tagline')}</p>
                        </div>
                    </div>
                    {!isAdmin && (
                        <button onClick={() => setShowAddCropModal(true)} className="btn-primary flex items-center gap-2 px-6 py-3">
                            <div className="icon-plus text-lg"></div>
                            <span>{t('addCrop')}</span>
                        </button>
                    )}
                </div>
                <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
                    <p className="text-sm text-[var(--text-secondary)]">
                        Welcome back, <span className="font-semibold text-emerald-700 dark:text-emerald-400">{user?.name}</span>!
                        {isAdmin ? ' Managing the complete oilseed value chain ecosystem.' : ' Track your crops and connect with the market.'}
                    </p>
                </div>
            </div>

            {/* Dashboard Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    {isAdmin ? 'System Overview' : 'Your Dashboard'}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                    {isAdmin ? 'Real-time analytics and system-wide metrics' : 'Monitor your farming operations and market opportunities'}
                </p>
            </div>

            {/* Stats Grid - Cleaner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {(isAdmin ? adminStats : userStats).map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <div className={`icon-${stat.icon} text-xl text-white`}></div>
                            </div>
                            {stat.change !== 0 && (
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {stat.change > 0 ? '+' : ''}{stat.change}%
                                </span>
                            )}
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Feature Cards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                        <div className="icon-satellite text-2xl text-blue-600 dark:text-blue-400"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Satellite Monitoring</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Real-time crop health analysis using satellite imagery</p>
                    <SatelliteWidget />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                        <div className="icon-trending-up text-2xl text-purple-600 dark:text-purple-400"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Performance Score</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Track your farming efficiency and productivity</p>
                    <PerformanceScore />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                        <div className="icon-brain text-2xl text-amber-600 dark:text-amber-400"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Predictions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Smart forecasting for better decision making</p>
                    <PredictiveAnalytics />
                </div>
            </div>

            {/* Market Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Live Market Auction</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Real-time bidding for oilseed contracts</p>
                        </div>
                    </div>
                    <LiveAuction />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button onClick={() => setActivePage('contracts')} className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center gap-3 border border-transparent hover:border-amber-200">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="icon-file-text text-lg text-amber-600 dark:text-amber-400"></div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">View Contracts</p>
                                <p className="text-xs text-gray-500">Browse available tenders</p>
                            </div>
                        </button>

                        <button onClick={() => setActivePage('market')} className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all flex items-center gap-3 border border-transparent hover:border-green-200">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="icon-trending-up text-lg text-green-600 dark:text-green-400"></div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">Market Prices</p>
                                <p className="text-xs text-gray-500">Check current rates</p>
                            </div>
                        </button>

                        <button onClick={() => setActivePage('advisor')} className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-3 border border-transparent hover:border-blue-200">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="icon-bot text-lg text-blue-600 dark:text-blue-400"></div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">AI Advisor</p>
                                <p className="text-xs text-gray-500">Get expert guidance</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            {isAdmin ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <PriceChart />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <DemandSupplyChart />
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Crops Status</h3>
                        <div className="space-y-3">
                            {mockData.userCrops.map((crop, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <div className="icon-sprout text-xl text-green-600 dark:text-green-400"></div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{crop.name}</p>
                                            <p className="text-sm text-gray-500">{crop.area} {t('acres')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">{crop.status}</p>
                                        <p className="text-sm text-gray-500">{crop.days} days</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <PriceChart />
                    </div>
                </div>
            )}
        </div>
    );
}
