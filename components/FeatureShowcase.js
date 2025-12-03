function FeatureShowcase() {
  const features = [
    { icon: 'bot', title: 'AI Chat Advisor', desc: 'Get instant farming advice powered by AI' },
    { icon: 'link', title: 'Blockchain Traceability', desc: 'Track produce from farm to fork' },
    { icon: 'trending-up', title: 'Market Analytics', desc: 'Real-time prices and predictions' },
    { icon: 'file-check', title: 'Digital Contracts', desc: 'Guaranteed price agreements' },
    { icon: 'database', title: 'Agri-Stack Integration', desc: 'Connected to government databases' },
    { icon: 'truck', title: 'Smart Logistics', desc: 'Real-time shipment tracking' },
    { icon: 'cloud-sun', title: 'Weather Forecast', desc: '5-day predictions with advisories' },
    { icon: 'calculator', title: 'Financial Tools', desc: 'ROI calculator and cost analysis' }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Comprehensive Features</h2>
          <p className="text-xl text-[var(--text-secondary)]">Everything farmers need in one platform</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="text-center p-6 rounded-lg hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className={`icon-${feature.icon} text-3xl text-green-600`}></div>
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}