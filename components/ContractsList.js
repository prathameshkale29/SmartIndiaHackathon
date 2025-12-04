// Enhanced ContractsList with Post Contract and Accept Contract modals
function ContractsList() {
  try {
    const [activeTab, setActiveTab] = React.useState('available');
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [showAcceptModal, setShowAcceptModal] = React.useState(false);
    const [selectedContract, setSelectedContract] = React.useState(null);
    const [govContracts, setGovContracts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [dataSource, setDataSource] = React.useState('loading');

    const user = getCurrentUser();
    const isAdmin = user?.role === 'admin';
    const toast = useToast();

    // Fetch government contracts on component mount
    React.useEffect(() => {
      fetchGovernmentContracts();
    }, []);

    async function fetchGovernmentContracts() {
      try {
        setLoading(true);
        const response = await fetch('/api/contracts/government?limit=20');
        const data = await response.json();

        if (data.success && data.contracts) {
          setGovContracts(data.contracts);
          setDataSource(data.source);
        }
      } catch (error) {
        console.error('Error fetching government contracts:', error);
        setDataSource('error');
      } finally {
        setLoading(false);
      }
    }

    // Combine government contracts with local mock contracts
    const localContracts = mockData.contracts;
    const allContracts = [...govContracts, ...localContracts];
    const availableContracts = allContracts.filter(c => c.status === 'open');
    const myContracts = localContracts.filter(c => c.status === 'active' || c.status === 'completed');

    const handlePostContract = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const contractData = {
        crop: formData.get('crop'),
        quantity: formData.get('quantity'),
        price: formData.get('price'),
        deliveryDate: formData.get('deliveryDate'),
        location: formData.get('location')
      };

      toast.success(`Contract posted successfully for ${contractData.quantity} MT of ${contractData.crop} !`);
      setShowCreateModal(false);
      e.target.reset();
    };

    const handleAcceptContract = () => {
      if (selectedContract) {
        toast.success(`Contract accepted! You'll receive confirmation shortly for ${selectedContract.crop}.`);
        setShowAcceptModal(false);
        setSelectedContract(null);
      }
    };

    return (
      <div className="space-y-6" data-name="contracts-list" data-file="components/ContractsList.js">
        {/* Post Contract Modal */}
        <ModalDialog
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Post New Contract"
          size="md"
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="post-contract-form"
                className="btn-primary"
              >
                Post Contract
              </button>
            </>
          }
        >
          <form id="post-contract-form" onSubmit={handlePostContract} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Crop Type *</label>
              <select name="crop" required className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none">
                <option value="">Select crop...</option>
                <option value="Mustard">Mustard</option>
                <option value="Soybean">Soybean</option>
                <option value="Groundnut">Groundnut</option>
                <option value="Sunflower">Sunflower</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Quantity (MT) *</label>
                <input
                  type="number"
                  name="quantity"
                  required
                  min="1"
                  placeholder="e.g., 50"
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Price (₹/Qt) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  placeholder="e.g., 6000"
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Delivery Date *</label>
              <input
                type="date"
                name="deliveryDate"
                required
                className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Location *</label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g., Mumbai, Maharashtra"
                className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
              />
            </div>
          </form>
        </ModalDialog>

        {/* Accept Contract Modal */}
        <ModalDialog
          isOpen={showAcceptModal}
          onClose={() => {
            setShowAcceptModal(false);
            setSelectedContract(null);
          }}
          title="Accept Contract"
          size="sm"
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  setShowAcceptModal(false);
                  setSelectedContract(null);
                }}
                className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptContract}
                className="btn-primary"
              >
                Confirm Acceptance
              </button>
            </>
          }
        >
          {selectedContract && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">{selectedContract.crop}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[var(--text-secondary)]">Quantity</p>
                    <p className="font-medium">{selectedContract.quantity} MT</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Price</p>
                    <p className="font-medium text-[var(--primary-color)]">₹{selectedContract.price}/Qt</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Delivery</p>
                    <p className="font-medium">{selectedContract.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Location</p>
                    <p className="font-medium">{selectedContract.location}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Total Value: <span className="font-bold text-[var(--primary-color)]">₹{(selectedContract.quantity * selectedContract.price * 10).toLocaleString()}</span>
                  </p>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className="icon-alert-triangle text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"></div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    By accepting this contract, you agree to deliver the specified quantity by the delivery date. Failure to comply may result in penalties.
                  </p>
                </div>
              </div>
            </div>
          )}
        </ModalDialog>

        <div className="card">
          {/* Header with data source indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">{t('contracts')}</h3>
              {!loading && (
                <span className={`text-xs px-2 py-1 rounded-full ${dataSource === 'data.gov.in' ? 'bg-green-100 text-green-700' :
                  dataSource === 'fallback' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                  {dataSource === 'data.gov.in' ? '🇮🇳 Live Government Data' :
                    dataSource === 'fallback' ? '📋 Sample Data' :
                      '📊 Local Data'}
                </span>
              )}
            </div>
            <button
              onClick={fetchGovernmentContracts}
              className="text-sm text-[var(--primary-color)] hover:underline flex items-center gap-1"
              disabled={loading}
            >
              <span className={loading ? 'animate-spin' : ''}>↻</span>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'available' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-[var(--text-secondary)]'}`}
              >
                {t('availableContracts')} ({availableContracts.length})
              </button>
              <button
                onClick={() => setActiveTab('my-contracts')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'my-contracts' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-[var(--text-secondary)]'}`}
              >
                {t('myContracts')} ({myContracts.length})
              </button>
            </div>
            {isAdmin && (
              <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
                <div className="icon-plus text-lg"></div>
                <span>{t('postContract')}</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
              <p className="mt-4 text-[var(--text-secondary)]">Loading government contracts...</p>
            </div>
          ) : activeTab === 'available' ? (
            <div className="space-y-4">
              {availableContracts.length === 0 ? (
                <div className="text-center py-12 text-[var(--text-secondary)]">
                  <p>No available contracts at the moment</p>
                </div>
              ) : (
                availableContracts.map((contract, idx) => (
                  <div key={contract.id || idx} className="border border-[var(--border-color)] rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg">{contract.crop}</h4>
                          {contract.source === 'data.gov.in' && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Gov</span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">Posted by {contract.processor}</p>
                        {contract.department && (
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{contract.department}</p>
                        )}
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

                    {contract.description && (
                      <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">{contract.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-[var(--text-secondary)]">
                          {t('marketRate')}: ₹{contract.marketRate}/Qt
                          <span className="text-green-600 ml-2">+₹{contract.price - contract.marketRate} {t('premium')}</span>
                        </p>
                        {contract.contractValue && (
                          <p className="text-xs text-[var(--text-secondary)]">
                            Total Value: ₹{contract.contractValue.toLocaleString()}
                          </p>
                        )}
                      </div>
                      {!isAdmin && (
                        <button
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowAcceptModal(true);
                          }}
                          className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-all"
                        >
                          {t('acceptContract')}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {myContracts.length === 0 ? (
                <div className="text-center py-12 text-[var(--text-secondary)]">
                  <p>You don't have any contracts yet</p>
                </div>
              ) : (
                myContracts.map((contract, idx) => (
                  <div key={contract.id || idx} className="border border-[var(--border-color)] rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{contract.crop}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">{contract.processor}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${contract.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
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
                ))
              )}
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
