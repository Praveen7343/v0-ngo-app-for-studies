-- Create chairmen table
CREATE TABLE IF NOT EXISTS public.chairmen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'chairman',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE public.chairmen ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Chairmen can view all" ON public.chairmen
  FOR SELECT
  USING (true);

CREATE POLICY "Chairmen can update themselves" ON public.chairmen
  FOR UPDATE
  USING (auth.uid()::text = id::text);
