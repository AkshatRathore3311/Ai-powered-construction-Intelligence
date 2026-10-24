# BuildIntel AI — AI-Powered Multimodal Construction Intelligence Platform

A modern multimodal construction intelligence and safety monitoring platform built for site engineers, structural inspectors, and project directors.

## Tech Stack Overview

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7, Lucide Icons, Recharts
- **Backend (Phase 2):** Python, FastAPI
- **AI Models (Phase 4 & 5):** Multimodal LLM (Gemini 1.5) & Computer Vision models
- **Database & Storage (Phase 6):** Supabase PostgreSQL, Supabase Storage, and Supabase Auth
- **Telemetry:** Weather API

---

## Phase 1 Implementation Status: COMPLETE

The entire frontend UI architecture and interactive modules have been built and tested:

1. **Dashboard:** High-level KPIs (Site safety score, active alerts, operational status), Recharts compliance area chart, category pie chart, and quick launch cards.
2. **Site Safety Monitoring:** Image upload zone, bounding box detection breakdown, OSHA PPE compliance scorecard, and instant sample image loader.
3. **Structural Crack Detection:** Concrete defect photo upload, fracture classification (shear, hairline), estimated width/length metrics, ACI 224R severity rating, and repair recommendations.
4. **Real Estate Valuation:** Multi-factor valuation form (built-up area, location corridor, structural grade, LEED status), predictive market value output, and comparable market sales table.
5. **Project Planning:** Scope parameter inputs, milestone sequencing timeline, dependency risk matrix, and estimated bill of materials (BOM).
6. **Daily Site Assistant & Weather Advisory:** Real-time environmental metrics (wind gusts, UV, ambient temperature, humidity), crane operation thresholds, concrete curing windows, and shift log submission.
7. **Construction Knowledge Assistant:** Dedicated chat interface with pre-loaded inquiry chips covering OSHA 1926, ACI 318, and AISC standards.
8. **Analysis History & Audit Log:** Searchable audit table with category pills, export CSV trigger, and detailed inspection modal.
9. **Platform Settings:** Project site preferences, measurement system toggles, alert threshold triggers, and backend API configuration.

---

## How to Run the Frontend Locally

### 1. Open Terminal and Navigate to `frontend/`
```bash
cd frontend
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Open your browser and navigate to:
```
http://localhost:5173
```

---

## UI State Verification Controls

Each primary AI page includes a **"UI Test Modes"** selector in the top-right header allowing you to preview and test:
- **Normal Mode:** Interactive workflow with sample preloaded data.
- **Loading State:** Spinner and status message simulating AI inference latency.
- **Empty State:** Visual state when no image or input data is provided.
- **Error State:** Banner with retry triggers for simulated inference/network failures.
