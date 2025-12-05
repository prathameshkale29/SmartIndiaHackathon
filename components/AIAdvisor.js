function AIAdvisor() {
  try {
    const t = (typeof window !== 'undefined' && window.t) ? window.t : (key => key);

    const [formData, setFormData] = React.useState({
      crop: 'soybean',
      season: 'kharif',
      area: '1',
      unit: 'acre',
      irrigation: 'rainfed',
      district: 'wardha',
      soil: 'medium'
    });
    const [plan, setPlan] = React.useState(null);
    const [showPlanner, setShowPlanner] = React.useState(false); // Collapsible planner
    const [messages, setMessages] = React.useState([
      { role: 'ai', text: 'Hello! I am your AI Agri-Advisor. I can help you with crop planning, pest management, weather alerts, and market trends. How can I assist you today?' }
    ]);
    const [input, setInput] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const messagesEndRef = React.useRef(null);

    const districtOptions = [
      { id: 'wardha', label: 'Wardha' },
      { id: 'nagpur', label: 'Nagpur' },
      { id: 'amravati', label: 'Amravati' },
      { id: 'akola', label: 'Akola' },
      { id: 'yavatmal', label: 'Yavatmal' },
      { id: 'other', label: 'Other district' }
    ];

    const quickChips = [
      { label: '🛰️ Check Crop Health', query: 'Check my crop health via satellite' },
      { label: '⚠️ Weather Alerts', query: 'Any weather alerts for my area?' },
      { label: '💰 Market Prices', query: 'Current market price trends for soybean' },
      { label: '🐛 Pest Control', query: 'How to control pests in groundnut?' },
      { label: '🌱 Sowing Advice', query: 'Best sowing time for mustard' }
    ];

    const handleFormChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const parseAreaToAcre = () => {
      const raw = parseFloat(formData.area || '0');
      if (!isFinite(raw) || raw <= 0) return 1;
      return formData.unit === 'acre' ? raw : raw * 2.47; // approx ha -> acre
    };

    const buildPlan = () => {
      const crop = formData.crop;
      const season = formData.season;
      const irrigation = formData.irrigation;
      const areaAcre = parseAreaToAcre();
      const district = districtOptions.find(d => d.id === formData.district)?.label || 'your area';

      const configs = {
        soybean: {
          name: 'Soybean',
          seasons: {
            kharif: {
              window: 'Mid June to first fortnight of July (with onset of monsoon)',
              varieties: ['JS-335', 'JS-95-60', 'MAUS-71'],
              baseYieldRainfed: 8,
              baseYieldIrrigated: 10
            },
            rabi: {
              window: 'Usually not grown in rabi in central India – prefer kharif season',
              varieties: ['JS-335', 'JS-20-34'],
              baseYieldRainfed: 5,
              baseYieldIrrigated: 7
            }
          },
          fertilizer: {
            n: 20,
            p: 40,
            k: 20,
            organic: '3–4 tons well decomposed FYM/acre at land preparation'
          },
          irrigation: {
            rainfed: [
              'Prefer sowing on conserved moisture just before good rains.',
              'Avoid water logging – provide surface drainage in heavy rains.'
            ],
            irrigated: [
              'Light irrigation at sowing if soil is too dry.',
              'One irrigation at flowering and another at pod filling if rains are irregular.'
            ]
          }
        },
        mustard: {
          name: 'Mustard',
          seasons: {
            rabi: {
              window: 'Mid October to mid November after withdrawal of monsoon',
              varieties: ['Pusa Bold', 'Varuna', 'Pusa Jai Kisan'],
              baseYieldRainfed: 7,
              baseYieldIrrigated: 9
            },
            summer: {
              window: 'Limited area; sowing in late winter where irrigation is assured',
              varieties: ['Pusa Mustard 21', 'Pusa Mustard 25'],
              baseYieldRainfed: 6,
              baseYieldIrrigated: 8
            }
          },
          fertilizer: {
            n: 40,
            p: 20,
            k: 20,
            organic: '2–3 tons FYM/acre for better soil structure'
          },
          irrigation: {
            rainfed: [
              'Sow on stored soil moisture after one pre-sowing tillage.',
              'Rainfed crop depends mostly on residual moisture – conserve moisture with mulch.'
            ],
            irrigated: [
              '1st irrigation: 20–25 days after sowing.',
              '2nd irrigation: at flowering.',
              '3rd irrigation: at pod formation, if needed.'
            ]
          }
        },
        groundnut: {
          name: 'Groundnut',
          seasons: {
            kharif: {
              window: 'First fortnight of June to early July with onset of monsoon',
              varieties: ['JL-24', 'TAG-24', 'GG-2'],
              baseYieldRainfed: 8,
              baseYieldIrrigated: 11
            },
            summer: {
              window: 'Late January to February under assured irrigation',
              varieties: ['JL-24', 'TAG-24'],
              baseYieldRainfed: 0,
              baseYieldIrrigated: 12
            }
          },
          fertilizer: {
            n: 15,
            p: 40,
            k: 20,
            organic: 'Apply 2–3 tons FYM/acre + gypsum at pegging (100–120 kg/acre)'
          },
          irrigation: {
            rainfed: [
              'Ensure sowing on moist seed bed; avoid sowing in very dry soil.',
              'Provide surface drainage in case of heavy continuous rain.'
            ],
            irrigated: [
              '1st irrigation: immediately after sowing if soil is dry.',
              'Next irrigations at flowering and pegging stage; avoid waterlogging.'
            ]
          }
        },
        sunflower: {
          name: 'Sunflower',
          seasons: {
            kharif: {
              window: 'June–July with onset of monsoon',
              varieties: ['Morden', 'SS-56', 'DSFH-17'],
              baseYieldRainfed: 6,
              baseYieldIrrigated: 8
            },
            rabi: {
              window: 'October–November under assured irrigation',
              varieties: ['Morden', 'KBSH-1'],
              baseYieldRainfed: 5,
              baseYieldIrrigated: 8
            }
          },
          fertilizer: {
            n: 30,
            p: 40,
            k: 20,
            organic: '2–3 tons FYM/acre before sowing'
          },
          irrigation: {
            rainfed: [
              'Sow with onset of rains and avoid late sowing.',
              'Keep field weed-free in first 30 days to conserve moisture.'
            ],
            irrigated: [
              '1st irrigation: immediately after sowing, then at flower bud stage and flowering.',
              'Avoid moisture stress during flowering and grain filling.'
            ]
          }
        }
      };

      const cfg = configs[crop];
      const seasonCfg = cfg.seasons[season];

      const isIrrigated = irrigation === 'irrigated';
      const baseYield = isIrrigated
        ? seasonCfg.baseYieldIrrigated || seasonCfg.baseYieldRainfed
        : seasonCfg.baseYieldRainfed || seasonCfg.baseYieldIrrigated;

      // Simple adjustment for soil type
      let yieldFactor = 1;
      if (formData.soil === 'light') yieldFactor = 0.9;
      if (formData.soil === 'heavy') yieldFactor = 1.05;

      const perAcreYield = baseYield * yieldFactor;
      const totalYield = perAcreYield * areaAcre;

      const fert = cfg.fertilizer;
      const perAcreFert = {
        n: fert.n,
        p: fert.p,
        k: fert.k
      };
      const totalFert = {
        n: Math.round(fert.n * areaAcre),
        p: Math.round(fert.p * areaAcre),
        k: Math.round(fert.k * areaAcre)
      };

      const irrigationSchedule = cfg.irrigation[irrigation];

      setPlan({
        cropName: cfg.name,
        season,
        district,
        window: seasonCfg.window,
        varieties: seasonCfg.varieties,
        perAcreYield,
        totalYield,
        perAcreFert,
        totalFert,
        irrigationSchedule,
        areaAcre,
        irrigationType: irrigation
      });
      setShowPlanner(true); // Ensure planner is visible when generated
    };

    const handleGenerate = (e) => {
      e.preventDefault();
      buildPlan();
    };


    const handleSend = async (text = input) => {
      if (!text.trim()) return;
      const userMessage = text.trim();
      setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
      setInput('');
      setLoading(true);
      try {
        const res = await fetch('/api/oilseed-advisor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage })
        });
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'ai', text: data.reply || 'Sorry, I could not understand that.' }]);
      } catch (err) {
        console.error('AI advisor error', err);
        setMessages(prev => [
          ...prev,
          { role: 'ai', text: 'Sorry, there was an error connecting to the advisor. Please try again.' }
        ]);
      }
      setLoading(false);
    };


    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    React.useEffect(() => {
      scrollToBottom();
    }, [messages, loading]);

    return (
      <div className="space-y-4" data-name="ai-advisor" data-file="components/AIAdvisor.js">

        {/* Header with Tools Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="text-3xl">🤖</span> AI Agri-Advisor
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your personal expert for crops, weather, and markets.</p>
          </div>
          <button
            onClick={() => setShowPlanner(!showPlanner)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${showPlanner ? 'bg-green-100 text-green-700' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 hover:bg-gray-50'}`}
          >
            {showPlanner ? 'Hide Planner' : 'Show Sowing Planner'}
          </button>
        </div>

        {/* Collapsible AI Oilseed Planning Module */}
        {showPlanner && (
          <div className="card animate-fade-in border-2 border-green-100 dark:border-green-900">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1 text-green-700 dark:text-green-400">
                  Smart Oilseed Sowing Planner
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Get customized advice on sowing window, varieties, and fertilizers.
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700 dark:text-gray-300">Crop</label>
                <select
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={formData.crop}
                  onChange={e => handleFormChange('crop', e.target.value)}
                >
                  <option value="soybean">Soybean</option>
                  <option value="mustard">Mustard</option>
                  <option value="groundnut">Groundnut</option>
                  <option value="sunflower">Sunflower</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700 dark:text-gray-300">Season</label>
                <select
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={formData.season}
                  onChange={e => handleFormChange('season', e.target.value)}
                >
                  <option value="kharif">Kharif / Monsoon</option>
                  <option value="rabi">Rabi / Winter</option>
                  <option value="summer">Summer (irrigated pockets)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700 dark:text-gray-300">Irrigation</label>
                <select
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={formData.irrigation}
                  onChange={e => handleFormChange('irrigation', e.target.value)}
                >
                  <option value="rainfed">Rainfed</option>
                  <option value="irrigated">Irrigated</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700 dark:text-gray-300">Cultivable area</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={formData.area}
                    onChange={e => handleFormChange('area', e.target.value)}
                  />
                  <select
                    className="w-24 border rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={formData.unit}
                    onChange={e => handleFormChange('unit', e.target.value)}
                  >
                    <option value="acre">Acre</option>
                    <option value="hectare">Hectare</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700 dark:text-gray-300">District</label>
                <select
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={formData.district}
                  onChange={e => handleFormChange('district', e.target.value)}
                >
                  {districtOptions.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700 dark:text-gray-300">Soil type (approx.)</label>
                <select
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={formData.soil}
                  onChange={e => handleFormChange('soil', e.target.value)}
                >
                  <option value="light">Light (sandy)</option>
                  <option value="medium">Medium black / loamy</option>
                  <option value="heavy">Heavy black</option>
                </select>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 text-xs text-[var(--text-secondary)] mb-3">
              <button
                type="submit"
                onClick={handleGenerate}
                className="btn btn-primary text-sm px-4 py-2"
              >
                Generate Plan
              </button>
            </div>

            {plan && (
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm animate-fade-in">
                <div className="border rounded-2xl p-3 bg-[var(--bg-light)]">
                  <h3 className="font-semibold mb-2">1. When to sow</h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">
                    Crop: <span className="font-medium">{plan.cropName}</span> · Season:{' '}
                    <span className="font-medium text-[var(--primary-color)]">
                      {plan.season.toUpperCase()}
                    </span>{' '}
                    · Location: <span className="font-medium">{plan.district}</span>
                  </p>
                  <p>{plan.window}</p>
                </div>

                <div className="border rounded-2xl p-3">
                  <h3 className="font-semibold mb-2">2. Which variety to choose</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {plan.varieties.map(v => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                </div>

                <div className="border rounded-2xl p-3">
                  <h3 className="font-semibold mb-2">3. Expected yield (indicative)</h3>
                  <p>
                    Per acre: <span className="font-semibold">{plan.perAcreYield.toFixed(1)} q/acre</span>
                  </p>
                  <p>
                    Total ({plan.areaAcre.toFixed(1)} acre):{' '}
                    <span className="font-semibold">{plan.totalYield.toFixed(1)} q</span>
                  </p>
                </div>

                <div className="border rounded-2xl p-3">
                  <h3 className="font-semibold mb-2">4. Fertilizer (basal NPK)</h3>
                  <p>
                    Total for {plan.areaAcre.toFixed(1)} acre: N{' '}
                    <span className="font-semibold">{plan.totalFert.n} kg</span>, P{' '}
                    <span className="font-semibold">{plan.totalFert.p} kg</span>, K{' '}
                    <span className="font-semibold">{plan.totalFert.k} kg</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Conversational AI advisor */}
        <div className="card h-[600px] flex flex-col relative overflow-hidden">
          {/* Chat Header */}
          <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 border-b z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">🤖</div>
            <div>
              <h3 className="font-semibold">Agri-Assistant</h3>
              <p className="text-xs text-gray-900 dark:text-gray-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto pt-20 pb-4 px-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start') + ' animate-fade-in'}
              >
                <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${msg.role === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div
                    className={
                      'px-4 py-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ' +
                      (msg.role === 'user'
                        ? 'bg-[var(--primary-color)] text-white rounded-tr-none'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none')
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm">🤖</div>
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="flex-shrink-0 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900 border border-gray-200 dark:border-gray-600 rounded-full text-xs font-medium transition-colors text-gray-700 dark:text-gray-300"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('askAnything')}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-12 h-12 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-transform active:scale-95"
              >
                <div className="icon-send text-xl"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AIAdvisor component error:', error);
    return null;
  }
}

