function ProcurementPage() {
    try {
        const [activeTab, setActiveTab] = React.useState('dashboard');
        const [dashboardStats, setDashboardStats] = React.useState(null);
        const [tenders, setTenders] = React.useState([]);
        const [myBids, setMyBids] = React.useState([]);
        const [analytics, setAnalytics] = React.useState(null);
        const [loading, setLoading] = React.useState(false);
        const [showBidModal, setShowBidModal] = React.useState(false);
        const [selectedTender, setSelectedTender] = React.useState(null);
        const [bidForm, setBidForm] = React.useState({
            bidAmount: '',
            quantity: '',
            deliveryTimeline: '',
            notes: ''
        });

        React.useEffect(() => {
            loadDashboard();
            loadTenders();
            loadMyBids();
            loadAnalytics();
        }, []);

        const loadDashboard = async () => {
            try {
                const res = await fetch('/api/procurement/dashboard');
                const data = await res.json();
                if (data.status === 'ok') {
                    setDashboardStats(data.data);
                }
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            }
        };

        const loadTenders = async () => {
            try {
                const res = await fetch('/api/procurement/tenders');
                const data = await res.json();
                if (data.status === 'ok') {
                    setTenders(data.data);
                }
            } catch (err) {
                console.error('Failed to load tenders:', err);
            }
        };

        const loadMyBids = async () => {
            try {
                const res = await fetch('/api/procurement/bids');
                const data = await res.json();
                if (data.status === 'ok') {
                    setMyBids(data.data);
                }
            } catch (err) {
                console.error('Failed to load bids:', err);
            }
        };

        const loadAnalytics = async () => {
            try {
                const res = await fetch('/api/procurement/analytics');
                const data = await res.json();
                if (data.status === 'ok') {
                    setAnalytics(data.data);
                }
            } catch (err) {
                console.error('Failed to load analytics:', err);
            }
        };

        const handlePlaceBid = (tender) => {
            setSelectedTender(tender);
            setBidForm({
                bidAmount: '',
                quantity: tender.quantity,
                deliveryTimeline: '30',
                notes: ''
            });
            setShowBidModal(true);
        };

        const submitBid = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/procurement/bids', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tenderId: selectedTender.id,
                        bidAmount: parseFloat(bidForm.bidAmount),
                        quantity: parseFloat(bidForm.quantity),
                        deliveryTimeline: parseInt(bidForm.deliveryTimeline),
                        notes: bidForm.notes
                    })
                });

                const data = await res.json();
                if (data.status === 'ok') {
                    alert('Bid submitted successfully!');
                    setShowBidModal(false);
                    loadMyBids();
                    loadDashboard();
                } else {
                    alert('Failed to submit bid: ' + data.error);
                }
            } catch (err) {
                console.error('Bid submission error:', err);
                alert('Failed to submit bid');
            } finally {
                setLoading(false);
            }
        };

        const openSarthiPortal = () => {
            window.open('https://eprocure.gov.in', '_blank');
        };

        const formatCurrency = (amount) => {
            return '₹' + amount.toLocaleString('en-IN');
        };

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        const getDaysRemaining = (closingDate) => {
            const today = new Date();
            const closing = new Date(closingDate);
            const diffTime = closing - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        };

        return (
            <div className="p-6 max-w-7xl mx-auto" data-name="procurement-page">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Government Procurement</h1>
                            <p className="text-[var(--text-secondary)] mt-1">Access government tenders and participate in e-procurement</p>
                        </div>
                        <button onClick={openSarthiPortal} className="btn-primary flex items-center gap-2">
                            <div className="icon-external-link text-lg"></div>
                            <span>Visit Sarthi Portal</span>
                        </button>
                    </div>

                    <div className="flex gap-4 border-b border-[var(--border-color)]">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'dashboard'
                                ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('tenders')}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'tenders'
                                ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Available Tenders
                        </button>
                        <button
                            onClick={() => setActiveTab('mybids')}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'mybids'
                                ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            My Bids
                        </button>
                        <button
                            onClick={() => setActiveTab('guidelines')}
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'guidelines'
                                ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Guidelines
                        </button>
                    </div>
                </div>

                {activeTab === 'dashboard' && dashboardStats && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Total Tenders</p>
                                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{dashboardStats.totalTenders}</p>
                                    </div>
                                    <div className="icon-file-text text-4xl text-blue-500"></div>
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-700 dark:text-green-300 mb-1">Active Tenders</p>
                                        <p className="text-3xl font-bold text-green-900 dark:text-green-100">{dashboardStats.activeTenders}</p>
                                    </div>
                                    <div className="icon-check-circle text-4xl text-green-500"></div>
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 border-amber-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">Closing Soon</p>
                                        <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{dashboardStats.closingSoon}</p>
                                    </div>
                                    <div className="icon-clock text-4xl text-amber-500"></div>
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">My Bids</p>
                                        <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{dashboardStats.myBids}</p>
                                    </div>
                                    <div className="icon-trending-up text-4xl text-purple-500"></div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="card">
                                <h3 className="text-lg font-semibold mb-4">Total Procurement Value</h3>
                                <p className="text-4xl font-bold text-[var(--primary-color)] mb-2">
                                    {formatCurrency(dashboardStats.totalValue)}
                                </p>
                                <p className="text-sm text-[var(--text-secondary)]">Across all active tenders</p>
                            </div>

                            <div className="card">
                                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {dashboardStats.recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-[var(--bg-light)] rounded-lg">
                                            <div className={`icon-${activity.type === 'tender' ? 'file-text' : 'trending-up'} text-xl text-[var(--primary-color)]`}></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{activity.message}</p>
                                                <p className="text-xs text-[var(--text-secondary)]">{formatDate(activity.date)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {analytics && (
                            <div className="card">
                                <h3 className="text-lg font-semibold mb-4">Procurement Analytics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-2">Tenders by Status</p>
                                        <div className="space-y-2">
                                            {Object.entries(analytics.tendersByStatus).map(([status, count]) => (
                                                <div key={status} className="flex items-center justify-between">
                                                    <span className="text-sm">{status}</span>
                                                    <span className="font-semibold">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-2">Average Bid Value</p>
                                        <p className="text-2xl font-bold text-[var(--primary-color)]">
                                            {formatCurrency(analytics.averageBidValue)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-2">Monthly Trends</p>
                                        <div className="space-y-1">
                                            {analytics.monthlyTrends.slice(-3).map((trend, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-sm">
                                                    <span>{trend.month}</span>
                                                    <span className="font-medium">{trend.tenders} tenders, {trend.bids} bids</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'tenders' && (
                    <div className="space-y-4">
                        {tenders.map(tender => {
                            const daysRemaining = getDaysRemaining(tender.closingDate);
                            return (
                                <div key={tender.id} className="card hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-[var(--text-primary)]">{tender.title}</h3>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${tender.status === 'Open' ? 'bg-green-100 text-green-700' :
                                                    tender.status === 'Closing Soon' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {tender.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] mb-1">
                                                <span className="font-medium">Organization:</span> {tender.organization}
                                            </p>
                                            <p className="text-sm text-[var(--text-secondary)]">{tender.description}</p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-2xl font-bold text-[var(--primary-color)]">{formatCurrency(tender.estimatedValue)}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">Estimated Value</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-[var(--bg-light)] rounded-lg">
                                        <div>
                                            <p className="text-xs text-[var(--text-secondary)] mb-1">Tender ID</p>
                                            <p className="font-semibold">{tender.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--text-secondary)] mb-1">Quantity</p>
                                            <p className="font-semibold">{tender.quantity} {tender.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--text-secondary)] mb-1">Location</p>
                                            <p className="font-semibold">{tender.location}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--text-secondary)] mb-1">Bids Received</p>
                                            <p className="font-semibold">{tender.bidCount}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Specifications:</p>
                                        <div className="text-sm text-[var(--text-secondary)]">
                                            {Object.entries(tender.specifications).map(([key, value]) => (
                                                <span key={key} className="mr-4">{key}: {value}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                                        <div className="flex items-center gap-2">
                                            <div className={`icon-clock text-lg ${daysRemaining <= 5 ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}></div>
                                            <span className={`text-sm font-medium ${daysRemaining <= 5 ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}>
                                                {daysRemaining} days remaining (Closes: {formatDate(tender.closingDate)})
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all text-sm">
                                                View Details
                                            </button>
                                            <button onClick={() => handlePlaceBid(tender)} className="btn-primary text-sm">
                                                Place Bid
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'mybids' && (
                    <div className="space-y-4">
                        {myBids.length > 0 ? (
                            myBids.map(bid => (
                                <div key={bid.id} className="card">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{bid.tenderTitle}</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-[var(--text-secondary)] mb-1">Bid ID</p>
                                                    <p className="font-semibold">{bid.id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[var(--text-secondary)] mb-1">Bid Amount</p>
                                                    <p className="font-semibold text-[var(--primary-color)]">{formatCurrency(bid.bidAmount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[var(--text-secondary)] mb-1">Quantity</p>
                                                    <p className="font-semibold">{bid.quantity} {bid.unit}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[var(--text-secondary)] mb-1">Submitted On</p>
                                                    <p className="font-semibold">{formatDate(bid.bidDate)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700 ml-4">
                                            {bid.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card text-center py-12">
                                <div className="icon-inbox text-6xl text-[var(--text-secondary)] mb-4"></div>
                                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Bids Yet</h3>
                                <p className="text-[var(--text-secondary)] mb-4">You haven't placed any bids on government tenders</p>
                                <button onClick={() => setActiveTab('tenders')} className="btn-primary">
                                    Browse Tenders
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'guidelines' && (
                    <div className="card">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Procurement Guidelines</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Eligibility Criteria</h3>
                                <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
                                    <li>Valid farmer registration with FPO or cooperative</li>
                                    <li>Minimum production capacity as specified in tender</li>
                                    <li>Quality certifications (FSSAI, Agmark, etc.)</li>
                                    <li>Bank account and PAN card for payment processing</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Bidding Process</h3>
                                <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
                                    <li>Register on the Sarthi e-Procurement portal</li>
                                    <li>Browse available tenders matching your produce</li>
                                    <li>Download tender documents and review specifications</li>
                                    <li>Submit bid with required documents before closing date</li>
                                    <li>Await evaluation and award notification</li>
                                </ol>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Required Documents</h3>
                                <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
                                    <li>Farmer ID / FPO Registration Certificate</li>
                                    <li>Land ownership or lease documents</li>
                                    <li>Quality test certificates</li>
                                    <li>Bank account details and cancelled cheque</li>
                                    <li>PAN card and Aadhaar card</li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-3">
                                    <div className="icon-info text-2xl text-blue-600"></div>
                                    <div>
                                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Important Note</h4>
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            All government procurement follows transparent e-procurement processes. Ensure all documents are authentic and meet quality standards. For detailed guidelines, visit the official Sarthi portal.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showBidModal && selectedTender && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowBidModal(false)}>
                        <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-semibold mb-4">Place Bid - {selectedTender.title}</h3>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Bid Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={bidForm.bidAmount}
                                        onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })}
                                        className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]"
                                        placeholder="Enter your bid amount"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Quantity ({selectedTender.unit})</label>
                                    <input
                                        type="number"
                                        value={bidForm.quantity}
                                        onChange={(e) => setBidForm({ ...bidForm, quantity: e.target.value })}
                                        className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]"
                                        placeholder="Enter quantity you can supply"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Delivery Timeline (Days)</label>
                                    <input
                                        type="number"
                                        value={bidForm.deliveryTimeline}
                                        onChange={(e) => setBidForm({ ...bidForm, deliveryTimeline: e.target.value })}
                                        className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]"
                                        placeholder="Enter delivery timeline"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Additional Notes</label>
                                    <textarea
                                        value={bidForm.notes}
                                        onChange={(e) => setBidForm({ ...bidForm, notes: e.target.value })}
                                        className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]"
                                        rows="3"
                                        placeholder="Any additional information"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => setShowBidModal(false)} className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)]">
                                    Cancel
                                </button>
                                <button onClick={submitBid} disabled={loading} className="flex-1 btn-primary">
                                    {loading ? 'Submitting...' : 'Submit Bid'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('ProcurementPage error:', error);
        return null;
    }
}
