function LandingHero() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-6">
              Empowering Farmers with <span className="text-[var(--primary-color)]">AI Technology</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              Transform your farming with blockchain traceability, AI advisors, real-time market insights, and digital contracts.
            </p>
            <div className="flex gap-4">
              <button onClick={() => window.location.href = 'index.html'} className="bg-[var(--primary-color)] text-white px-8 py-4 rounded-lg text-lg hover:opacity-90 flex items-center gap-2">
                <span>Start Now</span>
                <div className="icon-arrow-right text-xl"></div>
              </button>
              <button className="border-2 border-[var(--primary-color)] text-[var(--primary-color)] px-8 py-4 rounded-lg text-lg hover:bg-green-50">
                Watch Demo
              </button>
            </div>
          </div>
          
          <div className="relative animate-float">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="icon-users text-3xl text-green-600 mb-2"></div>
                  <p className="text-2xl font-bold">12,450+</p>
                  <p className="text-sm text-gray-600">Farmers</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="icon-trending-up text-3xl text-blue-600 mb-2"></div>
                  <p className="text-2xl font-bold">85,200 MT</p>
                  <p className="text-sm text-gray-600">Production</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="icon-indian-rupee text-3xl text-amber-600 mb-2"></div>
                  <p className="text-2xl font-bold">₹5,800</p>
                  <p className="text-sm text-gray-600">Avg Price</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="icon-warehouse text-3xl text-purple-600 mb-2"></div>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-gray-600">Warehouses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}