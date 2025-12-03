
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

async function invokeAIAgent(systemPrompt, userQuestion) {
  // Enhanced local "AI" using KB + rule-based fallback + Satellite/Weather simulation
  try {
    const q = (userQuestion || '').trim();
    if (!q) return 'Please ask a question.';

    const qTokens = tokenize(q);
    const lowerQ = q.toLowerCase();

    // --- SATELLITE DATA QUERY ---
    if (lowerQ.includes('satellite') || lowerQ.includes('ndvi') || lowerQ.includes('crop health') || lowerQ.includes('moisture')) {
      const satData = getSatelliteAnalysis();
      return `🛰️ **Satellite Analysis Report**\n\n` +
        `• **Vegetation Index (NDVI):** ${satData.ndvi} (${satData.healthStatus})\n` +
        `• **Soil Moisture:** ${satData.moisture}%\n` +
        `• **Last Satellite Pass:** ${satData.lastPass}\n\n` +
        `*Advisory:* ${satData.healthStatus === 'Excellent' ? 'Your crop is healthy. Continue current management.' : 'Crop shows signs of stress. Check for water or nutrient deficiency.'}`;
    }

    // --- WEATHER ALERT QUERY ---
    if (lowerQ.includes('alert') || lowerQ.includes('warning') || lowerQ.includes('forecast')) {
      const alert = getWeatherAlerts();
      if (alert) {
        return `⚠️ **Weather Alert**\n\n${alert}`;
      } else {
        return `✅ **Weather Update**\n\nNo severe weather alerts for your region. Conditions are normal for farming operations.`;
      }
    }

    // 1. Check Knowledge Base first
    let best = [];
    let bestScore = 0;

    OILSEED_KB.forEach((entry) => {
      const sc = scoreEntry(qTokens, entry);
      if (sc > 0) {
        if (sc > bestScore) {
          bestScore = sc;
          best = [entry];
        } else if (sc === bestScore) {
          best.push(entry);
        }
      }
    });

    if (bestScore > 0 && best.length > 0) {
      // Return the best answer(s)
      return best
        .slice(0, 2)
        .map((e, idx) => (best.length > 1 ? `**Point ${idx + 1}:**\n` : "") + e.answer)
        .join("\n\n");
    }

    // 2. Fallback to rule-based logic if no KB match

    // Weather-related advice
    if (lowerQ.includes('weather') || lowerQ.includes('rain') || lowerQ.includes('monsoon')) {
      return 'Check the 5-day forecast in the dashboard. Avoid spraying chemicals before expected rain and plan sowing when soil has good moisture but is not waterlogged.';
    }

    // Mustard-specific advice
    if (lowerQ.includes('mustard')) {
      return 'For mustard, use certified seeds, maintain spacing of about 30 cm between rows, and avoid water logging. Apply balanced NPK based on soil test and monitor for aphids; use yellow sticky traps and need-based spraying.';
    }

    // Soybean-specific advice
    if (lowerQ.includes('soybean') || lowerQ.includes('soyabean')) {
      return 'For soybean, ensure timely sowing at the start of monsoon, use well-drained soil, and avoid deep ploughing after heavy rain. In case of yellowing leaves, check for water logging and possible nutrient deficiency.';
    }

    // Groundnut-specific advice
    if (lowerQ.includes('groundnut') || lowerQ.includes('ground nut') || lowerQ.includes('peanut')) {
      return 'For groundnut, use well-drained sandy loam soil and avoid excess irrigation during flowering and pegging. Gypsum application at flowering improves pod filling. Remove weeds in the first 30–40 days.';
    }

    // Price / market trend queries
    if (lowerQ.includes('price') || lowerQ.includes('market') || lowerQ.includes('rate')) {
      return 'Market prices change daily. Use the Market section in the app to see latest mandi prices and compare nearby markets before deciding to sell. Prefer selling when demand is high and arrivals are low.';
    }

    // Fertilizer and soil health
    if (lowerQ.includes('fertilizer') || lowerQ.includes('fertiliser') || lowerQ.includes('soil')) {
      return 'Use soil test based fertilizer recommendation. Avoid overuse of nitrogen. Add organic matter like farmyard manure or compost. Split nitrogen in 2–3 doses and apply potash and phosphorus at sowing.';
    }

    // Pest / disease related
    if (lowerQ.includes('pest') || lowerQ.includes('disease') || lowerQ.includes('insect') || lowerQ.includes('worm')) {
      return 'First identify the pest correctly. Prefer integrated pest management: clean field, remove infected plants, use pheromone traps and bio-pesticides. Spray chemicals only if infestation crosses economic threshold.';
    }

    // Credit / scheme queries
    if (lowerQ.includes('loan') || lowerQ.includes('scheme') || lowerQ.includes('subsidy') || lowerQ.includes('insurance')) {
      return 'You can explore PM-KISAN, KCC, PMFBY and PM-KUSUM schemes. Check the Government Schemes section in the app and apply through the official portals or visit the nearest agriculture office or bank branch.';
    }

    // Generic fallback
    return 'Based on your question, I suggest you adopt good agricultural practices: use quality seed, follow recommended sowing time and spacing, do timely weeding and irrigation, and regularly check market prices and weather updates. For specific issues, contact your local agriculture officer.';
  } catch (error) {
    console.error('invokeAIAgent error:', error);
    return 'I am unable to process your question right now. Please try again in some time.';
  }
}

async function getAIAdvice(userQuestion) {
  const systemPrompt = `You are an expert agricultural advisor specializing in oilseed crops in India.`;

  try {
    // Simulate a small network delay for "thinking" effect
    await new Promise(resolve => setTimeout(resolve, 600));
    const response = await invokeAIAgent(systemPrompt, userQuestion);
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
