/*
  # Fix users table ID generation

  1. Changes
    - Add sequence for users table ID
    - Modify users table to use the sequence as default value
    - Add NOT NULL constraint to created_at column
  
  2. Reasoning
    - Ensures automatic ID generation for new users
    - Maintains data integrity with proper constraints
*/

-- Create sequence for users table if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Modify the users table to use the sequence
ALTER TABLE users 
  ALTER COLUMN id SET DEFAULT nextval('users_id_seq'),
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL;

-- Update the sequence to start after the maximum existing ID
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);