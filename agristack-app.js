function AgriStackApp() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    initTheme();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = 'index.html';
    }
    setUser(currentUser);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <header className="bg-[var(--bg-white)] border-b border-[var(--border-color)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.href = 'index.html'} className="text-[var(--text-secondary)] hover:text-[var(--primary-color)]">
              <div className="icon-arrow-left text-xl"></div>
            </button>
            <h1 className="text-xl font-bold">Agri-Stack Integration</h1>
          </div>
        </div>
      </header>
      <main className="p-6">
        <AgriStackDashboard user={user} />
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AgriStackApp />);