
// Enhanced ContractsList with Post Contract and Accept Contract modals
// Uses MockApiService for data persistence
function ContractsList() {
  try {
    const [activeTab, setActiveTab] = React.useState('available');
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [showAcceptModal, setShowAcceptModal] = React.useState(false);
    const [selectedContract, setSelectedContract] = React.useState(null);
    const [contributionQuintals, setContributionQuintals] = React.useState('');
    const [contracts, setContracts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const user = window.getCurrentUser();
    const isAdmin = user?.role === 'admin' || user?.role === 'processor' || user?.role === 'fpo';
    const toast = window.useToast();

    React.useEffect(() => {
      loadContracts();
    }, []);

    const loadContracts = async () => {
      setLoading(true);
      try {
        const data = await window.MockApiService.getContracts();
        setContracts(data);
      } catch (error) {
        console.error("Failed to load contracts", error);
      } finally {
        setLoading(false);
      }
    };

    const availableContracts = contracts.filter(c => c.status === 'Active' || c.status === 'Pending');
    // For demo, "My Contracts" are those completed or specifically assigned (mock logic)
    const myContracts = contracts.filter(c => c.status === 'Completed' || c.party === user?.name);

    const handlePostContract = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const contractData = {
        crop: formData.get('crop'),
        quantity: parseFloat(formData.get('quantity')),
        price: parseFloat(formData.get('price')),
        deliveryDate: formData.get('deliveryDate'),
        location: formData.get('location'),
        party: user?.name || 'Current User',
        type: 'Purchase', // Assuming processor buys
        marketRate: parseFloat(formData.get('price')) - 500,
        department: 'Private Procurement'
      };

      try {
        await window.MockApiService.createContract(contractData);
        toast.success(`Contract posted successfully for ${contractData.quantity} MT of ${contractData.crop}!`);
        setShowCreateModal(false);
        e.target.reset();
        loadContracts();
      } catch (err) {
        console.error(err);
        toast.error("Failed to post contract");
      }
    };

    const handleAcceptContract = async () => {
      if (selectedContract && contributionQuintals) {
        // Logic to update contract status would go here
        // For now, just show success toast
        toast.success(`Contract accepted! Payment initiated.`);
        setShowAcceptModal(false);
        setSelectedContract(null);
        setContributionQuintals('');
      } else {
        toast.error('Please enter quantity');
      }
    };

    return (
      <div className="space-y-6" data-name="contracts-list">
        {/* Post Contract Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Post New Contract</h3>
              <form id="post-contract-form" onSubmit={handlePostContract} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Crop Type *</label>
                  <select name="crop" required className="w-full border rounded p-2">
                    <option value="">Select crop...</option>
                    {window.INDIAN_OILSEEDS.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity (MT) *</label>
                    <input type="number" name="quantity" required min="1" className="w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹/Qt) *</label>
                    <input type="number" name="price" required min="1" className="w-full border rounded p-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Date *</label>
                  <input type="date" name="deliveryDate" required className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <input type="text" name="location" required className="w-full border rounded p-2" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Post Contract</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Accept Modal */}
        {showAcceptModal && selectedContract && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Accept Contract: {selectedContract.party}</h3>
              <div className="space-y-4">
                <p><strong>Item:</strong> {selectedContract.item || selectedContract.crop}</p>
                <p><strong>Price:</strong> ₹{selectedContract.price}/Qt</p>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Contribution (Quintals)</label>
                  <input
                    type="number"
                    value={contributionQuintals}
                    onChange={e => setContributionQuintals(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setShowAcceptModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                  <button type="button" onClick={handleAcceptContract} className="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'available' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-[var(--text-secondary)]'}`}
              >
                Available Contracts ({availableContracts.length})
              </button>
              <button
                onClick={() => setActiveTab('my-contracts')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'my-contracts' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-[var(--text-secondary)]'}`}
              >
                My Contracts ({myContracts.length})
              </button>
            </div>
            {isAdmin && (
              <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
                <div className="icon-plus text-lg"></div>
                <span>Post Contract</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">Loading contracts...</div>
          ) : activeTab === 'available' ? (
            <div className="space-y-4">
              {availableContracts.length === 0 ? (
                <div className="text-center py-12 text-[var(--text-secondary)]">No available contracts</div>
              ) : (
                availableContracts.map((contract, idx) => (
                  <div key={contract.id || idx} className="border border-[var(--border-color)] rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{contract.item || contract.crop}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Party: {contract.party}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        {contract.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">Quantity</p>
                        <p className="font-medium">{contract.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">Price</p>
                        <p className="font-medium text-[var(--primary-color)]">₹{contract.price || 'Market Rate'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">Deadline</p>
                        <p className="font-medium">{contract.deadline || contract.deliveryDate}</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedContract(contract);
                          setShowAcceptModal(true);
                        }}
                        className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-all"
                      >
                        Accept Contract
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* My Contracts View */}
              {myContracts.map((contract, idx) => (
                <div key={contract.id || idx} className="border border-[var(--border-color)] rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold">{contract.item || contract.crop}</h4>
                  <p className="text-sm">Status: {contract.status}</p>
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
