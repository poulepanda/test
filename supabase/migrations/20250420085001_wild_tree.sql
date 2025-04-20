/*
  # Create users table with incrementing ID

  1. New Tables
    - `users`
      - `id` (bigint, primary key, starts from 100)
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

CREATE SEQUENCE IF NOT EXISTS users_id_seq START WITH 100;

CREATE TABLE IF NOT EXISTS users (
  id bigint PRIMARY KEY DEFAULT nextval('users_id_seq'),
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
  USING (true);