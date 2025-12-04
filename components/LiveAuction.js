// Enhanced LiveAuction with Place Bid functionality
function LiveAuction() {
  const [auction] = React.useState({
    crop: 'Mustard Seeds',
    quantity: '50 MT',
    basePrice: 6000,
    currentBid: 6250,
    bidders: 12,
    timeLeft: '2h 15m',
    status: 'active'
  });

  const [showBidModal, setShowBidModal] = React.useState(false);
  const toast = useToast();

  const handlePlaceBid = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bidAmount = parseFloat(formData.get('bidAmount'));

    if (bidAmount <= auction.currentBid) {
      toast.error(`Bid must be higher than current bid of ₹${auction.currentBid}`);
      return;
    }

    toast.success(`Bid placed successfully! Your bid: ₹${bidAmount}/Qt`);
    setShowBidModal(false);
    e.target.reset();
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 dark:bg-opacity-20 rounded-lg">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Current Highest Bid</p>
            <p className="text-3xl font-bold text-[var(--primary-color)]">₹{auction.currentBid}/Qt</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{auction.bidders} active bidders</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
              <div className="icon-clock text-2xl text-amber-600"></div>
            </div>
            <p className="text-sm font-medium">{auction.timeLeft}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-[var(--text-secondary)]">Base Price</p>
            <p className="font-bold">₹{auction.basePrice}/Qt</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-[var(--text-secondary)]">Quantity</p>
            <p className="font-bold">{auction.quantity}</p>
          </div>
        </div>

        <button onClick={() => setShowBidModal(true)} className="w-full btn-primary flex items-center justify-center gap-2">
          <div className="icon-gavel"></div>
          <span>Place Bid</span>
        </button>
      </div>

      {/* Place Bid Modal */}
      <ModalDialog
        isOpen={showBidModal}
        onClose={() => setShowBidModal(false)}
        title="Place Your Bid"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowBidModal(false)}
              className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="place-bid-form"
              className="btn-primary"
            >
              Confirm Bid
            </button>
          </>
        }
      >
        <form id="place-bid-form" onSubmit={handlePlaceBid} className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[var(--text-secondary)]">Current Bid:</span>
              <span className="text-lg font-bold text-[var(--primary-color)]">₹{auction.currentBid}/Qt</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text-secondary)]">Quantity:</span>
              <span className="font-medium">{auction.quantity}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Your Bid Amount (₹/Qt) *
            </label>
            <input
              type="number"
              name="bidAmount"
              required
              min={auction.currentBid + 1}
              step="1"
              placeholder={`Minimum: ₹${auction.currentBid + 1}`}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Must be higher than current bid
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="icon-info text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"></div>
              <p className="text-xs text-[var(--text-secondary)]">
                By placing this bid, you agree to purchase the specified quantity at your bid price if you win the auction.
              </p>
            </div>
          </div>
        </form>
      </ModalDialog>
    </>
  );
}