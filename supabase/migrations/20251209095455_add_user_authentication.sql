/*
  # Add User Authentication Support

  1. Schema Changes
    - Add `user_id` column to `trips` table
      - `user_id` (uuid, nullable initially for backward compatibility)
      - Foreign key reference to `auth.users`
      - Index for query performance

  2. Security Updates
    - Drop all existing public policies on trips, itineraries, cities, and trip_cities
    - Create new auth-based RLS policies:
      - Trips: Users can only access their own trips
      - Itineraries: Users can only access itineraries for their own trips
      - Cities: Shared resource (all authenticated users can read/write)
      - Trip_cities: Access controlled through trip ownership

  3. Important Notes
    - user_id is nullable initially to preserve existing data
    - After migration, all new trips must have user_id set
    - Existing trips will have null user_id (can be cleaned up later)
*/

-- Add user_id column to trips table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE trips ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);

-- Drop all existing public policies on trips
DROP POLICY IF EXISTS "Public can read trips" ON trips;
DROP POLICY IF EXISTS "Public can insert trips" ON trips;
DROP POLICY IF EXISTS "Public can update trips" ON trips;
DROP POLICY IF EXISTS "Public can delete trips" ON trips;

-- Create auth-based policies for trips
CREATE POLICY "Users can read own trips"
  ON trips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
  ON trips FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop all existing public policies on itineraries
DROP POLICY IF EXISTS "Public can read itineraries" ON itineraries;
DROP POLICY IF EXISTS "Public can insert itineraries" ON itineraries;
DROP POLICY IF EXISTS "Public can update itineraries" ON itineraries;
DROP POLICY IF EXISTS "Public can delete itineraries" ON itineraries;

-- Create auth-based policies for itineraries (access via trip ownership)
CREATE POLICY "Users can read own trip itineraries"
  ON itineraries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own trip itineraries"
  ON itineraries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own trip itineraries"
  ON itineraries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own trip itineraries"
  ON itineraries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Drop all existing public policies on cities
DROP POLICY IF EXISTS "Public can read cities" ON cities;
DROP POLICY IF EXISTS "Public can insert cities" ON cities;
DROP POLICY IF EXISTS "Public can update cities" ON cities;
DROP POLICY IF EXISTS "Public can delete cities" ON cities;

-- Create policies for cities (shared resource for all authenticated users)
CREATE POLICY "Authenticated users can read cities"
  ON cities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert cities"
  ON cities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cities"
  ON cities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cities"
  ON cities FOR DELETE
  TO authenticated
  USING (true);

-- Drop all existing public policies on trip_cities
DROP POLICY IF EXISTS "Public can read trip_cities" ON trip_cities;
DROP POLICY IF EXISTS "Public can insert trip_cities" ON trip_cities;
DROP POLICY IF EXISTS "Public can update trip_cities" ON trip_cities;
DROP POLICY IF EXISTS "Public can delete trip_cities" ON trip_cities;

-- Create auth-based policies for trip_cities (access via trip ownership)
CREATE POLICY "Users can read own trip cities"
  ON trip_cities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_cities.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own trip cities"
  ON trip_cities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_cities.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own trip cities"
  ON trip_cities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_cities.trip_id
      AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_cities.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own trip cities"
  ON trip_cities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_cities.trip_id
      AND trips.user_id = auth.uid()
    )
  );