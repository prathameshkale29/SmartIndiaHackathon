function WarehouseMap() {
  try {
    const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
    const user = getCurrentUser();
    const isAdmin = user?.role === 'admin';
    const warehouses = isAdmin ? mockData.warehouses : mockData.nearbyWarehouses;

    return (
      <div className="space-y-6" data-name="warehouse-map" data-file="components/WarehouseMap.js">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {isAdmin ? t('warehouseLocations') : t('nearbyWarehouses')}
          </h3>
          {!isAdmin && (
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {t('findStorage')}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {warehouses.map((wh, idx) => (
              <div 
                key={idx} 
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedWarehouse === idx 
                    ? 'border-[var(--primary-color)] shadow-md scale-105' 
                    : 'border-[var(--border-color)]'
                }`}
                onClick={() => setSelectedWarehouse(selectedWarehouse === idx ? null : idx)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="icon-warehouse text-xl text-blue-600"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{wh.name}</h4>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{wh.location}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-secondary)]">{t('capacity')}</span>
                      <span className="font-medium">{wh.capacity} MT</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-[var(--text-secondary)]">{t('current')}</span>
                      <span className="font-medium text-[var(--primary-color)]">{wh.current} MT</span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-[var(--primary-color)] h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(wh.current / wh.capacity) * 100}%` }}
                      ></div>
                    </div>
                    {selectedWarehouse === idx && (
                        <div className="mt-3 pt-3 border-t border-[var(--border-color)] animate-fade-in">
                          <div className="text-xs space-y-1">
                            <p className="flex justify-between">
                              <span className="text-[var(--text-secondary)]">{t('available')}:</span>
                              <span className="font-medium text-green-600">{wh.capacity - wh.current} MT</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-[var(--text-secondary)]">{t('utilization')}:</span>
                              <span className="font-medium">{Math.round((wh.current / wh.capacity) * 100)}%</span>
                            </p>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('WarehouseMap component error:', error);
    return null;
  }
}