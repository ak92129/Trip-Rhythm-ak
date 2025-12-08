/*
  # Add country fields to trips table

  1. Changes
    - Add `country` column to `trips` table (text, nullable for backward compatibility)
    - Add `country_code` column to `trips` table (text, nullable, 2-char ISO code)
  
  2. Notes
    - Columns are nullable to maintain backward compatibility with existing trips
    - New trips should populate these fields via city autocomplete
*/

-- Add country column to trips table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'country'
  ) THEN
    ALTER TABLE trips ADD COLUMN country text;
  END IF;
END $$;

-- Add country_code column to trips table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE trips ADD COLUMN country_code text;
  END IF;
END $$;
