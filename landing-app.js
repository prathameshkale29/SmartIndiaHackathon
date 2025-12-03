function LandingPage() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
              <div className="icon-leaf text-xl text-white"></div>
            </div>
            <span className="text-xl font-bold text-[var(--primary-color)]">Agri-Sync</span>
          </div>
          <div className="hidden md:flex gap-6">
            <button onClick={() => scrollToSection('features')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]">Features</button>
            <button onClick={() => scrollToSection('impact')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]">Impact</button>
            <button onClick={() => scrollToSection('team')} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]">Team</button>
          </div>
          <button onClick={() => window.location.href = 'index.html'} className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-lg hover:opacity-90">
            Get Started
          </button>
        </div>
      </nav>
      
      <div className="pt-16">
        <LandingHero />
        <FeatureShowcase />
        <ImpactMetrics />
        <TeamSection />
        
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm">© 2025 Agri-Sync. Empowering farmers, transforming agriculture.</p>
            <p className="text-xs text-gray-400 mt-2">Built for Smart India Hackathon 2025</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LandingPage />);