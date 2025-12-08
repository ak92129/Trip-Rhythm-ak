/*
  # Create cities and trip_cities tables for multi-city trip support

  1. New Tables
    - `cities`
      - `id` (uuid, primary key, auto-generated)
      - `name` (text, required) - City name
      - `country` (text, required) - Country name
      - `country_code` (text, nullable) - 2-character ISO country code
      - `latitude` (decimal, required) - Latitude coordinate
      - `longitude` (decimal, required) - Longitude coordinate
      - `created_at` (timestamptz, default now) - Timestamp of city creation
      - Unique constraint on (name, country) to avoid duplicates

    - `trip_cities`
      - `id` (uuid, primary key, auto-generated)
      - `trip_id` (uuid, foreign key to trips.id) - Reference to parent trip
      - `city_id` (uuid, foreign key to cities.id) - Reference to city
      - `order_index` (integer, required) - Order of city in the trip (1-based)
      - `created_at` (timestamptz, default now) - Timestamp of association creation
      - Unique constraint on (trip_id, order_index) to ensure no duplicate orders
      - Unique constraint on (trip_id, city_id) to prevent same city appearing twice

  2. Security
    - Enable RLS on both tables
    - Add public access policies (no auth for single-user MVP)

  3. Indexes
    - Index on cities.name for quick city lookup
    - Index on trip_cities.trip_id for efficient city retrieval
    - Index on trip_cities.order_index for ordering

  4. Constraints
    - Foreign key from trip_cities.trip_id to trips.id with CASCADE DELETE
    - Foreign key from trip_cities.city_id to cities.id with CASCADE DELETE
    - Check constraint on order_index to ensure positive values
*/

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  country_code text,
  latitude decimal(10, 7) NOT NULL,
  longitude decimal(10, 7) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(name, country)
);

-- Create trip_cities junction table
CREATE TABLE IF NOT EXISTS trip_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_id uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  order_index integer NOT NULL CHECK (order_index > 0),
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(trip_id, order_index),
  UNIQUE(trip_id, city_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country);
CREATE INDEX IF NOT EXISTS idx_trip_cities_trip_id ON trip_cities(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_cities_order_index ON trip_cities(trip_id, order_index);

-- Enable Row Level Security
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_cities ENABLE ROW LEVEL SECURITY;

-- Create public access policies (no auth for single-user MVP)
CREATE POLICY "Public can read cities"
  ON cities FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert cities"
  ON cities FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update cities"
  ON cities FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete cities"
  ON cities FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Public can read trip_cities"
  ON trip_cities FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert trip_cities"
  ON trip_cities FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update trip_cities"
  ON trip_cities FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete trip_cities"
  ON trip_cities FOR DELETE
  TO public
  USING (true);
