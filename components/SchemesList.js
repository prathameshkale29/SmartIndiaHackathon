
function SchemesList() {
  try {
    const schemes = [
      {
        name: 'PM-KUSUM (Solar Pump Scheme)',
        category: 'Energy',
        description: 'Financial support for solar pump installation and grid-connected solar power plants',
        subsidy: 'Up to 60% subsidy',
        eligibility: 'All farmers',
        status: 'Active',
        applyUrl: 'https://pmkusum.mnre.gov.in/',
        learnMoreUrl: 'https://www.india.gov.in/pm-kusum-pradhan-mantri-kisan-urja-suraksha-evam-utthan-mahabhiyan'
      },
      {
        name: 'National Mission on Oilseeds and Oil Palm (NMOOP)',
        category: 'Production',
        description: 'Technology promotion, seed distribution, and support for oilseed cultivation',
        subsidy: 'Varies by component',
        eligibility: 'Oilseed farmers',
        status: 'Active',
        applyUrl: 'https://nmoop.gov.in/',
        learnMoreUrl: 'https://nmoop.gov.in/'
      },
      {
        name: 'PM Fasal Bima Yojana',
        category: 'Insurance',
        description: 'Crop insurance scheme providing financial support against crop loss',
        subsidy: 'Subsidised premium',
        eligibility: 'Eligible notified crops and areas',
        status: 'Active',
        applyUrl: 'https://pmfby.gov.in/',
        learnMoreUrl: 'https://pmfby.gov.in/'
      },
      {
        name: 'PM-KISAN',
        category: 'Income Support',
        description: 'Direct income support of ₹6,000 per year to eligible farmer families',
        subsidy: '₹6,000 per year in 3 instalments',
        eligibility: 'Small and marginal farmers meeting scheme criteria',
        status: 'Active',
        applyUrl: 'https://pmkisan.gov.in/',
        learnMoreUrl: 'https://pmkisan.gov.in/'
      },
      {
        name: 'Soil Health Card Scheme',
        category: 'Advisory',
        description: 'Free soil testing and nutrient management advice to improve productivity',
        subsidy: 'Free soil testing service',
        eligibility: 'All farmers',
        status: 'Active',
        applyUrl: 'https://www.soilhealth.dac.gov.in/',
        learnMoreUrl: 'https://www.india.gov.in/soil-health-card-scheme'
      }
    ];

    const handleApply = (scheme) => {
      if (scheme.applyUrl) {
        window.open(scheme.applyUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert('Online application link not available. Please contact your local agriculture office.');
      }
    };

    const handleLearnMore = (scheme) => {
      if (scheme.learnMoreUrl) {
        window.open(scheme.learnMoreUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert('Learn more link not available right now.');
      }
    };

    return (
      <div className="space-y-4" data-name="schemes-list" data-file="components/SchemesList.js">
        <h1 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">
          {t ? t('governmentSchemes') || 'Government Schemes' : 'Government Schemes'}
        </h1>
        {schemes.map((scheme, idx) => (
          <div key={idx} className="card hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{scheme.name}</h3>
                  {scheme.category && (
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                      {scheme.category}
                    </span>
                  )}
                </div>
                <p className="text-[var(--text-secondary)] text-sm mb-2">
                  {scheme.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-2">
                  <div>
                    <p className="text-[var(--text-secondary)]">Subsidy/Benefit</p>
                    <p className="font-semibold text-emerald-600">{scheme.subsidy}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Eligibility</p>
                    <p className="font-semibold">{scheme.eligibility}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {scheme.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 mt-4">
              <button
                className="btn-primary flex-1"
                onClick={() => handleApply(scheme)}
              >
                {t ? t('applyNow') || 'Apply Now' : 'Apply Now'}
              </button>
              <button
                className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all"
                onClick={() => handleLearnMore(scheme)}
              >
                {t ? t('learnMore') || 'Learn More' : 'Learn More'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('SchemesList component error:', error);
    return null;
  }
}
