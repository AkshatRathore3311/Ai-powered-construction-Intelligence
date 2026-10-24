# Supabase Integration Guide — BuildIntel AI

This directory provides the database schema, storage bucket definitions, and Row Level Security (RLS) policies for Supabase.

## 1. Setting up the PostgreSQL Schema

1. Go to your [Supabase Dashboard](https://app.supabase.com) and create a new project.
2. In the left navigation, click on **SQL Editor**.
3. Click **New Query**, paste the contents of `supabase/schema.sql`, and click **Run**.
4. The following tables will be created with primary keys, foreign keys, timestamps, indexes, and RLS policies:
   - `profiles`
   - `projects`
   - `analyses`
   - `project_tasks`
   - `property_valuations`
   - `conversations`

## 2. Setting up the Storage Bucket

1. In the Supabase dashboard, click on **Storage**.
2. Click **New Bucket**.
3. Name the bucket: `inspection-assets`
4. Set **Public Bucket** to checked (or configure signed URL access).
5. Click **Save Bucket**.

## 3. Configuring Backend Environment Variables

In your `backend/.env` file, supply your Supabase project credentials:

```bash
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
SUPABASE_STORAGE_BUCKET=inspection-assets
```

*Note: `SUPABASE_SERVICE_ROLE_KEY` is kept exclusively on the backend to execute secure writes and Storage uploads. It is NEVER exposed in the frontend.*
