// Toast Notification System
const ToastContext = React.createContext();

function ToastProvider({ children }) {
    const [toasts, setToasts] = React.useState([]);

    const showToast = React.useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const hideToast = React.useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const value = React.useMemo(() => ({
        showToast,
        hideToast,
        success: (msg, duration) => showToast(msg, 'success', duration),
        error: (msg, duration) => showToast(msg, 'error', duration),
        warning: (msg, duration) => showToast(msg, 'warning', duration),
        info: (msg, duration) => showToast(msg, 'info', duration)
    }), [showToast, hideToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onClose={hideToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, onClose }) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md" data-name="toast-container">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
            ))}
        </div>
    );
}

function Toast({ toast, onClose }) {
    const { message, type } = toast;

    const variants = {
        success: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            icon: 'check-circle',
            iconColor: 'text-green-600 dark:text-green-400'
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            icon: 'alert-circle',
            iconColor: 'text-red-600 dark:text-red-400'
        },
        warning: {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-200 dark:border-amber-800',
            icon: 'alert-triangle',
            iconColor: 'text-amber-600 dark:text-amber-400'
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            icon: 'info',
            iconColor: 'text-blue-600 dark:text-blue-400'
        }
    };

    const variant = variants[type] || variants.info;

    return (
        <div
            className={`${variant.bg} ${variant.border} border rounded-lg p-4 shadow-lg flex items-start gap-3 animate-fade-in min-w-[300px]`}
            data-name="toast"
        >
            <div className={`icon-${variant.icon} text-xl ${variant.iconColor} flex-shrink-0 mt-0.5`}></div>
            <p className="flex-1 text-sm text-[var(--text-primary)]">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                aria-label="Close notification"
            >
                <div className="icon-x text-sm text-[var(--text-secondary)]"></div>
            </button>
        </div>
    );
}

// Hook to use toast
function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
