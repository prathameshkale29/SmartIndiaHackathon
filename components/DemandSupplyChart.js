import { INDIAN_OILSEEDS } from '../utils/oilseeds.js';

function DemandSupplyChart() {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  React.useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const ChartJS = window.Chart;

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: INDIAN_OILSEEDS,
          datasets: [{
            label: 'Demand',
            data: INDIAN_OILSEEDS.map(() => Math.floor(Math.random() * 8000) + 4000),
            backgroundColor: '#16a34a'
          }, {
            label: 'Supply',
            data: INDIAN_OILSEEDS.map(() => Math.floor(Math.random() * 7000) + 3500),
            backgroundColor: '#86efac'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'bottom' }
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

  try {
    return (
      <div className="card" data-name="demand-supply-chart" data-file="components/DemandSupplyChart.js">
        <h3 className="text-lg font-semibold mb-4">{t('demandSupply')}</h3>
        <div style={{ height: '250px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DemandSupplyChart component error:', error);
    return null;
  }
}