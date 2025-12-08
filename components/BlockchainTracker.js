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
    const [chainValid, setChainValid] = React.useState(null); // null, true, false
    const [validating, setValidating] = React.useState(false);
    const [recentBlocks, setRecentBlocks] = React.useState([]);

    React.useEffect(() => {
      initBlockchain();
    }, []);

    const initBlockchain = async () => {
      if (window.AgriBlockchain) {
        await window.AgriBlockchain.init();
        refreshData();
      }
    };

    const refreshData = () => {
      if (window.AgriBlockchain) {
        const realBatches = window.AgriBlockchain.getAllBatches();
        // Sort by latest
        setBatches(realBatches.reverse());

        // Update recent blocks for feed
        const chain = window.AgriBlockchain.chain;
        const recent = chain.slice(-5).reverse().map(b => ({
          index: b.index,
          hash: b.hash,
          prevHash: b.previousHash,
          time: new Date(b.timestamp),
          data: b.data === "Genesis Block" ? "Genesis" : `Batch ${b.data.id}`
        }));
        setRecentBlocks(recent);
      }
    };

    const handleValidateChain = async () => {
      setValidating(true);
      const isValid = await window.AgriBlockchain.isChainValid();
      setChainValid(isValid);
      setValidating(false);
      setTimeout(() => setChainValid(null), 5000); // Reset after 5s
    };

    const createBatch = async () => {
      if (!newBatch.quantity || !newBatch.location) {
        alert('Please fill all fields');
        return;
      }

      try {
        const batchData = {
          id: 'BTC' + String(Date.now()).substr(-6),
          crop: newBatch.crop,
          quantity: parseFloat(newBatch.quantity),
          farmer: user?.name || 'Current User',
          location: newBatch.location,
          status: 'In Progress',
          stages: [
            { stage: 'Farm Harvest', date: new Date().toISOString(), verified: true, verifier: 'Self', notes: 'Batch minted on-chain' },
            { stage: 'Collection Center', verified: false },
            { stage: 'Quality Testing', verified: false },
            { stage: 'Processing Unit', verified: false },
            { stage: 'Final Delivery', verified: false }
          ],
          certificates: []
        };

        // Add to Real Blockchain
        await window.AgriBlockchain.addBlock(batchData);

        refreshData();
        setShowAddModal(false);
        setNewBatch({ crop: 'Mustard', quantity: '', location: '' });
        window.useToast().success("Batch minted to Blockchain successfully!");

      } catch (err) {
        console.error('Failed to create batch:', err);
        alert('Failed to creat batch: ' + err.message);
      }
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
        date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const generateQR = (batchId) => {
      setQrBatchId(batchId);
      setShowQRModal(true);
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
              <span className="text-xs font-normal text-green-600 border border-green-200 bg-green-50 px-2 py-0.5 rounded-full">LIVE NODE</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">SHA-256 Immutable Ledger (Client-Side Validated)</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleValidateChain}
              className={`btn-secondary flex items-center gap-2 ${chainValid === true ? 'bg-green-100 border-green-200 text-green-700' : ''}`}
              disabled={validating}
            >
              <div className={`icon-shield ${validating ? 'animate-spin' : ''}`}></div>
              <span>{validating ? 'Verifying...' : chainValid === true ? 'Chain Valid ✅' : chainValid === false ? 'Chain Corrupt ❌' : 'Verify Ledger'}</span>
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
              <div className="icon-plus text-lg"></div>
              <span>Mint New Batch</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Active Batches */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {batches.length === 0 ? (
              <div className="col-span-3 py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <div className="text-4xl mb-2">⛓️</div>
                <p>Blockchain is empty. Mint a new batch to start the chain.</p>
              </div>
            ) : batches.map(batch => (
              <div key={batch.id} className="card cursor-pointer hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-[var(--primary-color)] relative overflow-hidden" onClick={() => setSelectedBatch(batch)}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-[var(--primary-color)]">{batch.id}</h3>
                    <p className="text-base font-medium text-[var(--text-primary)] mt-1">{batch.crop}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-mono bg-gray-100 rounded text-gray-500 truncate max-w-[80px]">#{batch.blockIndex}</span>
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
                    <div className="icon-clock text-sm text-[var(--text-secondary)]"></div>
                    <span className="text-xs truncate">{batch.blockchainHash.substr(0, 16)}...</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); generateQR(batch.id); }} className="flex-1 px-3 py-2 bg-[var(--primary-color)] text-white rounded-lg text-sm flex items-center justify-center gap-2">
                    <div className="icon-qr-code"></div> QR
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Live Feed sidebar */}
          <div className="card h-full max-h-[600px] overflow-hidden flex flex-col bg-slate-900 text-white border-none">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-400">
              <div className="icon-activity animate-pulse"></div>
              Node Activity Log
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-600">
              {recentBlocks.map((block, idx) => (
                <div key={idx} className="p-3 bg-slate-800 rounded-lg text-xs border-l-2 border-green-500 font-mono">
                  <div className="flex justify-between mb-1 text-gray-400">
                    <span>Block #{block.index}</span>
                    <span>{block.time.toLocaleTimeString()}</span>
                  </div>
                  <div className="text-green-300 truncate mb-1" title={block.hash}>H: {block.hash.substr(0, 20)}...</div>
                  <div className="text-gray-500 truncate" title={block.prevHash}>P: {block.prevHash.substr(0, 20)}...</div>
                  <p className="text-white mt-1 border-t border-slate-700 pt-1">{block.data}</p>
                </div>
              ))}
              <div className="text-xs text-gray-500 text-center mt-4">Legacy Blocks Archived</div>
            </div>
          </div>
        </div>

        {selectedBatch && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Block Details - {selectedBatch.id}</h3>
                <button onClick={() => setSelectedBatch(null)} className="icon-x text-xl"></button>
              </div>

              <div className="mb-6 p-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg text-white font-mono text-sm">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">CURRENT HASH (SHA-256)</p>
                    <p className="text-green-400 break-all">{selectedBatch.blockchainHash}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">PREVIOUS HASH</p>
                    <p className="text-blue-400 break-all">{selectedBatch.previousHash}</p>
                  </div>
                  <div className="flex justify-between border-t border-slate-700 pt-3 mt-1">
                    <div>
                      <p className="text-gray-400 text-xs">BLOCK INDEX</p>
                      <p className="font-bold">#{selectedBatch.blockIndex}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">TIMESTAMP</p>
                      <p>{formatDate(selectedBatch.timestamp)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pl-8">
                {selectedBatch.stages.map((stage, idx) => (
                  <div key={idx} className="mb-8 relative transition-all duration-500">
                    <div className={`absolute left-[-32px] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 ${stage.verified ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`icon-${stage.verified ? 'check' : 'clock'} text-white text-xl`}></div>
                    </div>
                    {idx < selectedBatch.stages.length - 1 && (
                      <div className={`absolute left-[-26px] top-12 w-1 h-full transition-colors duration-500 ${stage.verified && selectedBatch.stages[idx + 1].verified ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    )}
                    <div className={`p-5 rounded-xl shadow-md border-l-4 transition-all duration-500 ${stage.verified ? 'bg-white border-green-500' : 'bg-white border-gray-300 opacity-70'}`}>
                      <h4 className="font-bold text-lg">{stage.stage}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">{formatDate(stage.date)}</p>
                      {stage.notes && <p className="text-sm italic mt-1">"{stage.notes}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h4 className="font-bold mb-4">Batch Metadata</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Crop</span> <span className="font-bold">{selectedBatch.crop}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Farmer</span> <span className="font-bold">{selectedBatch.farmer}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Location</span> <span className="font-bold">{selectedBatch.location}</span></div>
                <div className="mt-4 pt-4 border-t">
                  <button onClick={() => generateQR(selectedBatch.id)} className="btn-primary w-full flex items-center justify-center gap-2">
                    <div className="icon-qr-code"></div> Generate QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowAddModal(false)}>
            <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-semibold mb-4">Mint New Batch</h3>
              <p className="text-xs text-gray-500 mb-4">This will generate a new block and append it to the chain.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Crop Type</label>
                  <select value={newBatch.crop} onChange={(e) => setNewBatch({ ...newBatch, crop: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                    {window.INDIAN_OILSEEDS ? window.INDIAN_OILSEEDS.map(c => <option key={c} value={c}>{c}</option>) : <option>Mustard</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity (MT)</label>
                  <input type="number" value={newBatch.quantity} onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input type="text" value={newBatch.location} onChange={(e) => setNewBatch({ ...newBatch, location: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={createBatch} className="flex-1 btn-primary">Mint Block</button>
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
              <p className="text-sm text-[var(--text-secondary)] mb-4">Scan to verify on AgriSync Blockchain</p>
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