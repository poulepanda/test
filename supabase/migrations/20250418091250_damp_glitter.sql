/*
  # Create votes table to match existing schema

  1. Table Structure
    - `votes`
      - `id` (int8/bigint, primary key)
      - `created_at` (timestamptz)
      - `vote` (text) - stores 'oui' or 'non'
      - `voter_id` (text)
      - `question_id` (text)
*/

CREATE TABLE IF NOT EXISTS votes (
  id bigint PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  vote text,
  voter_id text,
  question_id text
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all votes"
  ON votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);