function NotificationCenter({ onClose }) {
  try {
    const notifications = [
      { id: 1, type: 'info', title: 'Market Update', message: 'Mustard prices increased by 3%', time: '2 hours ago', read: false },
      { id: 2, type: 'warning', title: 'Weather Alert', message: 'Heavy rainfall expected on Wednesday', time: '5 hours ago', read: false },
      { id: 3, type: 'success', title: 'Contract Accepted', message: 'Your soybean contract has been approved', time: '1 day ago', read: true },
      { id: 4, type: 'info', title: 'New Scheme', message: 'PM-KUSUM subsidy applications now open', time: '2 days ago', read: true }
    ];

    const getIcon = (type) => {
      switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'alert-triangle';
        case 'info': return 'info';
        default: return 'bell';
      }
    };

    const getColor = (type) => {
      switch(type) {
        case 'success': return 'text-green-600';
        case 'warning': return 'text-amber-600';
        case 'info': return 'text-blue-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50" onClick={onClose}>
        <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
            <h3 className="text-lg font-semibold">{t('notifications')}</h3>
            <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <div className="icon-x text-xl"></div>
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notif => (
              <div key={notif.id} className={`p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-light)] transition-colors ${!notif.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''}`}>
                <div className="flex gap-3">
                  <div className={`icon-${getIcon(notif.type)} text-xl ${getColor(notif.type)} flex-shrink-0`}></div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">{notif.title}</p>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{notif.message}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('NotificationCenter error:', error);
    return null;
  }
}