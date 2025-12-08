/*
  # Create TripRhythm database schema

  1. New Tables
    - `trips`
      - `id` (uuid, primary key, auto-generated)
      - `destination` (text, required) - City destination for the trip
      - `start_date` (date, required) - Trip start date
      - `days` (integer, required) - Number of days for the trip
      - `travel_style` (text, required) - One of: chill, balanced, intense
      - `walking_tolerance` (text, required) - One of: low, medium, high
      - `wake_time` (text, required) - Wake time in HH:MM format
      - `sleep_time` (text, required) - Sleep time in HH:MM format
      - `must_see_places` (text, nullable) - Comma-separated list of must-see places
      - `created_at` (timestamptz, default now) - Timestamp of trip creation

    - `itineraries`
      - `id` (uuid, primary key, auto-generated)
      - `trip_id` (uuid, foreign key to trips.id) - Reference to parent trip
      - `day_index` (integer, required) - 1-based day number
      - `ai_plan_json` (jsonb, required) - Complete day plan in JSON format
      - `created_at` (timestamptz, default now) - Timestamp of itinerary creation

  2. Security
    - Enable RLS on both tables
    - Add public access policies for single-user MVP (no auth required)

  3. Indexes
    - Index on trips.created_at for sorting recent trips
    - Index on itineraries.trip_id for efficient day lookup
    - Index on itineraries.day_index for ordering

  4. Constraints
    - Foreign key from itineraries.trip_id to trips.id with CASCADE DELETE
*/

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination text NOT NULL,
  start_date date NOT NULL,
  days integer NOT NULL CHECK (days > 0),
  travel_style text NOT NULL CHECK (travel_style IN ('chill', 'balanced', 'intense')),
  walking_tolerance text NOT NULL CHECK (walking_tolerance IN ('low', 'medium', 'high')),
  wake_time text NOT NULL,
  sleep_time text NOT NULL,
  must_see_places text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_index integer NOT NULL CHECK (day_index > 0),
  ai_plan_json jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(trip_id, day_index)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_itineraries_trip_id ON itineraries(trip_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_day_index ON itineraries(trip_id, day_index);

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Create public access policies (no auth for single-user MVP)
CREATE POLICY "Public can read trips"
  ON trips FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert trips"
  ON trips FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update trips"
  ON trips FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete trips"
  ON trips FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Public can read itineraries"
  ON itineraries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert itineraries"
  ON itineraries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update itineraries"
  ON itineraries FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete itineraries"
  ON itineraries FOR DELETE
  TO public
  USING (true);