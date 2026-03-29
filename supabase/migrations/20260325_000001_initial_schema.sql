-- Husky Manual Engine
-- This file is the saved SQL record of the database schema for the project.
-- Think of it as the version-controlled copy of what you would run in Supabase
-- to create or rebuild the schema structure.
--
-- File name notes:
-- - 20260325 = the date this schema file was created
-- - 000001 = the migration order number
-- - initial_schema = a short description of what the file contains
--
-- This migration is aligned with src/types.ts as of 2026-03-25.
--
-- It is written to be safer to review and re-run in development:
-- - CREATE ... IF NOT EXISTS is used where possible
-- - enum creation is guarded with pg_type checks
-- - trigger replacement is explicit
--
-- If your hosted Supabase project already has a different live schema,
-- review this file before applying it so it can be turned into ALTER statements
-- instead of creating overlapping structures.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a controlled list of battery labels so records stay consistent.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'battery_type') THEN
    CREATE TYPE battery_type AS ENUM (
      'AA',
      'AAA',
      'C',
      'D',
      '9V',
      'Button Cell',
      'other/none'
    );
  END IF;
END
$$;

-- Create a controlled list of toy features that a manual may refer to.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'toy_feature') THEN
    CREATE TYPE toy_feature AS ENUM (
      'Light-Up',
      'Sound',
      'Motion',
      'Vibration',
      'Remote-Controlled'
    );
  END IF;
END
$$;

-- Main toy table: one row per toy/manual record.
CREATE TABLE IF NOT EXISTS public.toy_metadata (
  -- Stable internal ID used by related tables.
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Audit fields help with future editing workflows and version tracking.
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Localized fields are stored as JSON objects like {"en": "...", "es": "..."}.
  name jsonb NOT NULL DEFAULT '{}'::jsonb,
  brand text NOT NULL,
  -- UPC is unique so the same product is not accidentally entered twice.
  upc text NOT NULL UNIQUE,
  purchase_link text NOT NULL,
  screw_type jsonb NOT NULL DEFAULT '{}'::jsonb,
  battery_type battery_type NOT NULL,
  battery_count integer NOT NULL CHECK (battery_count >= 0),
  -- PostgreSQL can store an array of enum values for multi-feature toys.
  toy_feature toy_feature[] NOT NULL DEFAULT '{}'::toy_feature[],
  contributor text NOT NULL
);

-- Reusable image records live separately from steps.
-- This makes it possible to use one picture in multiple places.
CREATE TABLE IF NOT EXISTS public.pictures (
  picture_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  toy_id uuid NOT NULL REFERENCES public.toy_metadata(id) ON DELETE CASCADE,
  picture_url text NOT NULL,
  alt_text jsonb NOT NULL DEFAULT '{}'::jsonb,
  caption jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Ordered procedural steps for a given toy/manual.
CREATE TABLE IF NOT EXISTS public.instruction_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  toy_id uuid NOT NULL REFERENCES public.toy_metadata(id) ON DELETE CASCADE,
  -- Step numbers must be positive and unique within a single toy.
  step_number integer NOT NULL CHECK (step_number > 0),
  description jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (toy_id, step_number)
);

-- Join table connecting steps to pictures.
-- This supports many-to-many reuse plus display metadata.
CREATE TABLE IF NOT EXISTS public.instruction_step_pictures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  step_id uuid NOT NULL REFERENCES public.instruction_steps(id) ON DELETE CASCADE,
  picture_id uuid NOT NULL REFERENCES public.pictures(picture_id) ON DELETE CASCADE,
  -- Controls the order pictures appear within a step.
  display_order integer NOT NULL DEFAULT 1 CHECK (display_order > 0),
  -- Allows the UI to identify a single "hero" image for the step.
  is_primary boolean NOT NULL DEFAULT false,
  UNIQUE (step_id, picture_id),
  UNIQUE (step_id, display_order)
);

-- Foreign-key indexes keep related-record lookups fast.
CREATE INDEX IF NOT EXISTS idx_pictures_toy_id
  ON public.pictures (toy_id);

CREATE INDEX IF NOT EXISTS idx_instruction_steps_toy_id
  ON public.instruction_steps (toy_id);

CREATE INDEX IF NOT EXISTS idx_instruction_step_pictures_step_id
  ON public.instruction_step_pictures (step_id);

CREATE INDEX IF NOT EXISTS idx_instruction_step_pictures_picture_id
  ON public.instruction_step_pictures (picture_id);

-- GIN indexes help with searching inside JSONB localized text fields.
CREATE INDEX IF NOT EXISTS idx_toy_metadata_name
  ON public.toy_metadata
  USING gin (name);

CREATE INDEX IF NOT EXISTS idx_pictures_alt_text
  ON public.pictures
  USING gin (alt_text);

CREATE INDEX IF NOT EXISTS idx_instruction_steps_description
  ON public.instruction_steps
  USING gin (description);

CREATE UNIQUE INDEX IF NOT EXISTS idx_instruction_step_primary_picture
  ON public.instruction_step_pictures (step_id)
  WHERE is_primary;

-- This trigger function automatically refreshes `updated_at`
-- whenever a toy record changes.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_toy_metadata_updated_at ON public.toy_metadata;

-- Attach the timestamp-updating behavior to the main toy table.
CREATE TRIGGER set_toy_metadata_updated_at
BEFORE UPDATE ON public.toy_metadata
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
