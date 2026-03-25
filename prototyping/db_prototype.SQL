CREATE TABLE toy_manuals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  
  -- Metadata (Flat Text)
  toy_name text NOT NULL,
  brand text,
  upc text UNIQUE, -- Text is correct!
  purchase_link text,
  screw_type text, -- e.g., "Phillips", "Flathead", "Torx" 
  toy_features jsonb DEFAULT '[]'::jsonb, -- e.g., ["Light", "Sound"]
  adapted_function jsonb DEFAULT '[]'::jsonb, -- e.g., ["on/off switch", "volume control"]
  instructions jsonb DEFAULT '[]'::jsonb
  battery_type text, -- e.g., "AA", "AAA", "9V"
  battery_count integer, -- e.g., 2
  screw_count jsonb DEFAULT '{}'::jsonb, -- e.g., {"Phillips": 4, "Flathead": 2}
  contributing_entity text,

);

