-- Prototype Supabase/Postgres schema aligned with src/types.ts
-- Localized text fields are stored as JSONB objects keyed by language code.
-- Example: {"en": "Toy name", "es": "Nombre del juguete"}

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'battery_type') THEN
    CREATE TYPE battery_type AS ENUM ('AA', 'AAA', 'C', 'D', '9V', 'Button Cell', 'other/none');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'toy_feature') THEN
    CREATE TYPE toy_feature AS ENUM ('Light-Up', 'Sound', 'Motion', 'Vibration', 'Remote-Controlled');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS toy_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name jsonb NOT NULL DEFAULT '{}'::jsonb,
  brand text NOT NULL,
  upc text NOT NULL UNIQUE,
  purchase_link text NOT NULL,
  screw_type jsonb NOT NULL DEFAULT '{}'::jsonb,
  battery_type battery_type NOT NULL,
  battery_count integer NOT NULL CHECK (battery_count >= 0),
  toy_feature toy_feature[] NOT NULL DEFAULT '{}'::toy_feature[],
  contributor text NOT NULL
);

CREATE TABLE IF NOT EXISTS pictures (
  picture_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  toy_id uuid NOT NULL REFERENCES toy_metadata(id) ON DELETE CASCADE,
  picture_url text NOT NULL,
  alt_text jsonb NOT NULL DEFAULT '{}'::jsonb,
  caption jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS instruction_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  toy_id uuid NOT NULL REFERENCES toy_metadata(id) ON DELETE CASCADE,
  picture_id uuid NOT NULL REFERENCES pictures(picture_id) ON DELETE RESTRICT,
  step_number integer NOT NULL CHECK (step_number > 0),
  description jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (toy_id, step_number)
);

CREATE INDEX IF NOT EXISTS idx_pictures_toy_id
  ON pictures (toy_id);

CREATE INDEX IF NOT EXISTS idx_instruction_steps_toy_id
  ON instruction_steps (toy_id);

CREATE INDEX IF NOT EXISTS idx_instruction_steps_picture_id
  ON instruction_steps (picture_id);

CREATE INDEX IF NOT EXISTS idx_toy_metadata_name
  ON toy_metadata
  USING gin (name);

CREATE INDEX IF NOT EXISTS idx_pictures_alt_text
  ON pictures
  USING gin (alt_text);

CREATE INDEX IF NOT EXISTS idx_instruction_steps_description
  ON instruction_steps
  USING gin (description);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_toy_metadata_updated_at ON toy_metadata;

CREATE TRIGGER set_toy_metadata_updated_at
BEFORE UPDATE ON toy_metadata
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
