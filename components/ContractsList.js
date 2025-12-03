function ContractsList() {
  try {
    const [activeTab, setActiveTab] = React.useState('available');
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const user = getCurrentUser();
    const isAdmin = user?.role === 'admin';
    
    const contracts = mockData.contracts;
    const availableContracts = contracts.filter(c => c.status === 'open');
    const myContracts = contracts.filter(c => c.status === 'active' || c.status === 'completed');

    return (
      <div className="space-y-6" data-name="contracts-list" data-file="components/ContractsList.js">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('available')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'available' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-[var(--text-secondary)]'}`}
              >
                {t('availableContracts')}
              </button>
              <button 
                onClick={() => setActiveTab('my-contracts')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'my-contracts' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-[var(--text-secondary)]'}`}
              >
                {t('myContracts')}
              </button>
            </div>
            {isAdmin && (
              <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
                <div className="icon-plus text-lg"></div>
                <span>{t('postContract')}</span>
              </button>
            )}
          </div>

          {activeTab === 'available' ? (
            <div className="space-y-4">
              {availableContracts.map((contract, idx) => (
                <div key={idx} className="border border-[var(--border-color)] rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{contract.crop}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">Posted by {contract.processor}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Open
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">{t('quantity')}</p>
                      <p className="font-medium">{contract.quantity} MT</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">{t('price')}</p>
                      <p className="font-medium text-[var(--primary-color)]">₹{contract.price}/Qt</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">{t('delivery')}</p>
                      <p className="font-medium">{contract.deliveryDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">{t('location')}</p>
                      <p className="font-medium">{contract.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                    <p className="text-sm text-[var(--text-secondary)]">
                      {t('marketRate')}: ₹{contract.marketRate}/Qt 
                      <span className="text-green-600 ml-2">+₹{contract.price - contract.marketRate} {t('premium')}</span>
                    </p>
                    {!isAdmin && (
                      <button className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-all">
                        {t('acceptContract')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {myContracts.map((contract, idx) => (
                <div key={idx} className="border border-[var(--border-color)] rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{contract.crop}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">{contract.processor}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      contract.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {contract.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Quantity</p>
                      <p className="font-medium">{contract.quantity} MT</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Contract Price</p>
                      <p className="font-medium text-[var(--primary-color)]">₹{contract.price}/Qt</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Delivery</p>
                      <p className="font-medium">{contract.deliveryDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">Total Value</p>
                      <p className="font-medium">₹{(contract.quantity * contract.price * 10).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ContractsList component error:', error);
    return null;
  }
}