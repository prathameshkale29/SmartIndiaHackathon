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

  return (
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
      
      <button className="w-full btn-primary">Place Bid</button>
    </div>
  );
}