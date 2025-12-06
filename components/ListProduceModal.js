function ListProduceModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = React.useState({
        crop: '',
        quantity: '',
        pricePerQuintal: '',
        quality: 'Grade A',
        availableFrom: '',
        deliveryPreference: 'Negotiable',
        targetBuyers: [],
        notes: ''
    });

    const cropOptions = [
        'Soybean', 'Sunflower', 'Groundnut', 'Mustard', 'Safflower',
        'Sesame', 'Linseed', 'Castor', 'Niger Seed'
    ];

    const qualityOptions = ['Premium', 'Grade A', 'Grade B', 'Standard'];
    const deliveryOptions = ['Farm pickup', 'Warehouse delivery', 'Negotiable'];
    const buyerTypes = ['FPO', 'Processor', 'Retailer', 'Any'];

    const handleBuyerToggle = (buyer) => {
        setFormData(prev => {
            const current = prev.targetBuyers;
            if (current.includes(buyer)) {
                return { ...prev, targetBuyers: current.filter(b => b !== buyer) };
            } else {
                return { ...prev, targetBuyers: [...current, buyer] };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.crop || !formData.quantity || !formData.pricePerQuintal) {
            alert('Please fill in required fields');
            return;
        }

        if (formData.targetBuyers.length === 0) {
            alert('Please select at least one target buyer type');
            return;
        }

        const newListing = {
            ...formData,
            id: Date.now(),
            status: 'active',
            listedDate: new Date().toISOString().split('T')[0],
            quantity: parseFloat(formData.quantity),
            pricePerQuintal: parseFloat(formData.pricePerQuintal)
        };

        onAdd(newListing);

        // Reset form
        setFormData({
            crop: '',
            quantity: '',
            pricePerQuintal: '',
            quality: 'Grade A',
            availableFrom: '',
            deliveryPreference: 'Negotiable',
            targetBuyers: [],
            notes: ''
        });

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="List Produce for Sale" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Crop Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Crop Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.crop}
                            onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        >
                            <option value="">Select a crop</option>
                            {cropOptions.map(crop => (
                                <option key={crop} value={crop}>{crop}</option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Quantity (quintals) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., 25.5"
                            required
                        />
                    </div>

                    {/* Price per Quintal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expected Price (₹/quintal) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="10"
                            min="0"
                            value={formData.pricePerQuintal}
                            onChange={(e) => setFormData({ ...formData, pricePerQuintal: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., 6200"
                            required
                        />
                    </div>

                    {/* Quality Grade */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Quality Grade
                        </label>
                        <select
                            value={formData.quality}
                            onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {qualityOptions.map(quality => (
                                <option key={quality} value={quality}>{quality}</option>
                            ))}
                        </select>
                    </div>

                    {/* Available From Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Available From
                        </label>
                        <input
                            type="date"
                            value={formData.availableFrom}
                            onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Delivery Preference */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Delivery Preference
                        </label>
                        <select
                            value={formData.deliveryPreference}
                            onChange={(e) => setFormData({ ...formData, deliveryPreference: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {deliveryOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Target Buyers */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target Buyers <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {buyerTypes.map(buyer => (
                            <label
                                key={buyer}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.targetBuyers.includes(buyer)}
                                    onChange={() => handleBuyerToggle(buyer)}
                                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{buyer}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Additional Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Additional Notes
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows="3"
                        placeholder="e.g., Certified organic, stored in climate-controlled warehouse..."
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        List Produce
                    </button>
                </div>
            </form>
        </Modal>
    );
}
