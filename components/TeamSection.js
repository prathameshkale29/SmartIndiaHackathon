function TeamSection() {
  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Our Team</h2>
          <p className="text-xl text-[var(--text-secondary)]">Passionate about transforming Indian agriculture</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="icon-users text-6xl text-white"></div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Built for Smart India Hackathon 2025</h3>
            <p className="text-[var(--text-secondary)]">Team committed to solving real agricultural challenges</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="icon-target text-4xl text-green-600 mb-3"></div>
              <h4 className="font-bold mb-2">Our Mission</h4>
              <p className="text-sm text-[var(--text-secondary)]">Empower farmers with technology and increase their income by 50%</p>
            </div>
            <div className="text-center">
              <div className="icon-eye text-4xl text-blue-600 mb-3"></div>
              <h4 className="font-bold mb-2">Our Vision</h4>
              <p className="text-sm text-[var(--text-secondary)]">Make India self-reliant in oilseed production through digital transformation</p>
            </div>
            <div className="text-center">
              <div className="icon-heart text-4xl text-red-600 mb-3"></div>
              <h4 className="font-bold mb-2">Our Values</h4>
              <p className="text-sm text-[var(--text-secondary)]">Farmer-first approach, innovation, transparency, and sustainability</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}