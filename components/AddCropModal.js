function AddCropModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = React.useState({
        name: '',
        area: '',
        plantedDate: '',
        expectedHarvest: '',
        variety: ''
    });

    const cropOptions = [
        'Soybean', 'Sunflower', 'Groundnut', 'Mustard', 'Safflower',
        'Sesame', 'Linseed', 'Castor', 'Niger Seed'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.area) {
            alert('Please fill in required fields');
            return;
        }

        const newCrop = {
            ...formData,
            id: Date.now(),
            status: 'Growing',
            days: 0
        };

        onAdd(newCrop);

        // Reset form
        setFormData({
            name: '',
            area: '',
            plantedDate: '',
            expectedHarvest: '',
            variety: ''
        });

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Crop" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Crop Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    >
                        <option value="">Select a crop</option>
                        {cropOptions.map(crop => (
                            <option key={crop} value={crop}>{crop}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Variety
                    </label>
                    <input
                        type="text"
                        value={formData.variety}
                        onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., JS 335, MAUS 71"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Area (acres) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter area in acres"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Planted Date
                    </label>
                    <input
                        type="date"
                        value={formData.plantedDate}
                        onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expected Harvest Date
                    </label>
                    <input
                        type="date"
                        value={formData.expectedHarvest}
                        onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

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
                        Add Crop
                    </button>
                </div>
            </form>
        </Modal>
    );
}
