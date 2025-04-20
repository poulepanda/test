/*
  # Create users table with UUID primary key

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone)
      - `profil` (text)
      - `fname` (text)
      - `lname` (text)
      - `status` (text)
      - `nb_lots` (bigint)
      - `balance` (bigint)
      - `city` (text)
      - `country` (text)
      - `phone` (text)
      - `email` (text)
      - `invest` (bigint)
      - `address` (text)

  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  profil text,
  fname text,
  lname text,
  status text,
  nb_lots bigint,
  balance bigint,
  city text,
  country text,
  phone text,
  email text,
  invest bigint,
  address text
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);