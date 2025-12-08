# 🛠️ SIH Master Technical Specification: "Agri-Sync" (v2.0 - Extended)
**For:** Technical Evaluator Panel & System Documentation

---

## 1. 🏗️ High-Level System Architecture (Diagram)

We use a **Hybrid Event-Driven Architecture** that allows disparate components (AI, Blockchain, Marketplace) to sync in real-time without heavy server polling.

```mermaid
graph TD
    User[User (Farmer/Processor)] -->|Interacts| UI[React UI Layer]
    UI -->|Auth Events| EventBus[Window Event Bus]
    UI -->|Data Write| LocalStore[LocalStorage DB]
    
    EventBus -->|Notifies| AI[AI Context Engine]
    EventBus -->|Notifies| Navbar[Dynamic Header]
    
    AI -->|Context Injection| LLM[Gemini/GPT-4o API]
    UI -->|Trace Check| Blockchain[Simulated EVM Ledger]
    
    subgraph "Zero-Latency Data Layer"
    LocalStore <-->|Sync| SharedContext[SharedDataContext API]
    SharedContext -->|Update| Dashboard[Live Dashboard]
    end
```

---

## 2. 🖥️ Technology Stack: The "Modern Agile" Stack

We chose this stack for maximum **Performance**, **Scalability**, and **Developer Velocity**.

| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Frontend Framework** | **React.js (v18)** | Component-based, Virtual DOM for zero-latency UI updates. |
| **CSS Engine** | **Tailwind CSS (v3.4)** | Utility-first CSS for rapid, responsive "Glassmorphism" design. |
| **Language** | **JavaScript (ES6+)** | Universal language for full-stack consistency. |
| **Compilers** | **Babel Standalone** | In-browser compilation allowing "No-Build" deployment (Hackathon optimized). |
| **State Management** | **React Context API** | Global state for Authentication & Shared Data (Marketplace). |
| **Persistence** | **LocalStorage (Web Storage API)** | Client-side NoSQL simulation for offline-first capability. |
| **Visualization** | **Chart.js** | High-performance HTML5 Canvas rendering for demand forecasting charts. |

---

## 3. 🧠 The "Secret Sauce": Code-Level Innovations

This is where we win the technical points. We don't just use APIs; we engineer them.

### Innovation A: AI Context-Injection (RAG-Lite)
*Problem:* Generic chatbots hallucinate.
*Solution:* We inject the "Domain Truth" silently before the user speaks.

**Implementation (Code Snapshot):**
```javascript
// uiHelper.js
const getSystemPrompt = (role) => {
    // 1. Define Role Constraints
    const constraints = role === 'farmer' 
        ? "Use simple Hindi/English mixed terms. Focus on cost-saving."
        : "Use industrial ASTM standards. Focus on procurement efficiency.";

    // 2. Inject Domain Knowledge (RAG)
    const knowledgeBase = {
        'farmer': "Sowing Window: June 15-July 10. Seed Rate: 30kg/acre.",
        'processor': "Standard Moisture: <10%. Oil Content Base: 18%."
    };

    // 3. Construct Final Prompt
    return `System: You are an expert advisor for a ${role}. 
            Constraints: ${constraints}
            Verified Data: ${knowledgeBase[role]}`;
};
```

### Innovation B: The "Zero-Latency" Event Bus
*Problem:* React State drilling makes large apps slow.
*Solution:* A custom Pub/Sub model using the Window API.

**Implementation:**
1.  **Publisher (Auth.js):**
    ```javascript
    // When role changes...
    window.dispatchEvent(new Event('auth-change'));
    ```
2.  **Subscriber (any component):**
    ```javascript
    // In AIAdvisor.js
    window.addEventListener('auth-change', () => {
        // Instantly re-configure the AI personality
        refreshQuickChips();
    });
    ```
*Result:* milliseconds response time across the entire platform.

---

## 4. 👥 Detailed Role Capabilities (RBAC Matrix)

| Feature | 👨‍🌾 Farmer | 🏢 FPO | 🏭 Processor | 🏪 Retailer |
| :--- | :---: | :---: | :---: | :---: |
| **AI Advisor** | Crop Health Focus | Storage Focus | Procurement Focus | Consumer Trends Focus |
| **Dashboard** | Weather/Yield | Aggregated Stock | Demand Charts | Sales/shelf-life |
| **Marketplace** | **Sell** (List Produce) | Manage Listings | **Buy** (Create Contract) | View Products |
| **Traceability** | Create Genesis Block | Add Transport Block | Add Quality Block | **Verify Final Hash** |

---

## 5. 🔮 Future Scalability Path

Documentation on how this prototype converts to a Unicorn Product.

### Phase 1 (Hackathon MVP)
*   **DB:** LocalStorage (JSON)
*   **Auth:** Simulation
*   **AI:** Simulated/Proxied

### Phase 2 (Production Beta) -> *6 Months*
*   **DB:** Migrate JSON -> **PostgreSQL** (Relational Data) + **TimescaleDB** (IoT/Weather Data).
*   **Backend:** Node.js / Express Microservices (Auth, Market, AI).
*   **AI:** Fine-tune Llama-3-7B model specifically on Indian Agriculture datasets to reduce API costs.
*   **Offline:** Implement PWA Service Workers for 100% offline usage in remote villages.

---

## 6. 🛡️ Security Architecture (Proposed)

1.  **JWT (JSON Web Tokens):** Stateless authentication for API requests.
2.  **RBAC Middleware:** Server-side validation that a "Farmer" cannot access "Processor" endpoints.
3.  **Data Encryption:** TLS 1.3 for data in transit; AES-256 for sensitive Price Contracts in DB.

---
**Summary for Judges:**
Agri-Sync is not just a UI wrapper. It is a scientifically engineered platform with a novel **Context-Aware AI Architecture**, a specific **Event-Driven Frontend**, and a clear roadmap for **Enterprise Scalability**.
