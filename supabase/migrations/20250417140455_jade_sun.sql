/*
  # Add balance field to Trades table

  1. Changes
    - Add `balance` column to `Trades` table
      - Type: numeric to store decimal values
      - Nullable: true to maintain compatibility with existing records
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Trades' AND column_name = 'balance'
  ) THEN
    ALTER TABLE "Trades" ADD COLUMN balance numeric;
  END IF;
END $$;