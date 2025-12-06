function ProduceListings({ listings, onDelete, onMarkSold }) {
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
                            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                        >
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
                                    <span className="text-gray-600 dark:text-gray-400">Price:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        ₹{listing.pricePerQuintal}/quintal
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Quality:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{listing.quality}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                                    <span className="text-xs text-gray-700 dark:text-gray-300">
                                        {listing.deliveryPreference}
                                    </span>
                                </div>
                            </div>

                            {/* Target Buyers */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Target Buyers:</p>
                                <div className="flex flex-wrap gap-1">
                                    {listing.targetBuyers.map((buyer) => (
                                        <span
                                            key={buyer}
                                            className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded-full"
                                        >
                                            {buyer}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Notes (if any) */}
                            {listing.notes && (
                                <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {listing.notes}
                                    </p>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                                Listed on {new Date(listing.listedDate).toLocaleDateString()}
                                {listing.availableFrom && (
                                    <> • Available from {new Date(listing.availableFrom).toLocaleDateString()}</>
                                )}
                            </div>

                            {/* Actions */}
                            {listing.status === 'active' && (
                                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => onMarkSold(listing.id)}
                                        className="flex-1 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <div className="icon-check text-sm"></div>
                                        Mark Sold
                                    </button>
                                    <button
                                        onClick={() => onDelete(listing.id)}
                                        className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        <div className="icon-trash-2 text-sm"></div>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error('ProduceListings component error:', error);
        return null;
    }
}
