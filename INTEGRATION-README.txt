Integration Notes (ML + Advisory + Blockchain)
==============================================

This project now includes:

1) ML Services (ml_services/)
   - Demand–Supply–Price forecasting (FastAPI, scikit-learn)
   - AI advisory engine for crop planning, weather alerts, and pest risk
   See ml_services/README-ML-SERVICES.txt for details.

2) Blockchain Traceability
   - Smart contract contracts/OilseedTraceability.sol
   - Backend glue in backend/blockchain.js and backend/routes/traceability.js
   - Minimal ABI in backend/OilseedTraceability.abi.json
   - Usage instructions in backend/README-BLOCKCHAIN.txt

You can now:
- Run the Node backend (Express + MongoDB + blockchain routes)
- Run the Python FastAPI services for forecasting and advisories
- Call these APIs from the existing React-based dashboard pages.
