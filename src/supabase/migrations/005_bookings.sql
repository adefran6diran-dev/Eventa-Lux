-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  package_id UUID REFERENCES vendor_packages(id) ON DELETE SET NULL,
  total_amount DECIMAL(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookings" ON bookings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Vendors can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() IN (
    SELECT profile_id FROM vendors WHERE id = bookings.vendor_id
  ));

GRANT SELECT, INSERT, UPDATE ON bookings TO authenticated;
GRANT ALL ON bookings TO service_role;

-- Messages table (for realtime chat)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read messages for own bookings" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM bookings WHERE id = messages.booking_id
    ) OR auth.uid() IN (
      SELECT profile_id FROM vendors v
      JOIN bookings b ON b.vendor_id = v.id
      WHERE b.id = messages.booking_id
    )
  );

CREATE POLICY "Users can insert messages for own bookings" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM bookings WHERE id = messages.booking_id
    ) OR auth.uid() IN (
      SELECT profile_id FROM vendors v
      JOIN bookings b ON b.vendor_id = v.id
      WHERE b.id = messages.booking_id
    )
  );

GRANT SELECT, INSERT ON messages TO authenticated;
GRANT ALL ON messages TO service_role;

-- Enable realtime for messages and feedback
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE feedback;
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_applications;
