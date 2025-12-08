function ProduceListings({ listings, onDelete, onMarkSold }) {
    const [showBidModal, setShowBidModal] = React.useState(false);
    const [selectedListing, setSelectedListing] = React.useState(null);
    const [bids, setBids] = React.useState({}); // Map listingId -> Highest Bid
    const toast = window.useToast();

    // Fetch bids for all listings on mount
    React.useEffect(() => {
        const fetchBids = async () => {
            if (window.MockApiService && window.MockApiService.getBids) {
                const newBids = {};
                for (const listing of listings) {
                    const listingBids = await window.MockApiService.getBids(listing.id);
                    if (listingBids && listingBids.length > 0) {
                        newBids[listing.id] = listingBids[0]; // Highest bid
                    }
                }
                setBids(newBids);
            }
        };
        fetchBids();
    }, [listings]);

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const amount = parseFloat(formData.get('amount'));

        if (!selectedListing) return;

        try {
            await window.MockApiService.placeBid(selectedListing.id, {
                bidder: 'Current User (Demo)',
                amount: amount,
                note: formData.get('note')
            });
            toast.success(`Bid of ₹${amount}/qt placed successfully! 🏷️`);
            setShowBidModal(false);

            // Refresh local bid state immediately for demo effect
            setBids(prev => ({
                ...prev,
                [selectedListing.id]: { amount, bidder: 'You' }
            }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to place bid");
        }
    };

    try {
        if (!listings || listings.length === 0) {
            return (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="icon-package text-3xl text-gray-400"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Produce Listed</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        You haven't listed any produce for sale yet. Click "List Produce" to get started.
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-4" data-name="produce-listings" data-file="components/ProduceListings.js">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listings.map((listing) => (
                        <div
                            key={listing.id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all relative"
                        >
                            {/* Bidding Badge */}
                            {bids[listing.id] && (
                                <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                                    <div className="icon-tag"></div> Top Bid: ₹{bids[listing.id].amount}
                                </div>
                            )}

                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg flex items-center justify-center">
                                        <div className="icon-sprout text-2xl text-emerald-600 dark:text-emerald-400"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{listing.crop}</h3>
                                        <span
                                            className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${listing.status === 'active'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {listing.status === 'active' ? 'Active' : 'Sold'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {listing.quantity} quintals
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Ask Price:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        ₹{listing.pricePerQuintal}/quintal
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                {listing.status === 'active' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setSelectedListing(listing);
                                                setShowBidModal(true);
                                            }}
                                            className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <div className="icon-dollar-sign text-sm"></div>
                                            Place Bid
                                        </button>
                                        <button
                                            onClick={() => onMarkSold(listing.id)}
                                            className="px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                                            title="Mark Sold"
                                        >
                                            <div className="icon-check text-sm"></div>
                                        </button>
                                        <button
                                            onClick={() => onDelete(listing.id)}
                                            className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            <div className="icon-trash-2 text-sm"></div>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bidding Modal */}
                {showBidModal && selectedListing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm m-4 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <div className="icon-dollar-sign text-green-600"></div> Place Bid
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Bidding for <b>{selectedListing.crop}</b> ({selectedListing.quantity} Qt) <br />
                                Asking Price: ₹{selectedListing.pricePerQuintal}/qt
                            </p>
                            <form onSubmit={handlePlaceBid} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Your Price (₹/Quintal)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        defaultValue={selectedListing.pricePerQuintal}
                                        min="1"
                                        className="w-full border rounded p-2 text-lg font-bold text-green-700"
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Note (Optional)</label>
                                    <input name="note" placeholder="e.g. Immediate payment" className="w-full border rounded p-2" />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => setShowBidModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2">
                                        Submit Bid <span className="icon-send"></span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('ProduceListings component error:', error);
        return null;
    }
}

window.ProduceListings = ProduceListings;
