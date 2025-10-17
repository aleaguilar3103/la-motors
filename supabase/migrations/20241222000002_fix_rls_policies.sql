-- Fix RLS policies for vehicles table
DROP POLICY IF EXISTS "Public read access" ON public.vehicles;
DROP POLICY IF EXISTS "Admin full access" ON public.vehicles;

-- Disable RLS temporarily to ensure full access
ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;

-- Create simple policies that allow all operations
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Allow all operations for everyone (since this is a demo app)
CREATE POLICY "Allow all operations" ON public.vehicles
FOR ALL 
USING (true)
WITH CHECK (true);