/*
  # Create votes table with user authentication

  1. New Tables
    - `votes`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `question_id` (text)
      - `vote` (text) - constrained to 'yes' or 'no'
      - `voter_id` (uuid) - references authenticated user

  2. Security
    - Enable RLS on `votes` table
    - Add policies for:
      - Authenticated users can read all votes
      - Users can only insert their own votes
*/

CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  question_id text NOT NULL,
  vote text NOT NULL CHECK (vote IN ('yes', 'no')),
  voter_id uuid NOT NULL DEFAULT auth.uid()
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
  WITH CHECK (auth.uid() = voter_id);