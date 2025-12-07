function BlockchainTracker({ user }) {
  try {
    const [batches, setBatches] = React.useState([]);
    const [selectedBatch, setSelectedBatch] = React.useState(null);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [showQRModal, setShowQRModal] = React.useState(false);
    const [qrBatchId, setQrBatchId] = React.useState(null);
    const [newBatch, setNewBatch] = React.useState({
      crop: 'Mustard',
      quantity: '',
      location: ''
    });
    const [recentTransactions, setRecentTransactions] = React.useState([]);
    const [isSimulating, setIsSimulating] = React.useState(true);

    const INDIAN_OILSEEDS = [
      'Mustard', 'Soybean', 'Groundnut', 'Sunflower', 'Sesame',
      'Safflower', 'Niger Seed', 'Castor', 'Linseed', 'Oil Palm', 'Coconut'
    ];

    React.useEffect(() => {
      loadBatches();
    }, []);

    // Real-time Simulation Effect
    React.useEffect(() => {
      if (!isSimulating) return;

      const interval = setInterval(() => {
        // 1. Simulate new blockchain transaction log
        const newTx = {
          id: 'TX' + Math.random().toString(16).substr(2, 8).toUpperCase(),
          hash: '0x' + Math.random().toString(16).substr(2, 64),
          info: `Block validated: ${Math.floor(Math.random() * 100000)}`,
          time: new Date()
        };
        setRecentTransactions(prev => [newTx, ...prev].slice(0, 5));

        // 2. Simulate batch progress (randomly verifing a pending stage)
        setBatches(prevBatches => {
          return prevBatches.map(batch => {
            // 10% chance to update a batch if it's not completed
            if (batch.status !== 'Completed' && Math.random() > 0.9) {
              const nextStageIndex = batch.stages.findIndex(s => !s.verified);
              if (nextStageIndex !== -1) {
                const newStages = [...batch.stages];
                newStages[nextStageIndex] = {
                  ...newStages[nextStageIndex],
                  verified: true,
                  date: new Date().toISOString(),
                  verifier: 'Auto-SmartContract'
                };

                let newStatus = batch.status;
                if (nextStageIndex === batch.stages.length - 1) newStatus = 'Completed';
                else if (nextStageIndex > 0) newStatus = 'In Transit';

                // Check if currently selected batch needs update
                if (selectedBatch && selectedBatch.id === batch.id) {
                  setSelectedBatch(curr => ({ ...curr, stages: newStages, status: newStatus }));
                }

                return { ...batch, stages: newStages, status: newStatus };
              }
            }
            return batch;
          });
        });

      }, 3000); // Pulse every 3 seconds

      return () => clearInterval(interval);
    }, [isSimulating, selectedBatch]);

    const loadBatches = () => {
      const mockBatches = [
        {
          id: 'BTC001',
          crop: 'Mustard',
          quantity: 50,
          farmer: user?.name || 'Ramesh Kumar',
          location: 'Wardha, Maharashtra',
          timestamp: '2025-01-15T09:00:00',
          status: 'In Transit',
          blockchainHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
          stages: [
            { stage: 'Farm Harvest', date: '2025-01-15T09:00:00', verified: true, verifier: 'Farm Inspector', notes: 'Quality checked and approved' },
            { stage: 'Collection Center', date: '2025-01-16T14:30:00', verified: true, verifier: 'FPO Manager', notes: 'Weight verified: 50 MT' },
            { stage: 'Quality Testing', date: '2025-01-17T10:00:00', verified: true, verifier: 'Lab Technician', notes: 'Oil content: 42%, Moisture: 8%' },
            { stage: 'Processing Unit', date: '2025-01-18T11:00:00', verified: false, verifier: 'Plant Manager', notes: 'Processing' },
            { stage: 'Warehouse Storage', date: '2025-01-20T16:00:00', verified: false, verifier: '', notes: 'Awaiting arrival' }
          ],
          certificates: [
            { name: 'Quality Certificate', issued: '2025-01-17', authority: 'FSSAI' },
            { name: 'Origin Certificate', issued: '2025-01-15', authority: 'Agriculture Dept' }
          ]
        },
        {
          id: 'BTC002',
          crop: 'Soybean',
          quantity: 75,
          farmer: 'Suresh Patel',
          location: 'Indore, MP',
          timestamp: '2025-01-20T10:30:00',
          status: 'Completed',
          blockchainHash: '0x8a9fade2d1e68b8bg77bc5fbe8efade2d1e68b8bg77bc5fbe8d3d3fc8c22ba2496',
          stages: [
            { stage: 'Farm Harvest', date: '2025-01-20T10:30:00', verified: true, verifier: 'Farm Inspector', notes: 'Approved' },
            { stage: 'Collection Center', date: '2025-01-21T15:00:00', verified: true, verifier: 'FPO Manager', notes: 'Received' },
            { stage: 'Quality Testing', date: '2025-01-22T09:00:00', verified: true, verifier: 'Lab Technician', notes: 'Passed' },
            { stage: 'Processing Unit', date: '2025-01-23T12:00:00', verified: true, verifier: 'Plant Manager', notes: 'Completed' },
            { stage: 'Final Delivery', date: '2025-01-25T14:00:00', verified: true, verifier: 'Buyer Representative', notes: 'Delivered successfully' }
          ],
          certificates: [
            { name: 'Quality Certificate', issued: '2025-01-22', authority: 'FSSAI' },
            { name: 'Origin Certificate', issued: '2025-01-20', authority: 'Agriculture Dept' }
          ]
        },
        {
          id: 'BTC003',
          crop: 'Groundnut',
          quantity: 30,
          farmer: 'Anil Deshmukh',
          location: 'Rajkot, Gujarat',
          timestamp: '2025-02-01T08:00:00',
          status: 'In Progress',
          blockchainHash: '0x9c3e...1234',
          stages: [
            { stage: 'Farm Harvest', date: '2025-02-01T08:00:00', verified: true, verifier: 'Self', notes: 'Harvesting begun' },
            { stage: 'Collection Center', date: '', verified: false },
            { stage: 'Quality Testing', date: '', verified: false },
            { stage: 'Processing Unit', date: '', verified: false },
            { stage: 'Final Delivery', date: '', verified: false }
          ],
          certificates: []
        }
      ];

      // Load local blockchain batches
      const localBatches = (typeof getBlockchainBatches === 'function') ? getBlockchainBatches() : [];
      setBatches([...localBatches, ...mockBatches]);
    };

    const generateQR = (batchId) => {
      setQrBatchId(batchId);
      setShowQRModal(true);
    };

    const downloadCertificate = (batch) => {
      alert(`Downloading blockchain certificate for ${batch.id}`);
    };

    const createBatch = async () => {
      if (!newBatch.quantity || !newBatch.location) {
        alert('Please fill all fields');
        return;
      }

      try {
        const batchData = {
          crop: newBatch.crop,
          quantity: parseFloat(newBatch.quantity),
          farmer: user?.name || 'Current User',
          location: newBatch.location,
          status: 'In Progress',
          stages: [
            { stage: 'Farm Harvest', date: new Date().toISOString(), verified: true, verifier: 'Self', notes: 'Batch created' },
            { stage: 'Collection Center', verified: false },
            { stage: 'Quality Testing', verified: false },
            { stage: 'Processing Unit', verified: false },
            { stage: 'Final Delivery', verified: false }
          ],
          certificates: []
        };

        let savedBatch;
        if (typeof saveBatchToBlockchain === 'function') {
          savedBatch = saveBatchToBlockchain(batchData);
        } else {
          // Fallback if utility not loaded
          savedBatch = {
            ...batchData,
            id: 'BTC' + String(Date.now()).substr(-6),
            blockchainHash: '0x' + Math.random().toString(16).substr(2, 64),
            timestamp: new Date().toISOString()
          };
        }

        const updatedBatches = [...batches, savedBatch];
        setBatches(updatedBatches);
        setShowAddModal(false);
        setNewBatch({ crop: 'Mustard', quantity: '', location: '' });
      } catch (err) {
        console.error('Failed to create batch:', err);
        alert('Failed to create batch: ' + err.message);
      }
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
        date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="space-y-6 max-w-full overflow-x-hidden">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Supply Chain Traceability
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs font-normal text-green-600 border border-green-200 bg-green-50 px-2 py-0.5 rounded-full">REAL-TIME</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">Immutable ledger tracking from farm to fork</p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <div className="icon-plus text-lg"></div>
            <span>New Batch</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Active Batches */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {batches.map(batch => (
              <div key={batch.id} className="card cursor-pointer hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-[var(--primary-color)] relative overflow-hidden" onClick={() => setSelectedBatch(batch)}>
                {batch.status !== 'Completed' && (
                  <div className="absolute top-0 right-0 w-2 h-2 m-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-[var(--primary-color)]">{batch.id}</h3>
                    <p className="text-base font-medium text-[var(--text-primary)] mt-1">{batch.crop}</p>
                  </div>
                  <span className={`px-3 py-1.5 text-sm font-bold rounded-lg ${batch.status === 'Completed' ? 'bg-green-500 text-white' :
                    batch.status === 'In Transit' ? 'bg-blue-500 text-white' :
                      'bg-amber-500 text-white'
                    }`}>{batch.status}</span>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <div className="icon-user text-sm text-[var(--text-secondary)]"></div>
                    <span>{batch.farmer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="icon-package text-sm text-[var(--text-secondary)]"></div>
                    <span>{batch.quantity} MT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="icon-map-pin text-sm text-[var(--text-secondary)]"></div>
                    <span>{batch.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="icon-clock text-sm text-[var(--text-secondary)]"></div>
                    <span className="text-xs">{formatDate(batch.timestamp)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); generateQR(batch.id); }} className="flex-1 px-3 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2 font-medium">
                    <div className="icon-qr-code text-lg"></div>
                    <span>QR</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); downloadCertificate(batch); }} className="flex-1 px-3 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all text-sm flex items-center justify-center gap-2 font-medium">
                    <div className="icon-download text-lg"></div>
                    <span>Cert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Live Feed sidebar */}
          <div className="card h-full max-h-[600px] overflow-hidden flex flex-col">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <div className="icon-activity text-blue-500 animate-pulse"></div>
              Live Blockchain Feed
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {recentTransactions.map((tx, idx) => (
                <div key={idx} className="p-3 bg-[var(--bg-light)] rounded-lg text-xs animate-fade-in border-l-2 border-blue-500">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-blue-600">{tx.id}</span>
                    <span className="text-[var(--text-secondary)]">{tx.time.toLocaleTimeString()}</span>
                  </div>
                  <p className="font-mono text-[10px] text-gray-500 truncate mb-1">{tx.hash}</p>
                  <p className="text-[var(--text-primary)]">{tx.info}</p>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <p className="text-center text-[var(--text-secondary)] text-sm py-4">Waiting for new blocks...</p>
              )}
            </div>
          </div>
        </div>

        {selectedBatch && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Supply Chain Journey - {selectedBatch.id}</h3>
                <button onClick={() => setSelectedBatch(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  <div className="icon-x text-xl"></div>
                </button>
              </div>

              <div className="mb-6 p-5 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg text-white">
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <div className="icon-shield-check text-xl"></div>
                  Blockchain Verified Hash
                </p>
                <div className="flex items-center gap-2 bg-black bg-opacity-20 p-2 rounded">
                  <p className="text-xs font-mono break-all flex-1">{selectedBatch.blockchainHash}</p>
                  <div className="text-green-300 text-xs font-bold animate-pulse">VALID</div>
                </div>
              </div>

              <div className="relative pl-8">
                {selectedBatch.stages.map((stage, idx) => (
                  <div key={idx} className="mb-8 relative transition-all duration-500">
                    <div className={`absolute left-[-32px] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 ${stage.verified ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                      <div className={`icon-${stage.verified ? 'check' : 'clock'} text-white text-xl`}></div>
                    </div>
                    {idx < selectedBatch.stages.length - 1 && (
                      <div className={`absolute left-[-26px] top-12 w-1 h-full transition-colors duration-500 ${stage.verified && selectedBatch.stages[idx + 1].verified ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    )}
                    <div className={`p-5 rounded-xl shadow-md border-l-4 transition-all duration-500 ${stage.verified ? 'bg-gradient-to-r from-green-50 to-white border-green-500' : 'bg-white border-gray-300 opacity-70'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-xl text-[var(--text-primary)]">{stage.stage}</h4>
                        <span className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors ${stage.verified ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-500'
                          }`}>
                          {stage.verified ? '✓ Verified on Chain' : 'Pending Verification'}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">{formatDate(stage.date)}</p>
                      {stage.verifier && (
                        <p className="text-sm mb-1">
                          <span className="text-[var(--text-secondary)]">Validator:</span> {stage.verifier}
                        </p>
                      )}
                      {stage.notes && (
                        <p className="text-sm text-[var(--text-secondary)] italic">"{stage.notes}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="card bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900 dark:to-green-900 border-2 border-blue-200 dark:border-blue-700">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <div className="icon-info text-xl text-blue-600"></div>
                  Batch Information
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-[var(--text-secondary)] font-medium">Batch ID</span>
                    <span className="font-bold text-[var(--primary-color)]">{selectedBatch.id}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-[var(--text-secondary)] font-medium">Crop</span>
                    <span className="font-bold">{selectedBatch.crop}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-[var(--text-secondary)] font-medium">Quantity</span>
                    <span className="font-bold">{selectedBatch.quantity} MT</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-[var(--text-secondary)] font-medium">Farmer</span>
                    <span className="font-bold">{selectedBatch.farmer}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-[var(--text-secondary)] font-medium">Origin</span>
                    <span className="font-bold">{selectedBatch.location}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-[var(--text-secondary)] font-medium">Status</span>
                    <span className={`font-bold ${selectedBatch.status === 'Completed' ? 'text-green-600' : 'text-blue-600'
                      }`}>{selectedBatch.status}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold mb-3">Smart Contract Actions</h4>
                <div className="space-y-2">
                  <button onClick={() => generateQR(selectedBatch.id)} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                    <div className="icon-qr-code text-lg"></div>
                    <span>Generate Public QR</span>
                  </button>
                  <button onClick={() => downloadCertificate(selectedBatch)} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all text-sm flex items-center justify-center gap-2">
                    <div className="icon-download text-lg"></div>
                    <span>Download NFT Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowAddModal(false)}>
            <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-semibold mb-4">Create New Batch</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Crop Type</label>
                  <select value={newBatch.crop} onChange={(e) => setNewBatch({ ...newBatch, crop: e.target.value })} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]">
                    {INDIAN_OILSEEDS.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity (MT)</label>
                  <input type="number" value={newBatch.quantity} onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]" placeholder="Enter quantity" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input type="text" value={newBatch.location} onChange={(e) => setNewBatch({ ...newBatch, location: e.target.value })} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]" placeholder="Enter location" />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)]">Cancel</button>
                <button onClick={createBatch} className="flex-1 btn-primary">Create Batch</button>
              </div>
            </div>
          </div>
        )}

        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowQRModal(false)}>
            <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-md p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-semibold mb-4">QR Code - {qrBatchId}</h3>
              <div className="bg-white p-8 rounded-lg inline-block mb-4">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center border-4 border-black">
                  <div className="text-6xl">📱</div>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">Scan this QR code to track the batch on blockchain verified ledger</p>
              <p className="text-xs font-mono bg-[var(--bg-light)] p-2 rounded mb-4 break-all">https://agrisync.app/track/{qrBatchId}</p>
              <button onClick={() => setShowQRModal(false)} className="btn-primary w-full">Close</button>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('BlockchainTracker error:', error);
    return null;
  }
} win