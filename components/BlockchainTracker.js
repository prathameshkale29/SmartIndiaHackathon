function BlockchainTracker({ user }) {
  try {
    const [batches, setBatches] = React.useState([]);
    const [selectedBatch, setSelectedBatch] = React.useState(null);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [showQRModal, setShowQRModal] = React.useState(false);
    const [qrBatchId, setQrBatchId] = React.useState(null);
    const [newBatch, setNewBatch] = React.useState({
      crop: 'Mustard Seeds',
      quantity: '',
      location: ''
    });

    React.useEffect(() => {
      loadBatches();
    }, []);

    const loadBatches = () => {
      const mockBatches = [
        {
          id: 'BTC001',
          crop: 'Mustard Seeds',
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
            { stage: 'Processing Unit', date: '2025-01-18T11:00:00', verified: true, verifier: 'Plant Manager', notes: 'Processing initiated' },
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
        }
      ];
      setBatches(mockBatches);
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

      const batchId = 'BTC' + String(Date.now()).substr(-6);

      try {
        const res = await fetch('/api/trace/register-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            batchId,
            crop: newBatch.crop,
            originFarm: user?.name || 'Current User'
          })
        });

        const data = await res.json();
        if (data.status !== 'ok') throw new Error(data.error);

        const batch = {
          id: batchId,
          crop: newBatch.crop,
          quantity: parseFloat(newBatch.quantity),
          farmer: user?.name || 'Current User',
          location: newBatch.location,
          timestamp: new Date().toISOString(),
          status: 'In Progress',
          blockchainHash: data.txHash,
          stages: [
            { stage: 'Farm Harvest', date: new Date().toISOString(), verified: true, verifier: 'Self', notes: 'Batch created' }
          ],
          certificates: []
        };
        setBatches([...batches, batch]);
        setShowAddModal(false);
        setNewBatch({ crop: 'Mustard Seeds', quantity: '', location: '' });
      } catch (err) {
        console.error('Failed to create batch:', err);
        alert('Failed to create batch: ' + err.message);
      }
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
        date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="space-y-6 max-w-full overflow-x-hidden">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Blockchain Traceability</h2>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
            <div className="icon-plus text-lg"></div>
            <span>New Batch</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map(batch => (
            <div key={batch.id} className="card cursor-pointer hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-[var(--primary-color)]" onClick={() => setSelectedBatch(batch)}>
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

        {selectedBatch && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Supply Chain Journey - {selectedBatch.id}</h3>
                <button onClick={() => setSelectedBatch(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                  <div className="icon-x text-xl"></div>
                </button>
              </div>

              <div className="mb-6 p-5 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg">
                <p className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <div className="icon-shield-check text-xl"></div>
                  Blockchain Hash Verification
                </p>
                <p className="text-sm font-mono break-all text-white bg-black bg-opacity-20 p-3 rounded">{selectedBatch.blockchainHash}</p>
              </div>

              <div className="relative pl-8">
                {selectedBatch.stages.map((stage, idx) => (
                  <div key={idx} className="mb-8 relative">
                    <div className={`absolute left-[-32px] w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${stage.verified ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                      <div className={`icon-${stage.verified ? 'check' : 'clock'} text-white text-xl`}></div>
                    </div>
                    {idx < selectedBatch.stages.length - 1 && (
                      <div className="absolute left-[-26px] top-12 w-1 h-full bg-gray-300"></div>
                    )}
                    <div className="bg-gradient-to-r from-[var(--bg-light)] to-[var(--bg-white)] p-5 rounded-xl shadow-md border-l-4 border-[var(--primary-color)]">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-xl text-[var(--text-primary)]">{stage.stage}</h4>
                        <span className={`px-3 py-1.5 text-sm font-bold rounded-lg ${stage.verified ? 'bg-green-500 text-white' :
                          'bg-gray-400 text-white'
                          }`}>
                          {stage.verified ? '✓ Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">{formatDate(stage.date)}</p>
                      {stage.verifier && (
                        <p className="text-sm mb-1">
                          <span className="text-[var(--text-secondary)]">Verified by:</span> {stage.verifier}
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
                <h4 className="font-semibold mb-4">Certificates</h4>
                <div className="space-y-2">
                  {selectedBatch.certificates.length > 0 ? (
                    selectedBatch.certificates.map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-light)] rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="icon-file-check text-lg text-green-600"></div>
                          <div>
                            <p className="text-sm font-medium">{cert.name}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{cert.authority}</p>
                          </div>
                        </div>
                        <button className="text-[var(--primary-color)] hover:underline text-xs">View</button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)] text-center py-4">No certificates available</p>
                  )}
                </div>
              </div>

              <div className="card">
                <h4 className="font-semibold mb-3">Actions</h4>
                <div className="space-y-2">
                  <button onClick={() => generateQR(selectedBatch.id)} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                    <div className="icon-qr-code text-lg"></div>
                    <span>Generate QR Code</span>
                  </button>
                  <button onClick={() => downloadCertificate(selectedBatch)} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all text-sm flex items-center justify-center gap-2">
                    <div className="icon-download text-lg"></div>
                    <span>Download Certificate</span>
                  </button>
                  <button className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all text-sm flex items-center justify-center gap-2">
                    <div className="icon-share-2 text-lg"></div>
                    <span>Share Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddModal(false)}>
            <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-semibold mb-4">Create New Batch</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Crop Type</label>
                  <select value={newBatch.crop} onChange={(e) => setNewBatch({ ...newBatch, crop: e.target.value })} className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]">
                    <option>Mustard Seeds</option>
                    <option>Soybean</option>
                    <option>Groundnut</option>
                    <option>Sunflower</option>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowQRModal(false)}>
            <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-md p-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-semibold mb-4">QR Code - {qrBatchId}</h3>
              <div className="bg-white p-8 rounded-lg inline-block mb-4">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <div className="text-6xl">📱</div>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">Scan this QR code to track the batch on blockchain</p>
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
}