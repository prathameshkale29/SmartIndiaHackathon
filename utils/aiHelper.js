
// Knowledge Base from backend/data/oilseed_knowledge.json
const OILSEED_KB = [
  // --- SOYBEAN ---
  {
    "id": "soybean_sowing_window_vidarbha",
    "tags": ["soybean", "sowing", "vidarbha", "wardha", "nagpur", "kharif", "rainfed"],
    "question": "Best sowing window for soybean in Vidarbha (Wardha, Nagpur)?",
    "answer": "For soybean in Vidarbha (Wardha, Nagpur), the ideal sowing window is usually from mid June to mid July, after receipt of at least 75–100 mm of rainfall and with good soil moisture. Delayed sowing beyond the last week of July often reduces yield. Use early-maturing varieties if sowing is delayed."
  },
  {
    "id": "soybean_seed_rate_spacing",
    "tags": ["soybean", "seed rate", "spacing", "plant population"],
    "question": "Recommended seed rate and spacing for soybean?",
    "answer": "Soybean general recommendation: 30–35 kg/ha seed rate for bold seeded varieties, sown at 45 cm row spacing and 5–7 cm plant spacing (about 30–35 plants per metre row length). Maintain sowing depth of 3–4 cm only and use treated seed."
  },
  {
    "id": "soybean_yellow_mosaic",
    "tags": ["soybean", "disease", "yellow", "mosaic", "virus", "whitefly"],
    "question": "Control of Yellow Mosaic Virus in Soybean?",
    "answer": "Yellow Mosaic Virus (YMV) is transmitted by whiteflies. To control: (1) Use YMV-resistant varieties like JS-20-34 or JS-95-60. (2) Install yellow sticky traps (10-15/ha) to monitor whiteflies. (3) Spray Thiamethoxam 25 WG (100g/ha) or Acetamiprid 20 SP if vector population is high."
  },

  // --- MUSTARD ---
  {
    "id": "mustard_fertilizer_black_soil",
    "tags": ["mustard", "fertilizer", "black soil", "nutrient", "npk"],
    "question": "Fertilizer recommendation for mustard on black soils?",
    "answer": "For mustard on medium black soils, a common blanket recommendation is around 60 kg N, 40 kg P2O5 and 20 kg K2O per hectare. Apply half N + full P and K as basal at sowing and remaining N at first irrigation. Also apply 20 kg S/ha (through gypsum) and micronutrients like zinc if deficiency is known."
  },
  {
    "id": "mustard_aphids",
    "tags": ["mustard", "pest", "aphid", "insect", "sucking"],
    "question": "How to control aphids in mustard?",
    "answer": "Aphids cause severe damage to mustard. Management: (1) Late sown crops are more susceptible, so sow timely (Oct 15-30). (2) Spray Dimethoate 30 EC (1000 ml/ha) or Imidacloprid 17.8 SL (100 ml/ha) if 20-25 aphids/10 cm terminal shoot are observed. (3) Conserve natural enemies like Ladybird beetles."
  },

  // --- GROUNDNUT ---
  {
    "id": "groundnut_major_pests",
    "tags": ["groundnut", "pest", "leaf miner", "thrips", "jassid"],
    "question": "Major pests of groundnut and their basic management?",
    "answer": "Important groundnut pests include leaf miner, thrips, jassids and spodoptera. For IPM: use timely sowing, balanced fertilizer, removal of volunteer plants, install pheromone traps/light traps, and monitor 10–15 plants per field corner. If ETL is crossed, use recommended insecticides from local agri department, always avoiding spraying before rain or in high winds."
  },
  {
    "id": "groundnut_tikka",
    "tags": ["groundnut", "disease", "tikka", "leaf spot", "fungus"],
    "question": "Control of Tikka disease (Leaf Spot) in Groundnut?",
    "answer": "Tikka disease causes dark spots on leaves. Control: (1) Seed treatment with Carbendazim (2g/kg). (2) Spray Mancozeb 75 WP (2g/liter) or Hexaconazole 5 EC (1ml/liter) at 2-3 week intervals appearing of symptoms. (3) Remove infected plant debris."
  },

  // --- GENERAL / MARKET ---
  {
    "id": "post_harvest_losses_oilseeds",
    "tags": ["post harvest", "storage", "losses", "fpo", "warehouse"],
    "question": "How can FPOs reduce post-harvest losses in oilseeds?",
    "answer": "To reduce post-harvest losses in oilseeds, FPOs should: (1) dry produce to safe moisture (8–9% for soybean, 7–8% for groundnut kernels), (2) use cleaned, graded bags, (3) store on wooden pallets away from walls, (4) ensure proper aeration and fumigation against storage pests, (5) digitize stock entries and stack-wise identification, and (6) avoid frequent handling which causes mechanical damage and oil loss."
  },
  {
    "id": "nmeo_op_overview",
    "tags": ["nmeo-op", "scheme", "oil palm", "mission", "government"],
    "question": "What is NMEO-OP and how does it help farmers?",
    "answer": "The National Mission on Edible Oils – Oil Palm (NMEO-OP) is a Government of India scheme to expand oil palm cultivation and reduce edible oil imports. It provides support for planting material, maintenance, intercropping, and price assurance to farmers. In your platform, it can be linked to advisories, credit schemes and performance-based incentives for oil palm growers."
  },
  {
    "id": "market_selling_advice",
    "tags": ["market", "price", "sell", "hold", "trend"],
    "question": "When is the best time to sell my oilseed crop?",
    "answer": "General advice: (1) Avoid panic selling immediately after harvest when arrivals are high and prices dip. (2) If you have storage, hold for 2-3 months. (3) Check the 'Market' tab for real-time mandi prices. (4) Sell if prices are 10-15% above MSP or if you have urgent cash needs."
  },
  {
    "id": "generic_offline_limit",
    "tags": ["generic", "fallback"],
    "question": "Generic fallback answer when knowledge is limited.",
    "answer": "I am an offline oilseed advisor running on a local knowledge base. I can give general guidance on oilseed crops like soybean, mustard, groundnut, sunflower, sesame and oil palm. For very location-specific doses or latest scheme details, please cross-check with your local agriculture department or KVK."
  }
];

