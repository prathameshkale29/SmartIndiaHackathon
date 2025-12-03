// backend/routes/oilseedAdvisor.js
// Offline oilseed advisor using a small local knowledge base and keyword matching.

const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Load knowledge base once at startup
let KB = [];
try {
  const kbPath = path.join(__dirname, "..", "data", "oilseed_knowledge.json");
  const raw = fs.readFileSync(kbPath, "utf8");
  KB = JSON.parse(raw);
  console.log("Offline oilseed KB loaded with", KB.length, "entries");
} catch (e) {
  console.error("Failed to load oilseed knowledge base:", e);
  KB = [];
}

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

router.post("/", async (req, res) => {
  try {
    const { message } = req.body || {};
    const query = (message || "").trim();

    if (!query) {
      return res.json({
        reply:
          "Please type a question related to oilseed crops (soybean, mustard, groundnut, sunflower, sesame, safflower or oil palm).",
      });
    }

    const qTokens = tokenize(query);
    if (qTokens.length === 0) {
      return res.json({
        reply:
          "Please ask a valid question about oilseeds, for example: 'Best sowing window for soybean in Vidarbha?'",
      });
    }

    // Basic guardrail: if clearly not about agri/oilseeds
    const oilseedWords = ["soybean","mustard","groundnut","sunflower","sesame","safflower","oil","palm","seed","crop","fpo","mandi","farmer","kharif","rabi"];
    const hasDomain = qTokens.some((t) => oilseedWords.includes(t));
    if (!hasDomain) {
      return res.json({
        reply:
          "I am an offline advisor focused only on oilseed crops and their value chain. Please ask about soybean, mustard, groundnut, sunflower, sesame, safflower, oil palm, agronomy, pests, post-harvest or markets.",
      });
    }

    // Score all entries
    let best = [];
    let bestScore = 0;
    KB.forEach((entry) => {
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

    let reply;
    if (bestScore === 0 || best.length === 0) {
      const fallback = KB.find((e) => e.id === "generic_offline_limit");
      reply =
        (fallback && fallback.answer) ||
        "I have only a small offline knowledge base for oilseeds. Please consult local experts for detailed, location-specific advice.";
    } else {
      // Concatenate top 1–2 answers for richer response
      reply = best
        .slice(0, 2)
        .map((e, idx) => {
          return (best.length > 1 ? `Point ${idx + 1}:\n` : "") + e.answer;
        })
        .join("\n\n");
    }

    return res.json({ reply });
  } catch (err) {
    console.error("offline oilseedAdvisor error:", err);
    return res.status(500).json({
      reply:
        "Sorry, the offline oilseed advisor faced an internal error. Please try again.",
    });
  }
});

module.exports = router;
