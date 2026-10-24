# BuildIntel AI — AI-Powered Multimodal Construction Intelligence Platform

**Capstone Project for FutureSkills Prime / Skill Wallet Vibe Coding Course**

BuildIntel AI is a full-stack, multimodal construction intelligence and safety monitoring platform. It unites computer vision, multimodal generative reasoning, structural defect heuristics, predictive valuation formulas, and live meteorological telemetry into a unified interface for site superintendents, safety officers, and project directors.

---

## 1. System Architecture

```text
vibe gemini/
├── frontend/                     # React 19 + Vite + Tailwind CSS + Axios
│   ├── src/
│   │   ├── components/           # Reusable UI library (Badge, ImageUploader, StatCard, etc.)
│   │   ├── layout/               # AppLayout, Sidebar, Topbar
│   │   ├── pages/                # All 9 platform pages
│   │   ├── services/api.js       # Centralized Axios client & API service layer
│   │   └── data/                 # Sample fallback presets
│   ├── vercel.json               # Vercel SPA rewrite configuration
│   └── .env.example              # Frontend environment template
├── backend/                      # Python FastAPI application
│   ├── app/
│   │   ├── main.py               # FastAPI entry point, CORS, and health check
│   │   ├── config.py             # Pydantic BaseSettings
│   │   ├── schemas/              # Pydantic request & response models
│   │   ├── services/             # OpenCV, AI reasoning, planning, weather, supabase
│   │   └── routes/               # API route controllers
│   ├── tests/                    # Automated pytest test suite
│   ├── Dockerfile                # Production container specification
│   ├── requirements.txt          # Python backend dependencies
│   └── .env.example              # Backend environment template
├── supabase/
│   ├── schema.sql                # Complete PostgreSQL schema, tables, indexes & RLS policies
│   └── README.md                 # Supabase setup guide
├── render.yaml                   # Render Blueprint deployment specification
├── PROJECT_STATUS.md             # Implementation progress tracker
└── README.md                     # Platform documentation
```

---

## 2. Platform Capabilities & Implementation Details

1. **Construction Site Safety Monitoring (`POST /api/safety/analyze`):**
   - Validates image dimensions, file size (<15MB), and sharpness using OpenCV Laplacian variance.
   - Computes HSV chromatic color masks isolating high-visibility neon yellow and OSHA orange PPE fabrics.
   - Evaluates worker PPE compliance, perimeter boundaries around machinery, and supervisor action checklists.

2. **Structural Crack Detection & Analysis (`POST /api/cracks/analyze`):**
   - Applies bilateral noise reduction filtering and Canny edge segmentation to isolate concrete fracture contours.
   - Classifies crack morphology (diagonal shear vs. surface shrinkage), aspect ratio elongation, and urgency.
   - Benchmarks severity against **ACI 224R-01** tolerable crack parameters.
   - Distinguishes 2D optical heuristics from certified physical dimensions (`is_dimension_calibrated: false`).

3. **Real Estate Valuation (`POST /api/valuation/estimate`):**
   - Implements a transparent, documented **Hedonic Pricing Model**:
     $$\text{Value} = \text{Area} \times \text{Base Rate} \times \text{Type Multiplier} \times \text{Grade Multiplier} \times \text{Age Multiplier} \times \text{Transit Multiplier} \times \text{LEED Multiplier}$$
   - Generates confidence bands (+/-6%) and comparative market sales records (comps).

4. **Construction Project Planning (`POST /api/planning/generate`):**
   - Deterministic Critical Path Method (CPM) milestone scheduler.
   - Generates sequential phase timelines, duration offsets, dependencies, risk matrices, and bill of quantities (BOM) material takeoffs.

5. **Daily Site Assistance & Weather Advisory (`GET /api/weather/current`):**
   - Connects to real-time live meteorological telemetry via Open-Meteo REST API (free, zero API key required).
   - Monitors tower crane wind gust ceilings (38 km/h limit per ISO 4302).
   - Evaluates concrete curing moisture loss windows per **ACI 308R**.

6. **Construction Knowledge Assistant (`POST /api/assistant/chat`):**
   - AI engineering reasoning agent backed by Multimodal LLM (Gemini 1.5 Flash / Pro).
   - Pre-loaded with standards citations: **OSHA 1926**, **ACI 318-19**, **ACI 224R**, and **AISC 360**.

7. **Analysis History & Audit Log (`GET /api/analyses`):**
   - Searchable, filterable audit log tracking past site scans, structural diagnostics, valuations, and schedules.
   - Persists records and syncs with Supabase PostgreSQL.

---

## 3. Local Development Setup

### Prerequisites
- Node.js (v18+) & npm
- Python (3.11+)

### Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment configuration
copy .env.example .env

# 5. Start the FastAPI development server
uvicorn app.main:app --reload --port 8000
```
*API Swagger Documentation will be available at: `http://localhost:8000/docs`*

### Frontend Setup
```bash
# 1. Open a new terminal and navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```
*Open your browser and navigate to: `http://localhost:5173`*

---

## 4. Running Automated Tests

To run the backend test suite:
```bash
# From the project root:
backend/venv/Scripts/python -m pytest backend/tests -v
```

To run the frontend production build check:
```bash
# From the project root:
cd frontend && npm run build
```

---

## 5. Deployment Instructions

### A. Backend Deployment on Render

1. Create a free account at [render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Root Directory:** `backend`
   - **Environment:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. In **Environment Variables**, set:
   - `ENVIRONMENT` = `production`
   - `CORS_ORIGINS` = `https://<your-vercel-frontend-domain>.vercel.app`
   - `GEMINI_API_KEY` = `(Your Google Gemini API Key)`
   - `SUPABASE_URL` = `(Your Supabase Project URL)`
   - `SUPABASE_ANON_KEY` = `(Your Supabase Anon Key)`
   - `SUPABASE_SERVICE_ROLE_KEY` = `(Your Supabase Service Role Key)`
6. Click **Deploy Web Service**. Note your backend production URL (e.g. `https://buildintel-backend.onrender.com`).

### B. Frontend Deployment on Vercel

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project** and import your GitHub repository.
3. In Project Settings:
   - **Root Directory:** Click edit and select `frontend`.
   - **Framework Preset:** `Vite`
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://buildintel-backend.onrender.com` (Your Render backend URL).
5. Click **Deploy**. Vercel will build and host the React application with client-side routing managed by `vercel.json`.

### C. Database & Storage on Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** -> **New Query**.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. In **Storage**, create a new public bucket named `inspection-assets`.
5. Copy your project URL, anon key, and service role key into your Render and local `.env` files.