// Simple tokenizer
function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Score a KB entry against the query using keyword overlap
function scoreEntry(queryTokens, entry) {
  const allText = (entry.question + " " + (entry.tags || []).join(" ")).toLowerCase();
  const entryTokens = new Set(tokenize(allText));
  let score = 0;
  queryTokens.forEach((t) => {
    if (entryTokens.has(t)) score += 1;
  });
  return score;
}

// --- NEW: Satellite Data Simulation ---
function getSatelliteAnalysis(location) {
  // Simulate fetching NDVI and Soil Moisture data based on location
  const ndvi = (0.4 + Math.random() * 0.4).toFixed(2); // 0.4 to 0.8 (Healthy)
  const moisture = (20 + Math.random() * 40).toFixed(1); // 20% to 60%

  let healthStatus = "Moderate";
  if (ndvi > 0.6) healthStatus = "Excellent";
  else if (ndvi < 0.5) healthStatus = "Stressed";

  return {
    ndvi,
    moisture,
    healthStatus,
    lastPass: new Date().toLocaleDateString()
  };
}

// --- NEW: Weather Alert Simulation ---
function getWeatherAlerts() {
  const alerts = [
    "Heavy rainfall expected in the next 48 hours. Ensure proper drainage.",
    "Heatwave alert: Temperatures may cross 42°C. Irrigate crops in the evening.",
    "High wind speed warning. Avoid spraying chemicals today.",
    "Clear skies expected for the next 5 days. Good time for harvesting.",
    null // No alert
  ];
  return alerts[Math.floor(Math.random() * alerts.length)];
}

// Role-specific Knowledge Base additions
const ROLE_KB = {
  fpo: [
    {
      keywords: ['storage', 'warehouse', 'loss'],
      answer: "For FPOs, efficient storage is key. Ensure warehouses are dry, well-ventilated, and pest-free. Use hermetic bags for smaller lots. Regular fumigation and digital stock monitoring can reduce post-harvest losses by 15-20%."
    },
    {
      keywords: ['scheme', 'funding', 'subsidy'],
      answer: "FPOs can avail benefits under the 'Formation and Promotion of 10,000 FPOs' scheme. Equity Grant and Credit Guarantee Fund coverage are available. Check with NABARD or SFAC for application details."
    },
    {
      keywords: ['aggregation', 'procurement', 'bulk'],
      answer: "Aggregate produce at village level collection centers. Grade and sort immediately to ensure uniform quality for bulk buyers. This increases bargaining power and fetches premium rates."
    }
  ],
  processor: [
    {
      keywords: ['quality', 'moisture', 'oil content', 'grade'],
      answer: "Standard procurement specs: Soybean (Moisture < 12%, Oil > 18%), Mustard (Moisture < 8%, Oil > 38%). High moisture leads to fungal growth and rancidity during storage."
    },
    {
      keywords: ['tender', 'procurement', 'buy'],
      answer: "Use the Procurement section to float tenders for specific grades. Specifying clear quality parameters (e.g., 'Grade A, max 2% foreign matter') reduces rejection rates at the gate."
    },
    {
      keywords: ['milling', 'efficiency', 'extraction'],
      answer: "To improve milling efficiency: Clean seeds thoroughly before crushing. Maintain optimum moisture conditioning. Regular maintenance of expellers ensures maximum oil recovery."
    }
  ],
  retailer: [
    {
      keywords: ['packaging', 'label', 'fssai'],
      answer: "Edible oil packaging must comply with FSSAI regulations. Labels must show: FSSAI license no., nutritional information, trans-fat content, and 'Blended Edible Vegetable Oil' if applicable."
    },
    {
      keywords: ['consumer', 'trend', 'demand'],
      answer: "Current consumer trends show a shift towards 'Cold Pressed' (Kachi Ghani) and 'Fortified' oils. Promoting 'Locally Sourced' oil can also appeal to health-conscious buyers."
    },
    {
      keywords: ['margin', 'profit', 'stock'],
      answer: "Manage inventory to follow First-In-First-Out (FIFO) to avoid expiry. Stocking smaller packs (1L, 500ml) often yields higher turnover than bulk tins for urban markets."
    }
  ]
};

