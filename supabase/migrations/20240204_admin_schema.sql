-- Add role column to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
    END IF;
END $$;

-- Ensure constraints on recipes status
DO $$
BEGIN
    -- First check if the constraint already exists to avoid error
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'recipes_status_check') THEN
        ALTER TABLE recipes ADD CONSTRAINT recipes_status_check 
        CHECK (status IN ('draft', 'pending', 'published', 'rejected'));
    END IF;
END $$;

-- Create index for performance on status
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- RLS Policies

-- 1. Enable RLS on recipes (just in case)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- 2. Policy for Admins to UPDATE recipes
-- We drop it first to ensure we can recreate it with latest logic if it exists
DROP POLICY IF EXISTS "admin_update_recipes" ON recipes;

CREATE POLICY "admin_update_recipes"
ON recipes
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (true);

-- 3. Policy for Admins to SELECT all recipes (if not already covered by public read)
-- Usually public read is enabled, but good to ensure admins can definitely see everything
DROP POLICY IF EXISTS "admin_read_all_recipes" ON recipes;

CREATE POLICY "admin_read_all_recipes"
ON recipes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
