/*
  # Update votes table and policies

  1. Table Structure
    - `votes`
      - `id` (bigint, primary key)
      - `created_at` (timestamptz)
      - `vote` (text)
      - `voter_id` (text)
      - `question_id` (text)

  2. Security
    - Enable RLS
    - Add policies if they don't exist
*/

CREATE TABLE IF NOT EXISTS votes (
  id bigint PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  vote text,
  voter_id text,
  question_id text
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'votes' 
    AND policyname = 'Users can read all votes'
  ) THEN
    CREATE POLICY "Users can read all votes"
      ON votes
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'votes' 
    AND policyname = 'Users can insert their own votes'
  ) THEN
    CREATE POLICY "Users can insert their own votes"
      ON votes
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;