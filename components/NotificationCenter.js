function NotificationCenter({ onClose }) {
  try {
    const { notifications, markAllAsRead } = useNotification();

    // Helper function to get relative time
    const getRelativeTime = (timestamp) => {
      const now = new Date();
      const notifTime = new Date(timestamp);
      const diffMs = now - notifTime;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    // Mark all as read when opening the notification center
    React.useEffect(() => {
      if (notifications.length > 0) {
        markAllAsRead();
      }
    }, []);

    const getIcon = (type) => {
      switch (type) {
        case 'success': return 'check-circle';
        case 'warning': return 'alert-triangle';
        case 'info': return 'info';
        default: return 'bell';
      }
    };

    const getColor = (type) => {
      switch (type) {
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
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="icon-bell text-4xl text-gray-300 dark:text-gray-600 mb-2"></div>
                <p className="text-sm text-[var(--text-secondary)]">No notifications yet</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-light)] transition-colors ${!notif.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''}`}>
                  <div className="flex gap-3">
                    <div className={`icon-${getIcon(notif.type)} text-xl ${getColor(notif.type)} flex-shrink-0`}></div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">{notif.title}</p>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">{notif.message}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{getRelativeTime(notif.time)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('NotificationCenter error:', error);
    return null;
  }
}