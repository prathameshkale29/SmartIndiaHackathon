function SalesChart() {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    React.useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const ChartJS = window.Chart;

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Generate last 7 days dates
            const labels = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
            }

            chartInstance.current = new ChartJS(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Sales (₹)',
                        data: [42000, 48000, 45000, 52000, 49000, 55000, 58000],
                        borderColor: '#ec4899', // Pink-500
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#ec4899',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            titleColor: '#1f2937',
                            bodyColor: '#1f2937',
                            borderColor: '#e5e7eb',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                                label: function (context) {
                                    return 'Sales: ₹' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                borderDash: [5, 5]
                            },
                            ticks: {
                                callback: function (value) {
                                    return '₹' + value / 1000 + 'k';
                                }
                            }
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
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div style={{ height: '200px', width: '100%' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
