function FinancialCalculator() {
  try {
    const [cropType, setCropType] = React.useState('mustard');
    const [landArea, setLandArea] = React.useState(5);
    const [seedCost, setSeedCost] = React.useState(3000);
    const [fertilizerCost, setFertilizerCost] = React.useState(8000);
    const [laborCost, setLaborCost] = React.useState(12000);
    const [otherCost, setOtherCost] = React.useState(5000);
    const [expectedYield, setExpectedYield] = React.useState(15);
    const [marketPrice, setMarketPrice] = React.useState(6000);

    const totalCost = seedCost + fertilizerCost + laborCost + otherCost;
    const costPerAcre = (totalCost / landArea).toFixed(0);
    const totalRevenue = expectedYield * marketPrice;
    const revenuePerAcre = (totalRevenue / landArea).toFixed(0);
    const netProfit = totalRevenue - totalCost;
    const profitPerAcre = (netProfit / landArea).toFixed(0);
    const roi = ((netProfit / totalCost) * 100).toFixed(1);
    const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);
    const breakEvenPrice = (totalCost / expectedYield).toFixed(0);
    const yieldPerAcre = (expectedYield / landArea).toFixed(2);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-name="financial-calculator" data-file="components/FinancialCalculator.js">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">{t('inputParameters')}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('cropType')}</label>
              <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]">
                <option value="mustard">Mustard</option>
                <option value="soybean">Soybean</option>
                <option value="groundnut">Groundnut</option>
                <option value="sunflower">Sunflower</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('landArea')} ({t('acres')}): {landArea}</label>
              <input type="range" min="1" max="50" value={landArea} onChange={(e) => setLandArea(e.target.value)} className="w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('seedCost')}</label>
                <input type="number" value={seedCost} onChange={(e) => setSeedCost(Number(e.target.value))} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('fertilizer')}</label>
                <input type="number" value={fertilizerCost} onChange={(e) => setFertilizerCost(Number(e.target.value))} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('laborCost')}</label>
                <input type="number" value={laborCost} onChange={(e) => setLaborCost(Number(e.target.value))} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('otherCosts')}</label>
                <input type="number" value={otherCost} onChange={(e) => setOtherCost(Number(e.target.value))} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('expectedYield')}</label>
                <input type="number" value={expectedYield} onChange={(e) => setExpectedYield(Number(e.target.value))} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{t('price')}</label>
                <input type="number" value={marketPrice} onChange={(e) => setMarketPrice(Number(e.target.value))} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-4">{t('costBreakdown')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Seeds</span>
                <span className="font-medium text-[var(--text-primary)]">₹{seedCost.toLocaleString()} ({((seedCost / totalCost) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Fertilizer</span>
                <span className="font-medium text-[var(--text-primary)]">₹{fertilizerCost.toLocaleString()} ({((fertilizerCost / totalCost) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Labor</span>
                <span className="font-medium text-[var(--text-primary)]">₹{laborCost.toLocaleString()} ({((laborCost / totalCost) * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Other Costs</span>
                <span className="font-medium text-[var(--text-primary)]">₹{otherCost.toLocaleString()} ({((otherCost / totalCost) * 100).toFixed(1)}%)</span>
              </div>
              <div className="pt-3 border-t border-[var(--border-color)] flex justify-between">
                <span className="font-semibold text-[var(--text-primary)]">{t('totalInvestment')}</span>
                <span className="font-bold text-xl text-[var(--text-primary)]">₹{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">{t('costPerAcre')}</span>
                <span className="font-medium text-[var(--text-primary)]">₹{Number(costPerAcre).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="card bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold mb-4">{t('revenueProfit')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--text-primary)]">{t('expectedRevenue')}</span>
                <span className="font-bold text-xl text-green-600">₹{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">{t('revenuePerAcre')}</span>
                <span className="font-medium text-green-600">₹{Number(revenuePerAcre).toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-[var(--border-color)] flex justify-between">
                <span className="font-semibold text-[var(--text-primary)]">{t('netProfit')}</span>
                <span className={`font-bold text-2xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{netProfit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">{t('profitPerAcre')}</span>
                <span className={`font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{Number(profitPerAcre).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="card bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20 border-amber-200 dark:border-amber-800">
            <h3 className="text-lg font-semibold mb-4">{t('keyMetrics')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{t('roi')}</p>
                <p className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>{roi}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{t('profitMargin')}</p>
                <p className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>{profitMargin}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{t('breakEvenPrice')}</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">₹{breakEvenPrice}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{t('yieldPerAcre')}</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{yieldPerAcre} Qt</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">{t('analysisRecommendations')}</h3>
            <div className="space-y-3 text-sm">
              {netProfit > 0 ? (
                <>
                  <div className="flex items-start gap-2">
                    <div className="icon-check-circle text-lg text-green-600 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-green-600">Profitable Venture</p>
                      <p className="text-[var(--text-secondary)]">Your expected profit is ₹{profitPerAcre} per acre with a {roi}% return on investment.</p>
                    </div>
                  </div>
                  {parseFloat(profitMargin) < 20 && (
                    <div className="flex items-start gap-2">
                      <div className="icon-alert-circle text-lg text-amber-600 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-amber-600">Low Profit Margin</p>
                        <p className="text-[var(--text-secondary)]">Consider reducing costs or negotiating better prices to improve margins.</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <div className="icon-alert-triangle text-lg text-red-600 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-red-600">Loss Expected</p>
                      <p className="text-[var(--text-secondary)]">Current projections show a loss. Review costs and market prices.</p>
                    </div>
                  </div>
                </>
              )}
              <div className="flex items-start gap-2">
                <div className="icon-info text-lg text-blue-600 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-blue-600">Market Price Analysis</p>
                  <p className="text-[var(--text-secondary)]">Your break-even price is ₹{breakEvenPrice}/Qt. Current market price is ₹{marketPrice}/Qt. {marketPrice > breakEvenPrice ? 'You have a safety margin of ₹' + (marketPrice - breakEvenPrice) + '/Qt.' : 'Price is below break-even by ₹' + (breakEvenPrice - marketPrice) + '/Qt.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('FinancialCalculator component error:', error);
    return null;
  }
}
