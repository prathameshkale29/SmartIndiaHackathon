function Settings({ onClose }) {
  try {
      const [theme, setThemeState] = React.useState(getTheme());
    const [language, setLanguageState] = React.useState(getLanguage());

    const handleThemeChange = (newTheme) => {
      setThemeState(newTheme);
      toggleTheme(newTheme);
    };

    const handleLanguageChange = (newLang) => {
      setLanguageState(newLang);
      setLanguage(newLang);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="bg-[var(--bg-white)] rounded-lg shadow-2xl w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
            <h3 className="text-xl font-semibold">{t('settings')}</h3>
            <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <div className="icon-x text-xl"></div>
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-medium mb-3">{t('theme')}</h4>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${theme === 'light' ? 'border-[var(--primary-color)] bg-[var(--secondary-color)] bg-opacity-20' : 'border-[var(--border-color)]'}`}
                >
                  <div className="icon-sun text-2xl text-amber-500"></div>
                  <span>{t('light')}</span>
                </button>
                <button 
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${theme === 'dark' ? 'border-[var(--primary-color)] bg-[var(--secondary-color)] bg-opacity-20' : 'border-[var(--border-color)]'}`}
                >
                  <div className="icon-moon text-2xl text-indigo-600"></div>
                  <span>{t('dark')}</span>
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">{t('language')}</h4>
              <select 
                value={language} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-white)] text-[var(--text-primary)]"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)]">
              <button onClick={onClose} className="w-full btn-primary">
                {t('saveChanges')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Settings error:', error);
    return null;
  }
}