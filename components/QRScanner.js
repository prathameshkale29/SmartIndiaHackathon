function QRScanner({ onScan, onClose }) {
  try {
    const [scanning, setScanning] = React.useState(false);

    const startScan = () => {
      setScanning(true);
      setTimeout(() => {
        const mockBatchId = 'BTC001';
        onScan(mockBatchId);
        setScanning(false);
      }, 2000);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Scan QR Code</h3>
            <button onClick={onClose} className="text-[var(--text-secondary)]">
              <div className="icon-x text-xl"></div>
            </button>
          </div>
          <div className="bg-[var(--bg-light)] rounded-lg p-8 text-center">
            {scanning ? (
              <div className="flex flex-col items-center gap-4">
                <div className="icon-loader text-6xl text-[var(--primary-color)] animate-spin"></div>
                <p className="text-[var(--text-secondary)]">Scanning...</p>
              </div>
            ) : (
              <button onClick={startScan} className="btn-primary">
                <div className="icon-camera text-lg"></div>
                <span>Start Scanning</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('QRScanner error:', error);
    return null;
  }
}