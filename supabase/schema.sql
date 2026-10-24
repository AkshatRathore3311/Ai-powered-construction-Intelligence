-- ==============================================================================
-- BuildIntel AI — Supabase PostgreSQL Schema, Storage, and Row-Level Security
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Synchronized with Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    organization TEXT DEFAULT 'General Contracting',
    role TEXT DEFAULT 'Site Engineer',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Construction Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    project_code TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    latitude DOUBLE PRECISION DEFAULT 28.6139,
    longitude DOUBLE PRECISION DEFAULT 77.2090,
    target_budget NUMERIC(15, 2),
    target_duration_months INT DEFAULT 6,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Multimodal Analysis Records Table (Safety, Cracks, etc.)
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('Safety Monitoring', 'Crack Detection', 'Real Estate Valuation', 'Project Planning')),
    title TEXT NOT NULL,
    site_name TEXT NOT NULL,
    summary TEXT NOT NULL,
    status TEXT DEFAULT 'Completed',
    storage_image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Project Tasks & Milestones Table
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    phase_name TEXT NOT NULL,
    duration_days INT NOT NULL,
    start_day_offset INT NOT NULL,
    completion_day_offset INT NOT NULL,
    dependency TEXT,
    risk_level TEXT DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Medium', 'High')),
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    key_deliverable TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Property Valuations Table
CREATE TABLE IF NOT EXISTS public.property_valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    property_type TEXT NOT NULL,
    built_up_area_sqft NUMERIC(12, 2) NOT NULL,
    location_tier TEXT NOT NULL,
    structural_grade TEXT NOT NULL,
    estimated_total_value NUMERIC(15, 2) NOT NULL,
    estimated_price_per_sqft NUMERIC(10, 2) NOT NULL,
    valuation_range_low NUMERIC(15, 2) NOT NULL,
    valuation_range_high NUMERIC(15, 2) NOT NULL,
    confidence_score NUMERIC(5, 2),
    formula_breakdown JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Assistant Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    standard_references TEXT[] DEFAULT ARRAY[]::TEXT[],
    model_used TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_category ON public.analyses(category);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON public.conversations(session_id);

-- 9. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Users manage projects they own
CREATE POLICY "Users view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);

-- Analyses: Users can view analyses linked to their account or public site logs
CREATE POLICY "Users view analyses" ON public.analyses FOR SELECT USING (true);
CREATE POLICY "Users insert analyses" ON public.analyses FOR INSERT WITH CHECK (true);

-- Conversations: Private to authenticated user session
CREATE POLICY "Users view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users insert conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 10. Storage Bucket Setup Script (Executed in Supabase SQL Editor)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('inspection-assets', 'inspection-assets', true)
-- ON CONFLICT (id) DO NOTHING;
