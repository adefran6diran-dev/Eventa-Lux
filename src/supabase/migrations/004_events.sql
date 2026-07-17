-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  guest_count INTEGER NOT NULL,
  budget DECIMAL(14,2) NOT NULL,
  location TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own events" ON events
  FOR ALL USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON events TO authenticated;
GRANT ALL ON events TO service_role;

-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, vendor_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

GRANT SELECT, INSERT, DELETE ON favorites TO authenticated;
GRANT ALL ON favorites TO service_role;

-- Event vendors (shortlist / engagement)
CREATE TABLE event_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, vendor_id)
);

ALTER TABLE event_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owners can manage event_vendors" ON event_vendors
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM events WHERE id = event_vendors.event_id
  ));

CREATE POLICY "Vendors can view own event_vendors" ON event_vendors
  FOR SELECT USING (auth.uid() IN (
    SELECT profile_id FROM vendors WHERE id = event_vendors.vendor_id
  ));

GRANT SELECT, INSERT, UPDATE, DELETE ON event_vendors TO authenticated;
GRANT ALL ON event_vendors TO service_role;
