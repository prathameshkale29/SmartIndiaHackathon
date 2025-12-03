function PerformanceScore() {
  try {
    const user = getCurrentUser();
    const isAdmin = user?.role === 'admin';
    const scoreData = isAdmin ? mockData.adminPerformance : mockData.userPerformance;

    const getScoreColor = (score) => {
      if (score >= 71) return { bg: 'bg-green-100 dark:bg-green-900 dark:bg-opacity-20', text: 'text-green-700 dark:text-green-300', border: 'border-green-500' };
      if (score >= 41) return { bg: 'bg-amber-100 dark:bg-amber-900 dark:bg-opacity-20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-500' };
      return { bg: 'bg-red-100 dark:bg-red-900 dark:bg-opacity-20', text: 'text-red-700 dark:text-red-300', border: 'border-red-500' };
    };

    const getScoreLabel = (score) => {
      if (score >= 71) return 'Excellent';
      if (score >= 41) return 'Good';
      return 'Needs Improvement';
    };

    return (
      <div className="card" data-name="performance-score" data-file="components/PerformanceScore.js">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Performance Rating</h3>
          <div className="icon-award text-xl text-[var(--accent-color)]"></div>
        </div>

        {isAdmin ? (
          <div className="space-y-3">
            <div className="text-sm text-[var(--text-secondary)] mb-3">
              Average regional scores
            </div>
            {scoreData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-light)] rounded-lg">
                <span className="text-sm font-medium">{item.region}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(item.avgScore).bg} ${getScoreColor(item.avgScore).text}`}>
                    {item.avgScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`border-2 rounded-lg p-4 ${getScoreColor(scoreData.totalScore).border} ${getScoreColor(scoreData.totalScore).bg}`}>
              <div className="text-center mb-3">
                <div className="text-4xl font-bold mb-1">{scoreData.totalScore}</div>
                <div className={`text-sm font-medium ${getScoreColor(scoreData.totalScore).text}`}>
                  {getScoreLabel(scoreData.totalScore)}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">AI Advice Adherence</span>
                <span className="font-medium">{scoreData.aiAdherence}/30</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(scoreData.aiAdherence/30)*100}%`}}></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Yield History</span>
                <span className="font-medium">{scoreData.yieldHistory}/40</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: `${(scoreData.yieldHistory/40)*100}%`}}></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Sales Record</span>
                <span className="font-medium">{scoreData.salesRecord}/30</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{width: `${(scoreData.salesRecord/30)*100}%`}}></div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-color)]">
              <p className="text-xs text-[var(--text-secondary)]">
                {scoreData.totalScore >= 71 
                  ? '🎉 Your excellent score qualifies you for premium loan rates and insurance benefits!' 
                  : scoreData.totalScore >= 41
                    ? 'Good score! Keep improving to access better credit terms.'
                    : 'Follow AI advice and improve yield to boost your score.'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('PerformanceScore component error:', error);
    return null;
  }
}