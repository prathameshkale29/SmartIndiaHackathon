function MyProducePage({ user, setActivePage }) {
    // Use Shared Data Context instead of local state
    const {
        userCrops,
        produceListings,
        addCrop,
        addListing: listProduce,
        deleteListing,
        markListingSold
    } = useSharedData();

    const [showAddCropModal, setShowAddCropModal] = React.useState(false);
    const [showListProduceModal, setShowListProduceModal] = React.useState(false);
    const toast = useToast();
    const { addNotification } = useNotification();

    const handleAddCrop = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newCrop = {
            name: formData.get('cropName'),
            area: formData.get('landArea'),
            sowingDate: formData.get('sowingDate'),
            status: 'Healthy',
            days: 0
        };
        addCrop(newCrop);
        setShowAddCropModal(false);
        toast.success('New crop added successfully!');
        addNotification('Crop Added', `${newCrop.name} (${newCrop.area} acres) has been added to your farm`, 'success', 'my-produce');
    };

    const handleListProduce = (newListing) => {
        listProduce(newListing);
        toast.success('Produce listed successfully!');
        addNotification('Produce Listed', `${newListing.quantity} quintals of ${newListing.crop} listed for sale`, 'success', 'my-produce');
    };

    const handleDeleteListing = (id) => {
        deleteListing(id);
        toast.success('Listing deleted successfully');
    };

    const handleMarkSold = (id) => {
        markListingSold(id);
        toast.success('Listing marked as sold!');
    };

    return (
        <div className="animate-circular-reveal" data-name="my-produce-page" data-file="components/MyProducePage.js">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{t('myCrops')}</h1>
                    <p className="text-[var(--text-secondary)]">Manage your standing crops and harvest inventory</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setActivePage('home')} className="p-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] text-[var(--text-secondary)] transition-all" title="Back to Home">
                        <div className="icon-house text-xl"></div>
                    </button>
                    <button onClick={() => setShowAddCropModal(true)} className="btn-primary flex items-center gap-2">
                        <div className="icon-plus text-lg"></div>
                        <span>{t('addCrop')}</span>
                    </button>
                    <button onClick={() => setShowListProduceModal(true)} className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] flex items-center gap-2 font-medium">
                        <div className="icon-package text-lg"></div>
                        <span>List Produce</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Standing Crops Section */}
                <div className="card">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <div className="icon-sprout text-green-600"></div>
                        Standing Crops (Field)
                    </h3>
                    <div className="space-y-3">
                        {userCrops.length > 0 ? userCrops.map((crop, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-green-600">
                                        <div className="icon-sprout text-2xl"></div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{crop.name}</p>
                                        <p className="text-sm text-gray-500">{crop.area} {t('acres')} • Sown: {crop.sowingDate}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg font-medium mb-1">
                                        {crop.status}
                                    </span>
                                    <p className="text-xs text-gray-400">{crop.days} days old</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">No standing crops.</p>
                                <button onClick={() => setShowAddCropModal(true)} className="text-[var(--primary-color)] font-medium mt-2">Add your first crop</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Harvest/Inventory Section */}
                <div className="card">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <div className="icon-package text-amber-600"></div>
                        Harvest Inventory (For Sale)
                    </h3>
                    <ProduceListings
                        listings={produceListings}
                        onDelete={handleDeleteListing}
                        onMarkSold={handleMarkSold}
                    />
                </div>
            </div>

            <ModalDialog
                isOpen={showAddCropModal}
                onClose={() => setShowAddCropModal(false)}
                title="Add New Crop"
                footer={
                    <>
                        <button onClick={() => setShowAddCropModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" form="add-crop-form-page" className="btn-primary">Add Crop</button>
                    </>
                }
            >
                <form id="add-crop-form-page" onSubmit={handleAddCrop} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Crop Type</label>
                        <select name="cropName" required className="w-full px-4 py-2 border rounded-lg">
                            <option value="">Select Crop</option>
                            <option value="Soybean">Soybean</option>
                            <option value="Mustard">Mustard</option>
                            <option value="Groundnut">Groundnut</option>
                            <option value="Sunflower">Sunflower</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Land Area (Acres)</label>
                        <input name="landArea" type="number" step="0.1" required className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. 5.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sowing Date</label>
                        <input name="sowingDate" type="date" required className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                </form>
            </ModalDialog>

            <ListProduceModal
                isOpen={showListProduceModal}
                onClose={() => setShowListProduceModal(false)}
                onAdd={handleListProduce}
            />
        </div>
    );
}

window.MyProducePage = MyProducePage;
