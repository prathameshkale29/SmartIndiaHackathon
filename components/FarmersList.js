// Enhanced FarmersList with Add Farmer/Connect modal
function FarmersList() {
  try {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCrop, setSelectedCrop] = React.useState('all');
    const [showAddFarmerModal, setShowAddFarmerModal] = React.useState(false);
    const user = getCurrentUser();
    const isAdmin = user?.role === 'admin';
    const toast = useToast();

    const farmers = isAdmin ? mockData.farmers : mockData.nearbyFarmers;
    const crops = ['all', ...new Set(farmers.map(f => f.crop))];

    const filteredFarmers = farmers.filter(farmer => {
      const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCrop = selectedCrop === 'all' || farmer.crop === selectedCrop;
      return matchesSearch && matchesCrop;
    });

    const handleAddFarmer = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const farmerData = {
        name: formData.get('name'),
        crop: formData.get('crop'),
        landArea: formData.get('landArea'),
        location: formData.get('location'),
        phone: formData.get('phone')
      };

      if (isAdmin) {
        toast.success(`Farmer ${farmerData.name} added successfully!`);
      } else {
        toast.success(`Connection request sent to ${farmerData.name}!`);
      }
      setShowAddFarmerModal(false);
      e.target.reset();
    };

    return (
      <>
        {/* Add Farmer Modal */}
        <ModalDialog
          isOpen={showAddFarmerModal}
          onClose={() => setShowAddFarmerModal(false)}
          title={isAdmin ? "Add New Farmer" : "Connect with Farmer"}
          size="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowAddFarmerModal(false)}
                className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-farmer-form"
                className="btn-primary"
              >
                {isAdmin ? 'Add Farmer' : 'Send Request'}
              </button>
            </>
          }
        >
          <form id="add-farmer-form" onSubmit={handleAddFarmer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Farmer Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g., Rajesh Kumar"
                className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Primary Crop *</label>
                <select name="crop" required className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none">
                  <option value="">Select crop...</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Groundnut">Groundnut</option>
                  <option value="Sunflower">Sunflower</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Land Area (acres) *</label>
                <input
                  type="number"
                  name="landArea"
                  required
                  min="0.1"
                  step="0.1"
                  placeholder="e.g., 10"
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Location *</label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g., Pune, Maharashtra"
                className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="e.g., +91 98765 43210"
                className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
              />
            </div>
          </form>
        </ModalDialog>

        <div className="card" data-name="farmers-list" data-file="components/FarmersList.js">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex-1 w-full">
              <h3 className="text-lg font-semibold mb-3">{isAdmin ? t('farmers') : t('farmers')}</h3>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="icon-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"></div>
                  <input
                    type="text"
                    placeholder={t('search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                  />
                </div>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="px-4 py-2 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                >
                  {crops.map(crop => (
                    <option key={crop} value={crop}>{crop === 'all' ? t('allCrops') : crop}</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={() => setShowAddFarmerModal(true)} className="btn-primary whitespace-nowrap">
              <div className="flex items-center gap-2">
                <div className="icon-plus text-lg"></div>
                <span>{isAdmin ? 'Add Farmer' : t('connect')}</span>
              </div>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">{t('name')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">{t('crop')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">{t('landArea')} ({t('acres')})</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">{t('location')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((farmer, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-light)] transition-colors cursor-pointer"
                    onClick={() => toast.info(`Viewing profile for ${farmer.name}`)}
                  >
                    <td className="py-3 px-4">{farmer.name}</td>
                    <td className="py-3 px-4">{farmer.crop}</td>
                    <td className="py-3 px-4">{farmer.landArea}</td>
                    <td className="py-3 px-4">{farmer.location}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{t('active')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('FarmersList component error:', error);
    return null;
  }
}