/*
  # Add gender column to votes table

  1. Changes
    - Add `gender` column to `votes` table
      - Type: text
      - Constraint: must be either 'men' or 'women'
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'gender'
  ) THEN
    ALTER TABLE votes ADD COLUMN gender text CHECK (gender IN ('men', 'women'));
  END IF;
END $$;