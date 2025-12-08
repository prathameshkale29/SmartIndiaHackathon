const SharedDataContext = React.createContext();

const useSharedData = () => {
    const context = React.useContext(SharedDataContext);
    if (!context) {
        throw new Error('useSharedData must be used within a SharedDataProvider');
    }
    return context;
};

const SharedDataProvider = ({ children }) => {
    // Initialize state from localStorage or mockData (global)
    const [state, setState] = React.useState(() => {
        const savedState = localStorage.getItem('agrisync_state_v1');
        if (savedState) {
            try {
                return JSON.parse(savedState);
            } catch (e) {
                console.error('Failed to parse saved state', e);
                return mockData;
            }
        }
        return mockData;
    });

    // Persist state changes
    React.useEffect(() => {
        localStorage.setItem('agrisync_state_v1', JSON.stringify(state));
    }, [state]);

    // --- Actions ---

    const addCrop = (newCrop) => {
        setState(prev => ({
            ...prev,
            userCrops: [...prev.userCrops, { ...newCrop, id: Date.now() }]
        }));
    };

    const addListing = (listing) => {
        setState(prev => ({
            ...prev,
            produceListings: [...(prev.produceListings || []), { ...listing, id: Date.now(), status: 'active', listedDate: new Date().toISOString().split('T')[0] }]
        }));
    };

    const addContract = (contract) => {
        setState(prev => ({
            ...prev,
            contracts: [...(prev.contracts || []), { ...contract, id: `C${Date.now()}`, status: 'open', source: 'local' }]
        }));
    };

    const createTender = (tender) => {
        // For Processors to create demand
        const newTender = {
            id: `T${Date.now().toString().slice(-4)}`,
            status: 'Open',
            bidCount: 0,
            ...tender
        };

        setState(prev => ({
            ...prev,
            tenders: [...(prev.tenders || []), newTender]
        }));
        return newTender;
    };

    const placeBid = (tenderId, bid) => {
        // For Farmers/FPOs to bid on tenders
        const newBid = {
            id: `B${Date.now().toString().slice(-4)}`,
            tenderId,
            bidDate: new Date().toISOString(),
            status: 'Pending',
            ...bid
        };

        setState(prev => {
            // Update the tender's bid count
            const updatedTenders = (prev.tenders || []).map(t =>
                t.id === tenderId ? { ...t, bidCount: (t.bidCount || 0) + 1 } : t
            );

            return {
                ...prev,
                tenders: updatedTenders,
                myBids: [...(prev.myBids || []), newBid] // 'myBids' tracks bids made by the current user
            };
        });
    };

    const updateContractStatus = (contractId, status) => {
        setState(prev => ({
            ...prev,
            contracts: prev.contracts.map(c =>
                c.id === contractId ? { ...c, status } : c
            )
        }));
    };

    const deleteListing = (id) => {
        setState(prev => ({
            ...prev,
            produceListings: prev.produceListings.filter(l => l.id !== id)
        }));
    };

    const markListingSold = (id) => {
        setState(prev => ({
            ...prev,
            produceListings: prev.produceListings.map(l =>
                l.id === id ? { ...l, status: 'sold' } : l
            )
        }));
    };

    const resetData = () => {
        localStorage.removeItem('agrisync_state_v1');
        setState(mockData);
        window.location.reload();
    };

    const value = {
        // Data
        dashboardStats: state.dashboardStats,
        farmers: state.farmers,
        marketPrices: state.marketPrices,
        warehouses: state.warehouses,
        userCrops: state.userCrops,
        produceListings: state.produceListings,
        contracts: state.contracts,
        tenders: state.tenders || [],
        myBids: state.myBids || [],

        // Full State Access if needed
        fullState: state,

        // Actions
        addCrop,
        addListing,
        addContract,
        createTender,
        placeBid,
        updateContractStatus,
        deleteListing,
        markListingSold,
        resetData
    };

    return (
        <SharedDataContext.Provider value={value}>
            {children}
        </SharedDataContext.Provider>
    );
};

// Make globally available
window.SharedDataContext = SharedDataContext;
window.SharedDataProvider = SharedDataProvider;
window.useSharedData = useSharedData;