// --- CONFIGURATION ---
// PASTE YOUR GOOGLE GEMINI API KEY HERE to enable "Direct AI" mode.
// Get a free key at: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = '';

// --- GEMINI API INTEGRATION ---
async function callGeminiAPI(systemPrompt, userQuestion) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 10) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Construct prompt with system instructions
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${userQuestion}\n\nAnswer concisely and helpfully in a conversational tone.`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || null;

  } catch (error) {
    console.warn("Gemini API call failed (falling back to local):", error);
    return null;
  }
}

// --- GENERAL KNOWLEDGE BASE (Small Talk & General) ---
const GENERAL_KB = [
  {
    keywords: ['who', 'are', 'you', 'bot', 'name'],
    answer: "I am your AI Agri-Advisor, a smart assistant designed to help you with crop management, market trends, and government schemes. I'm here to support your farming journey!"
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'evening'],
    answer: "Hello! Hope you're having a productive day. How can I help you with your farm tasks or market queries today?"
  },
  {
    keywords: ['thank', 'thanks', 'cool', 'good', 'great', 'awesome'],
    answer: "You're welcome! I'm glad I could help. Let me know if you need anything else."
  },
  {
    keywords: ['bye', 'goodbye', 'see', 'you'],
    answer: "Goodbye! Wishing you a successful harvest. See you soon!"
  },
  {
    keywords: ['joke', 'funny'],
    answer: "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾 😄"
  },
  {
    keywords: ['weather', 'forecast', 'rain', 'temperature'],
    answer: "I can help with that! Please check the dashboard for the detailed 5-day forecast. Generally, it's good to plan field operations when no heavy rain is predicted."
  }
];

// Expanded Agricultural Knowledge Base (General Farming)
const AGRI_EXPANSION_KB = [
  {
    keywords: ['water', 'irrigation', 'drip', 'sprinkler'],
    answer: "Water management is crucial. Drip irrigation saves 40-60% water and improves yield by 20-30%. For oilseeds like groundnut, sprinkler systems are very effective during the pegging stage."
  },
  {
    keywords: ['soil', 'test', 'health', 'organic'],
    answer: "Healthy soil is the foundation of a good harvest. I recommend getting a soil health card (SHC) every 3 years. Adding organic carbon through FYM or vermicompost improves water retention and nutrient availability."
  },
  {
    keywords: ['government', 'support', 'help', 'kcc'],
    answer: "The government offers various support systems like PM-KISAN (income support), KCC (credit), and PMFBY (crop insurance). Visit the 'Gov Schemes' section in this app for direct application links."
  }
];

async function invokeAIAgent(systemPrompt, userQuestion, userRole) {
  // Enhanced "Smart Mock" AI Engine
  try {
    const q = (userQuestion || '').trim();
    if (!q) return 'I am listening. Please ask your question.';

    const qTokens = tokenize(q);
    const lowerQ = q.toLowerCase();
    const currentRole = userRole || 'farmer';

    // 0. Try Direct AI (Gemini) First
    // Construct a rich system prompt based on role
    const dynamicPrompt = `${systemPrompt} The user is a ${currentRole}. Focus on Indian agriculture, practical advice, and market context.`;
    const aiResponse = await callGeminiAPI(dynamicPrompt, q);
    if (aiResponse) {
      return `✨ **AI Insight:**\n${aiResponse}`;
    }

    // 1. Check General Chit-Chat (High Priority for natural feel)
    for (const entry of GENERAL_KB) {
      if (entry.keywords.some(k => lowerQ.includes(k))) {
        // Add minimal randomization for "chatbot" feel
        const prefixes = ["", "Sure! ", "I can answer that. ", ""];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        return prefix + entry.answer;
      }
    }

    // 2. Exact/Strong Role-Based Context
    if (ROLE_KB[currentRole]) {
      for (const entry of ROLE_KB[currentRole]) {
        // Improved matching: requires correlation of at least one keyword if query is short, or more if long
        if (entry.keywords.some(k => lowerQ.includes(k))) {
          return `🤖 **Advisor (${currentRole.toUpperCase()}):** ${entry.answer}`;
        }
      }
    }

    // 3. Special Modules (Satellite, Weather) - Keep existing logic
    if (lowerQ.includes('satellite') || lowerQ.includes('ndvi') || lowerQ.includes('health')) {
      const satData = getSatelliteAnalysis();
      return `🛰️ **Satellite Insight:**\nVegetation Index (NDVI): ${satData.ndvi} (${satData.healthStatus}).\nMoisture: ${satData.moisture}%.\n${satData.healthStatus === 'Excellent' ? 'Crop is looking great!' : 'Attention required: Potential stress detected.'}`;
    }
    if (lowerQ.includes('alert') || lowerQ.includes('rain') || lowerQ.includes('storm')) {
      const alert = getWeatherAlerts();
      return alert ? `⚠️ **Weather Alert:** ${alert}` : `✅ No severe weather alerts. Good conditions for field work.`;
    }

    // 4. Detailed Knowledge Base Search (Oilseeds + Expanded Agri)
    let bestEntry = null;
    let maxScore = 0;

    const allKnowledge = [...OILSEED_KB, ...AGRI_EXPANSION_KB.map(k => ({ ...k, question: k.keywords.join(' '), tags: k.keywords }))];

    allKnowledge.forEach(entry => {
      // Improved scoring: weighted by token length and exact phrase matching?
      // Keeping it simple but effective: overlap count
      const score = scoreEntry(qTokens, entry);
      if (score > maxScore) {
        maxScore = score;
        bestEntry = entry;
      }
    });

    if (maxScore > 0) { // Threshold can be tweaked
      return bestEntry.answer;
    }

    // 5. "Smart Fallback" (The "Act like any other chatbot" part)
    // Instead of saying "I don't know", we construct a helpful response based on the topic.

    // Attempt to identify the noun/topic
    const ignoredWords = ['what', 'is', 'how', 'to', 'the', 'a', 'an', 'in', 'on', 'for', 'of', 'my', 'does', 'do', 'can', 'you'];
    const topicTokens = qTokens.filter(t => !ignoredWords.includes(t) && t.length > 2);
    const mainTopic = topicTokens.length > 0 ? topicTokens[0] : 'that';

    // Conversational Fallback Patterns
    const fallbacks = [
      `That's an interesting question about **${mainTopic}**. While I specialize in oilseed farming, generally, handling ${mainTopic} requires careful planning. Ideally, you should consult a local expert for specific details.`,
      `I see you're asking about **${mainTopic}**. In the context of agriculture, we usually focus on how it affects yield or cost. Could you clarify if this is related to a specific crop?`,
      `I'm tuned to help with farming, markets, and logistics. Regarding **${mainTopic}**, I'd suggest checking the latest government guidelines or market news section in the app.`,
      `Good question! **${mainTopic}** is an important topic. While I don't have the exact data right now, I recommend looking at the 'Resources' tab for more info on this.`
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];

  } catch (error) {
    console.error('invokeAIAgent error:', error);
    return "I'm having a bit of trouble thinking right now. Could you ask that again differently?";
  }
}

async function getAIAdvice(userQuestion, userRole = 'farmer') {
  const systemPrompt = `You are an expert agricultural advisor specializing in oilseed crops in India.`;

  try {
    // Simulate a small network delay for "thinking" effect
    await new Promise(resolve => setTimeout(resolve, 600));
    const response = await invokeAIAgent(systemPrompt, userQuestion, userRole);
    return response;
  } catch (error) {
    console.error('AI advice error:', error);
    return 'I apologize, but I am having trouble connecting right now. Please try again.';
  }
}

// Expose helpers globally for components loaded via script tags
if (typeof window !== 'undefined') {
  window.getAIAdvice = getAIAdvice;
}
