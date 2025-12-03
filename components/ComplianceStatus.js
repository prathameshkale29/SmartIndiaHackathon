function ComplianceStatus() {
  try {
    const user = getCurrentUser();
    const isAdmin = user?.role === 'admin';
    const complianceData = isAdmin ? mockData.adminCompliance : mockData.userCompliance;

    return (
      <div className="card" data-name="compliance-status" data-file="components/ComplianceStatus.js">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t('complianceStatus')}</h3>
          <div className="icon-map-pin text-xl text-[var(--text-secondary)]"></div>
        </div>
        
        {isAdmin ? (
          <div className="space-y-3">
            <div className="text-sm text-[var(--text-secondary)] mb-3">
              Regional compliance overview
            </div>
            {complianceData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-light)] rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.region}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{item.farmers} farmers</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'compliant' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'compliant' ? '✓ Compliant' : '✗ Non-Compliant'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
          <div className={`p-4 rounded-lg border-2 ${
            complianceData.status === 'compliant' 
              ? 'border-green-500 bg-green-100 dark:bg-green-900 dark:bg-opacity-20' 
              : 'border-red-500 bg-red-100 dark:bg-red-900 dark:bg-opacity-20'
          }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  complianceData.status === 'compliant' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  <div className={`text-xl text-white ${
                    complianceData.status === 'compliant' ? 'icon-check' : 'icon-x'
                  }`}></div>
                </div>
                <div>
                  <p className="font-semibold">
                    {complianceData.status === 'compliant' ? 'Compliant' : 'Non-Compliant'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{complianceData.zone}</p>
                </div>
              </div>
              <p className="text-sm">{complianceData.message}</p>
            </div>
            <div className="text-xs text-[var(--text-secondary)] space-y-1">
              <p><strong>Location:</strong> {complianceData.location}</p>
              <p><strong>Current Crop:</strong> {complianceData.currentCrop}</p>
              <p><strong>Policy Zone:</strong> {complianceData.zone}</p>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('ComplianceStatus component error:', error);
    return null;
  }
}