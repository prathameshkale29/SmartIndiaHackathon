function FinancePage() {
    const [activeTab, setActiveTab] = React.useState('loans');
    const [loanAmount, setLoanAmount] = React.useState(100000);
    const [tenure, setTenure] = React.useState(12);

    const calculateEMI = () => {
        const rate = 7; // 7% annual interest
        const monthlyRate = rate / 12 / 100;
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
        return Math.round(emi);
    };

    return (
        <div className="animate-circular-reveal" data-name="finance-page">
            <h1 className="text-3xl font-bold mb-2">Financial Services</h1>
            <p className="text-[var(--text-secondary)] mb-6">Credit, Insurance, and Subsidy Management</p>

            <div className="flex gap-4 border-b border-[var(--border-color)] mb-6">
                <button
                    onClick={() => setActiveTab('loans')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'loans'
                        ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    Loans & Credit
                </button>
                <button
                    onClick={() => setActiveTab('insurance')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'insurance'
                        ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    Crop Insurance
                </button>
                <button
                    onClick={() => setActiveTab('subsidies')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'subsidies'
                        ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    Subsidies
                </button>
            </div>

            {activeTab === 'loans' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Loan Eligibility Calculator</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Loan Amount: ₹{loanAmount.toLocaleString()}</label>
                                <input
                                    type="range"
                                    min="10000"
                                    max="500000"
                                    step="10000"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="w-full accent-[var(--primary-color)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Tenure: {tenure} months</label>
                                <input
                                    type="range"
                                    min="6"
                                    max="60"
                                    step="6"
                                    value={tenure}
                                    onChange={(e) => setTenure(Number(e.target.value))}
                                    className="w-full accent-[var(--primary-color)]"
                                />
                            </div>
                            <div className="p-4 bg-[var(--bg-light)] rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span>Interest Rate</span>
                                    <span className="font-semibold">7% (KCC)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Estimated EMI</span>
                                    <span className="text-2xl font-bold text-[var(--primary-color)]">₹{calculateEMI().toLocaleString()}</span>
                                </div>
                            </div>
                            <button onClick={() => window.open('https://www.jansamarth.in/check-eligibility', '_blank')} className="btn-primary w-full">Check Eligibility (JanSamarth)</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="card border-l-4 border-l-blue-500">
                            <h3 className="text-lg font-semibold mb-2">Kisan Credit Card (KCC)</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                Get instant credit for agricultural needs. Interest subvention of 3% for prompt repayment.
                            </p>
                            <button onClick={() => window.open('https://www.myscheme.gov.in/schemes/kcc', '_blank')} className="text-blue-600 font-medium hover:underline">Apply Now →</button>
                        </div>
                        <div className="card border-l-4 border-l-purple-500">
                            <h3 className="text-lg font-semibold mb-2">Farm Mechanization Loan</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                Financing for tractors, harvesters, and other farm equipment. 85% reduced collateral.
                            </p>
                            <button onClick={() => window.open('https://agrimachinery.nic.in/', '_blank')} className="text-purple-600 font-medium hover:underline">Apply Now →</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'insurance' && (
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">PM Fasal Bima Yojana (PMFBY)</h3>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active Policy</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="p-4 bg-[var(--bg-light)] rounded-lg">
                            <p className="text-xs text-[var(--text-secondary)] mb-1">Policy Number</p>
                            <p className="font-semibold">PMFBY-MH-2024-8921</p>
                        </div>
                        <div className="p-4 bg-[var(--bg-light)] rounded-lg">
                            <p className="text-xs text-[var(--text-secondary)] mb-1">Coverage Amount</p>
                            <p className="font-semibold">₹2,50,000</p>
                        </div>
                        <div className="p-4 bg-[var(--bg-light)] rounded-lg">
                            <p className="text-xs text-[var(--text-secondary)] mb-1">Premium Paid</p>
                            <p className="font-semibold">₹5,000</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-3">Recent Claims</h4>
                        <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-[var(--bg-light)] border-b border-[var(--border-color)]">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">Reason</th>
                                        <th className="px-4 py-2 text-left">Amount</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-[var(--border-color)] last:border-0">
                                        <td className="px-4 py-3">15 Aug 2024</td>
                                        <td className="px-4 py-3">Heavy Rainfall Damage</td>
                                        <td className="px-4 py-3">₹45,000</td>
                                        <td className="px-4 py-3"><span className="text-amber-600 font-medium">Processing</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'subsidies' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--primary-color)]">PM-KISAN</h3>
                                <p className="text-xs text-[var(--text-secondary)]">Income Support Scheme</p>
                            </div>
                            <div className="icon-check-circle text-2xl text-green-500"></div>
                        </div>
                        <div className="mb-4">
                            <p className="text-2xl font-bold">₹6,000 <span className="text-sm font-normal text-[var(--text-secondary)]">/ year</span></p>
                            <p className="text-sm text-green-600 mt-1">Next installment due: Dec 2024</p>
                        </div>
                        <button className="w-full py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)]">View Payment History</button>
                    </div>

                    <div className="card">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--primary-color)]">NMEO-OP</h3>
                                <p className="text-xs text-[var(--text-secondary)]">National Mission on Edible Oils</p>
                            </div>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">New</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                            Get up to 50% subsidy on high-yielding seed varieties and inputs for oilseed cultivation.
                        </p>
                        <button onClick={() => window.open('https://nmoop.gov.in/', '_blank')} className="btn-primary w-full text-sm">Check Eligibility</button>
                    </div>
                </div>
            )}
        </div>
    );
}
