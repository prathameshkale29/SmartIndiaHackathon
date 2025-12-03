function FarmersList() {
  try {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCrop, setSelectedCrop] = React.useState('all');
    const user = getCurrentUser();
    const isAdmin = user?.role === 'admin';
    
    const farmers = isAdmin ? mockData.farmers : mockData.nearbyFarmers;
    const crops = ['all', ...new Set(farmers.map(f => f.crop))];
    
    const filteredFarmers = farmers.filter(farmer => {
      const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCrop = selectedCrop === 'all' || farmer.crop === selectedCrop;
      return matchesSearch && matchesCrop;
    });

    return (
      <div className="card" data-name="farmers-list" data-file="components/FarmersList.js">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex-1">
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
          <button className="btn-primary whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className="icon-plus text-lg"></div>
              <span>{isAdmin ? t('farmers') : t('connect')}</span>
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
                <tr key={idx} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-light)] transition-colors cursor-pointer">
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
    );
  } catch (error) {
    console.error('FarmersList component error:', error);
    return null;
  }
}