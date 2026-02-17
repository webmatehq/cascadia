ALTER TABLE events
  ADD COLUMN IF NOT EXISTS ordered_list boolean NOT NULL DEFAULT false;
