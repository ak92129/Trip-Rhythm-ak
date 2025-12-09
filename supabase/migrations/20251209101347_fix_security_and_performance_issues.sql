/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add missing indexes on foreign keys:
      - `trip_cities.city_id` (for join performance)
      - `trips.origin_city_id` (for join performance)
    
  2. RLS Policy Optimization
    - Optimize all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of the auth function for each row, improving query performance at scale
    - Affects policies on: trips, itineraries, trip_cities tables

  3. Important Notes
    - The unused index warnings are expected for a new application
    - Leaked password protection should be enabled in Supabase Dashboard under Authentication > Providers > Email
*/

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_trip_cities_city_id ON trip_cities(city_id);
CREATE INDEX IF NOT EXISTS idx_trips_origin_city_id ON trips(origin_city_id);

-- Drop existing policies on trips table
DROP POLICY IF EXISTS "Users can read own trips" ON trips;
DROP POLICY IF EXISTS "Users can insert own trips" ON trips;
DROP POLICY IF EXISTS "Users can update own trips" ON trips;
DROP POLICY IF EXISTS "Users can delete own trips" ON trips;

-- Create optimized policies for trips table
CREATE POLICY "Users can read own trips"
  ON trips FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own trips"
  ON trips FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own trips"
  ON trips FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Drop existing policies on itineraries table
DROP POLICY IF EXISTS "Users can read own trip itineraries" ON itineraries;
DROP POLICY IF EXISTS "Users can insert own trip itineraries" ON itineraries;
DROP POLICY IF EXISTS "Users can update own trip itineraries" ON itineraries;
DROP POLICY IF EXISTS "Users can delete own trip itineraries" ON itineraries;

-- Create optimized policies for itineraries table
CREATE POLICY "Users can read own trip itineraries"
  ON itineraries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert own trip itineraries"
  ON itineraries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own trip itineraries"
  ON itineraries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete own trip itineraries"
  ON itineraries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = (select auth.uid())
    )
  );

-- Drop existing policies on trip_cities table
DROP POLICY IF EXISTS "Users can read own trip cities" ON trip_cities;
DROP POLICY IF EXISTS "Users can insert own trip cities" ON trip_cities;
DROP POLICY IF EXISTS "Users can update own trip cities" ON trip_cities;
DROP POLICY IF EXISTS "Users can delete own trip cities" ON trip_cities;

-- Create optimized policies for trip_cities table
CREATE POLICY "Users can read own trip cities"
  ON trip_cities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_cities.trip_id
      AND trips.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can insert own trip cities"
  ON trip_cities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_cities.trip_id
      AND trips.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update own trip cities"
  ON trip_cities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_cities.trip_id
      AND trips.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_cities.trip_id
      AND trips.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete own trip cities"
  ON trip_cities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_cities.trip_id
      AND trips.user_id = (select auth.uid())
    )
  );
