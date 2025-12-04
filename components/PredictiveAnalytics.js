function PredictiveAnalytics() {
  const [predictions, setPredictions] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const formatPrediction = (data) => {
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && data !== null) {
      if (data.perAcreQuintals) return `${data.perAcreQuintals} quintals/acre`;
      if (data.direction) return `${data.direction} by ${data.expectedChangePercent || data.rangePercent || '8-12'}%`;
      if (data.startDate && data.endDate) return `${data.startDate} - ${data.endDate}`;
      if (data.type) return data.type;
      return JSON.stringify(data);
    }
    return String(data);
  };

  const formatRisks = (risks) => {
    if (Array.isArray(risks)) return risks;
    if (typeof risks === 'object' && risks !== null) {
      if (risks.issues && Array.isArray(risks.issues)) return risks.issues;
      if (risks.type) return [risks.type];
      return [JSON.stringify(risks)];
    }
    if (typeof risks === 'string') return [risks];
    return ['No specific risks identified'];
  };

  const generatePredictions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call real backend API
      const response = await fetch('/api/forecast/comprehensive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop: 'mustard',
          region: 'Maharashtra',
          area: 8.5,
          soilType: 'medium',
          irrigation: 'rainfed'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }

      const result = await response.json();

      if (result.status === 'error') {
        throw new Error(result.error);
      }

      const data = result.data;

      // Transform API response to component format
      setPredictions({
        yieldPrediction: `${data.yield_prediction.per_acre} quintals/acre (Total: ${data.yield_prediction.total_quintals} quintals)`,
        priceTrend: `₹${data.price_prediction.expected_price_per_quintal}/Qt (${data.price_prediction.trend})`,
        harvestTime: `${data.harvest_window.optimal_start} - ${data.harvest_window.optimal_end}`,
        risks: data.risks,
        revenue: `₹${data.revenue_prediction.expected_revenue.toLocaleString()} (₹${data.revenue_prediction.per_acre_revenue.toLocaleString()}/acre)`,
        recommendations: data.recommendations
      });
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message);
      // Fallback to demo data
      setPredictions({
        yieldPrediction: '7.5 quintals/acre (Total: 63.8 quintals)',
        priceTrend: '₹6000/Qt (stable)',
        harvestTime: 'Feb 15 - Feb 28, 2025',
        risks: ['Moderate pest risk', 'Low rainfall expected'],
        revenue: '₹3,82,800 (₹45,035/acre)',
        recommendations: ['Monitor weather during critical stages']
      });
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Predictive Analytics</h3>
        <div className="icon-sparkles text-xl text-amber-500"></div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">⚠️ Using demo data: {error}</p>
        </div>
      )}

      {!predictions ? (
        <button onClick={generatePredictions} disabled={loading} className="btn-primary w-full">
          {loading ? 'Analyzing...' : 'Generate Predictions'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-xs text-[var(--text-secondary)] mb-1">Yield Prediction</p>
            <p className="font-bold text-lg text-green-600">{formatPrediction(predictions.yieldPrediction)}</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-xs text-[var(--text-secondary)] mb-1">Price Trend</p>
            <p className="font-bold text-lg text-blue-600">{formatPrediction(predictions.priceTrend)}</p>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-xs text-[var(--text-secondary)] mb-1">Optimal Harvest Time</p>
            <p className="font-bold text-lg text-amber-600">{formatPrediction(predictions.harvestTime)}</p>
          </div>
          {predictions.revenue && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Expected Revenue</p>
              <p className="font-bold text-lg text-purple-600">{predictions.revenue}</p>
            </div>
          )}
          <div className="p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-xs text-[var(--text-secondary)] mb-2">Risk Factors</p>
            {formatRisks(predictions.risks).map((risk, idx) => (
              <div key={idx} className="text-sm text-red-600 flex items-center gap-2 mb-1">
                <div className="icon-alert-triangle text-sm"></div>
                <span>{String(risk)}</span>
              </div>
            ))}
          </div>
          {predictions.recommendations && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-[var(--text-secondary)] mb-2">Recommendations</p>
              {predictions.recommendations.map((rec, idx) => (
                <div key={idx} className="text-sm text-[var(--text-primary)] flex items-start gap-2 mb-1">
                  <div className="icon-check-circle text-sm text-green-600 mt-0.5"></div>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={generatePredictions} className="btn-primary w-full text-sm">
            {loading ? 'Refreshing...' : 'Refresh Predictions'}
          </button>
        </div>
      )}
    </div>
  );
}

