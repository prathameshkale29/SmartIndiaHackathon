const NotificationContext = React.createContext();

function NotificationProvider({ children }) {
    // Initialize from localStorage or empty array
    const [notifications, setNotifications] = React.useState(() => {
        try {
            const saved = localStorage.getItem('notifications');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load notifications', e);
            return [];
        }
    });

    // Persist to localStorage whenever notifications change
    React.useEffect(() => {
        try {
            localStorage.setItem('notifications', JSON.stringify(notifications));
        } catch (e) {
            console.error('Failed to save notifications', e);
        }
    }, [notifications]);

    const addNotification = React.useCallback((title, message, type = 'info') => {
        const newNotification = {
            id: Date.now(),
            title,
            message,
            type,
            time: new Date().toISOString(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = React.useCallback((id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    }, []);

    const markAllAsRead = React.useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearAll = React.useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = React.useMemo(() =>
        notifications.filter(n => !n.read).length,
        [notifications]);

    const value = React.useMemo(() => ({
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll
    }), [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

function useNotification() {
    const context = React.useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
