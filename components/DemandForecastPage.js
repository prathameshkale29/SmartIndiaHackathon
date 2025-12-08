function DemandForecastPage() {
    return (
        <div className="animate-circular-reveal" data-name="demand-forecast-page">
            <h1 className="text-3xl font-bold mb-2">Demand & Sales Forecast</h1>
            <p className="text-[var(--text-secondary)] mb-6">AI-driven insights for smarter procurement</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Predicted Sales Trend (Next 30 Days)</h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[40, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 95].map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 rounded-t-sm relative group transition-all">
                                <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
                                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                    Day {i + 1}: {h * 10} Units
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-[var(--text-secondary)]">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/40 dark:to-indigo-900/40 border-purple-100">
                        <div className="icon-trending-up text-3xl text-purple-600 mb-2"></div>
                        <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">Expected Growth</p>
                        <h3 className="text-3xl font-bold text-purple-900 dark:text-white">+18.5%</h3>
                        <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">vs last month</p>
                    </div>
                    <div className="card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/40 border-amber-100">
                        <div className="icon-shopping-bag text-3xl text-amber-600 mb-2"></div>
                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Top Product</p>
                        <h3 className="text-xl font-bold text-amber-900 dark:text-white truncate" title="Refined Sunflower Oil">Sunflower Oil</h3>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">High demand forecasted</p>
                    </div>
                    <div className="col-span-1 sm:col-span-2 card">
                        <h3 className="font-semibold mb-3">AI Recommendations</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                                <div className="icon-alert-circle text-amber-500 mt-0.5"></div>
                                <p>Increase stock of <strong>Soybean Oil (1L)</strong> by 20% before festival season next week.</p>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <div className="icon-check-circle text-green-500 mt-0.5"></div>
                                <p>Current inventory of <strong>Mustard Oil</strong> is sufficient for projected demand.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 card">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Procurement Suggestions</h3>
                        <button className="text-sm text-[var(--primary-color)] hover:underline">Auto-Order Settings</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Refined Soybean Oil', format: '1L Pouch', current: '150 Units', suggest: '300 Units', deadline: '2 Days' },
                            { name: 'Groundnut Oil', format: '5L Can', current: '20 Units', suggest: '50 Units', deadline: '5 Days' },
                            { name: 'Sunflower Oil', format: '1L Bottle', current: '85 Units', suggest: '200 Units', deadline: '3 Days' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{item.format} • Current: {item.current}</p>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-[var(--primary-color)]">Order: {item.suggest}</p>
                                        <p className="text-xs text-red-500">By: {item.deadline}</p>
                                    </div>
                                    <button className="btn-primary py-1 px-3 text-sm">Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card bg-[var(--bg-light)]">
                    <h3 className="font-semibold mb-4">Market Insights</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-1">Price Trend</p>
                            <div className="flex items-center justify-between">
                                <span>Edible Oil Prices</span>
                                <span className="text-red-500 font-semibold text-sm">↑ 2.5%</span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Due to global supply constraints.</p>
                        </div>
                        <hr className="border-gray-200 dark:border-gray-700" />
                        <div>
                            <p className="text-xs text-[var(--text-secondary)] uppercase font-bold mb-1">Consumer Sentiment</p>
                            <div className="flex items-center justify-between">
                                <span>Preference Shift</span>
                                <span className="text-blue-500 font-semibold text-sm">Health Focus</span>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">Rising demand for cold-pressed oils.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
