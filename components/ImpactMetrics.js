function ImpactMetrics() {
  const metrics = [
    { value: '12,450+', label: 'Farmers Empowered', icon: 'users', color: 'green' },
    { value: '35%', label: 'Income Increased', icon: 'trending-up', color: 'blue' },
    { value: '85,200 MT', label: 'Crops Tracked', icon: 'package', color: 'amber' },
    { value: '₹42 Cr', label: 'Transaction Value', icon: 'indian-rupee', color: 'purple' }
  ];

  return (
    <section id="impact" className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Social Impact</h2>
          <p className="text-xl opacity-90">Transforming lives, one farmer at a time</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {metrics.map((metric, idx) => (
            <div key={idx} className="text-center">
              <div className={`w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <div className={`icon-${metric.icon} text-4xl`}></div>
              </div>
              <p className="text-4xl font-bold mb-2">{metric.value}</p>
              <p className="text-lg opacity-90">{metric.label}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-white bg-opacity-10 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4 text-center">Success Stories</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <p className="italic mb-4">"Agri-Sync helped me get 20% better prices through blockchain verification and direct contracts."</p>
              <p className="font-bold">- Ramesh Kumar, Wardha</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <p className="italic mb-4">"The AI advisor saved my crop from disease. I increased my yield by 30% this season."</p>
              <p className="font-bold">- Suresh Patel, Indore</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <p className="italic mb-4">"Real-time market prices and weather forecasts help me make better decisions daily."</p>
              <p className="font-bold">- Prakash Reddy, Guntur</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}