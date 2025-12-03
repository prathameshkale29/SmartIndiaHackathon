function StatCard({ title, value, change, icon, color = 'from-emerald-500 to-teal-500' }) {
  try {
    const [isExpanded, setIsExpanded] = React.useState(false);
    
    return (
      <div 
        className="card cursor-pointer transform hover:scale-105 transition-transform duration-200" 
        onClick={() => setIsExpanded(!isExpanded)}
        data-name="stat-card" 
        data-file="components/StatCard.js"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">{title}</p>
            <h3 className="text-2xl font-bold mb-2">{value}</h3>
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg transition-transform ${isExpanded ? 'rotate-12 scale-110' : ''}`}>
            <div className={`icon-${icon} text-xl text-white`}></div>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[var(--border-color)] animate-fade-in">
            <p className="text-xs text-[var(--text-secondary)]">Click to view detailed analytics</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('StatCard component error:', error);
    return null;
  }
}