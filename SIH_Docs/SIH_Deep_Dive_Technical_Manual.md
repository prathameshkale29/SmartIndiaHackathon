# 🧠 SIH Finals: Deep Technical Architecture & Engineering Manual
**Project:** Agri-Sync (Smart Oilseed Value Chain)
**Audience:** Technical Judges, System Architects, CTOs

---

## 1. 🏗️ System Architecture: Current vs. Scalable Target

### current Implementation (Prototype)
Our MVP uses a **"Client-Side Monolith"** architecture designed for zero-latency demonstration and offline reliability during the hackathon.
*   **Runtime:** Browser-based JavaScript (ES6+ via Babel Standalone).
*   **State Management:** Hybrid Event-Driven Architecture.
    *   *Global Sync:* `SharedDataContext` (React Context) manages cross-component data (Market Prices, Listings).
    *   *Role Switch:* Custom `window.dispatchEvent(new Event('auth-change'))` pattern allows distinct components (`AIAdvisor`, `Sidebar`) to react instantly to login events without prop drilling.
*   **Persistence:** `localStorage` acts as a NoSQL-like document store, persisting Users, Listings, and Contracts across sessions.

### 2. 🤖 AI Engine: The "Context-Injection" Architecture

We moved beyond generic LLM wrappers by implementing a **Role-Augmented Generation (RAG-Lite)** engine in `utils/aiHelper.js`.

#### How it works (The "Secret Sauce"):
1.  **Context Detection:** The system intercepts the user's role (e.g., `Processor`) via the `auth-change` event.
2.  **Prompt Injection:** Before sending the query to the model, we inject a hidden "System Instruction Block":
    ```javascript
    const systemPrompt = `You are an expert Agri-Consultant for a ${userRole}.
    Current Context: Location=Wardha, Crop=Soybean.
    Constraint: If user is Farmer, speak in simple terms. If Processor, use technical ASTM standards.`;
    ```
3.  **Heuristic Filtering:** We map specific keywords to hardcoded "domain truth" datasets.
    *   *Keyword:* "Sowing" + "Soybean" -> Retrieves `ICAR-IISR-2024` sowing window standards.
    *   *Benefit:* Prevents hallucination on critical agricultural facts.

---

## 3. 📉 Algorithm Breakdown: Smart Sowing Planner

The "Sowing Planner" isn't just a static table. It uses a **Weighted Variable Algorithm** to calculate yield predictions.

**The Formula:**
$$ \text{Predicted Yield} = (\text{Base Yield}_{\text{Region}} \times \text{Soil}_{\text{Factor}} \times \text{Irrigation}_{\text{Factor}}) \times \text{Area} $$

**Code Logic (`AIAdvisor.js`):**
1.  **Base Yield:** Retrieved from a lookup table based on Crop + Season (e.g., Soybean Kharif = 10q/acre).
2.  **Soil Multiplier:**
    *   `Heavy Black Soil` = 1.05x (Boosts yield).
    *   `Light Sandy Soil` = 0.90x (Reduces yield).
3.  **Irrigation Factor:**
    *   `Rainfed` = Uses standard base.
    *   `Irrigated` = Uses amplified base (approx 1.3x).

*Judge's Question Answer:* "This deterministic logic ensures that farmers get realistic, scientifically backed projections, not just AI guesses."

---

## 4. 🔗 Blockchain Traceability: The "Hash-Chain" Implementation

We implement a **Supply Chain Provenance** model using a linked-list philosophy.

**Data Structure:**
Each batch of oil is an object containing a `previousHash`:
```json
{
  "batchId": "BATCH-2024-001",
  "stage": "PROCESSING",
  "owner": "Processor_01",
  "previousHash": "hash_of_farmer_harvest_data",
  "timestamp": 1701234567,
  "dataHash": "SHA256(moisture + quantity + quality)"
}
```

**Security Mechanism:**
*   Any attempt to alter the Farmer's initial quality report changes the `previousHash` at the Processor stage.
*   The final QR code validates the entire chain from the Genesis Block (Harvest) to the Final Block (Retail).

---

## 5. 🚀 Scalability Strategy (Phase 2 Roadmap)
To scale this to 10 million users, we propose:

*   **Microservices:** Split `AI Advisor` and `Marketplace` into separate Node.js services.
*   **Database:** Migrate `localStorage` -> **PostgreSQL (TimescaleDB)** for time-series weather/price data.
*   **Caching:** Use **Redis** to cache generic AI answers (e.g., "Soybean sowing time") to reduce API costs by 80%.
*   **Offline-First:** Implement **Service Workers (PWA)** so farmers can access crop plans even without internet connectivity.

---
**Use this deep dive to answer the "How exactly does it work?" questions.**
