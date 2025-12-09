function DemandForecastPage() {
    const chartRef = React.useRef(null);
    const [chartInstance, setChartInstance] = React.useState(null);

    React.useEffect(() => {
        if (chartRef.current) {
            if (chartInstance) chartInstance.destroy();

            const ctx = chartRef.current.getContext('2d');
            const newChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Projected Demand (MT)',
                        data: [120, 135, 125, 145, 160, 150, 170, 185, 175, 195, 210, 230],
                        borderColor: '#16A34A',
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#16A34A',
                        pointHoverBackgroundColor: '#16A34A',
                        pointHoverBorderColor: '#ffffff'
                    },
                    {
                        label: 'Historical Average',
                        data: [110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165],
                        borderColor: '#9CA3AF',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0.4,
                        fill: false,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: { usePointStyle: true, boxWidth: 8 }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            titleColor: '#1f2937',
                            bodyColor: '#4b5563',
                            borderColor: '#e5e7eb',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: { display: true, color: 'rgba(0,0,0,0.05)' }
                        },
                        x: {
                            grid: { display: false }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
            setChartInstance(newChart);

            return () => {
                if (newChart) newChart.destroy();
            };
        }
    }, []);

    return (
        <div className="animate-circular-reveal" data-name="demand-forecast-page">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <div className="icon-bar-chart-2 text-2xl"></div>
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Demand & Sales Forecast</h1>
                    <p className="text-[var(--text-secondary)]">AI-driven predictive analytics for smarter procurement</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-6">
                <div className="lg:col-span-2 card h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <div className="icon-trending-up text-green-500"></div>
                            Predicted Market Trend
                        </h3>
                        <div className="flex bg-gray-100 rounded-lg p-1 text-xs">
                            <button className="px-3 py-1 bg-white shadow-sm rounded-md font-medium">12 Months</button>
                            <button className="px-3 py-1 text-gray-500 hover:text-gray-900">6 Months</button>
                            <button className="px-3 py-1 text-gray-500 hover:text-gray-900">30 Days</button>
                        </div>
                    </div>
                    <div className="flex-1 relative w-full h-full min-h-0">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="card bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/40 dark:to-indigo-900/40 border-purple-100">
                            <div className="flex justify-between items-start mb-2">
                                <div className="icon-trending-up text-3xl text-purple-600"></div>
                                <span className="bg-white/50 px-2 py-1 rounded text-xs text-purple-700 font-bold">+18.5%</span>
                            </div>
                            <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">Expected Growth</p>
                            <h3 className="text-2xl font-bold text-purple-900 dark:text-white">1,250 MT</h3>
                            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">vs last year</p>
                        </div>
                        <div className="card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/40 border-amber-100">
                            <div className="flex justify-between items-start mb-2">
                                <div className="icon-star text-3xl text-amber-600"></div>
                                <span className="bg-white/50 px-2 py-1 rounded text-xs text-amber-700 font-bold">HOT</span>
                            </div>
                            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Top Product</p>
                            <h3 className="text-xl font-bold text-amber-900 dark:text-white truncate">Soybean Oil</h3>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">High festival demand</p>
                        </div>
                    </div>

                    <div className="card bg-blue-50 border-blue-100">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
                            <div className="icon-zap text-lg"></div> AI Intel
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                                <div className="icon-arrow-up-circle text-green-600 mt-0.5"></div>
                                <p className="text-blue-900">Increase <strong>Soybean</strong> stocks by 20% due to upcoming wedding season demand.</p>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <div className="icon-arrow-down-circle text-red-500 mt-0.5"></div>
                                <p className="text-blue-900">Reduce <strong>Mustard</strong> procurement; price dip predicted next week.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 card">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Smart Procurement List</h3>
                        <button className="text-sm text-[var(--primary-color)] hover:underline flex items-center gap-1">
                            <div className="icon-settings"></div> Settings
                        </button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Refined Soybean Oil', format: '1L Pouch', current: '150 Units', suggest: '300 Units', deadline: '2 Days', priority: 'High', color: 'red' },
                            { name: 'Groundnut Oil', format: '5L Can', current: '20 Units', suggest: '50 Units', deadline: '5 Days', priority: 'Medium', color: 'amber' },
                            { name: 'Sunflower Oil', format: '1L Bottle', current: '85 Units', suggest: '200 Units', deadline: '3 Days', priority: 'High', color: 'red' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-12 rounded-full bg-${item.color}-500`}></div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            {item.name}
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full bg-${item.color}-100 text-${item.color}-700 uppercase`}>{item.priority}</span>
                                        </p>
                                        <p className="text-xs text-[var(--text-secondary)]">{item.format} • Inventory: {item.current}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-bold text-[var(--primary-color)]">Suggested: {item.suggest}</p>
                                        <p className="text-xs text-gray-500">Deadline: {item.deadline}</p>
                                    </div>
                                    <button className="btn-primary py-1.5 px-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Auto-Order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <h3 className="font-semibold mb-4">Regional Demand Map</h3>
                    <div className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
                        <div className="text-center p-4">
                            <div className="icon-map text-4xl text-gray-400 mb-2"></div>
                            <p className="text-sm text-gray-500">Interactive Heatmap Loading...</p>
                        </div>
                        {/* Simulated Hotspots */}
                        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-red-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-orange-500 rounded-full blur-xl opacity-50"></div>
                    </div>
                    <div className="mt-4 flex justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> High Demand</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div> Medium</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400"></div> Low</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
