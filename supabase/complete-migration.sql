-- ============================================================
-- Eventa — Complete Database Migration
-- Run this entire script in the Supabase SQL Editor once.
-- Order: 001→006 + feedback table + seed data
-- ============================================================

-- 001: Roles ---------------------------------------------------
CREATE TYPE app_role AS ENUM ('admin', 'vendor', 'user');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL USING (has_role(auth.uid(), 'admin'));

GRANT SELECT ON user_roles TO authenticated;

CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

GRANT EXECUTE ON FUNCTION has_role TO authenticated;
GRANT EXECUTE ON FUNCTION has_role TO service_role;

-- 002: Profiles ------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

GRANT SELECT ON profiles TO anon;
GRANT SELECT ON profiles TO authenticated;
GRANT INSERT, UPDATE ON profiles TO authenticated;

CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_profile();

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatar public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Avatar owner write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Avatar owner update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- 003: Vendors -------------------------------------------------
CREATE TABLE vendor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT,
  website TEXT,
  instagram TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own applications" ON vendor_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON vendor_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all applications" ON vendor_applications
  FOR ALL USING (has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT ON vendor_applications TO authenticated;

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT,
  website TEXT,
  instagram TEXT,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors are publicly readable" ON vendors
  FOR SELECT USING (true);

CREATE POLICY "Vendors can update own profile" ON vendors
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Admins can manage all vendors" ON vendors
  FOR ALL USING (has_role(auth.uid(), 'admin'));

GRANT SELECT ON vendors TO anon;
GRANT SELECT ON vendors TO authenticated;

CREATE TABLE vendor_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE vendor_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendor photos publicly readable" ON vendor_photos
  FOR SELECT USING (true);

CREATE POLICY "Vendor owners can manage photos" ON vendor_photos
  FOR ALL USING (auth.uid() IN (
    SELECT profile_id FROM vendors WHERE id = vendor_photos.vendor_id
  ));

GRANT SELECT ON vendor_photos TO anon;
GRANT SELECT ON vendor_photos TO authenticated;

CREATE TABLE vendor_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE vendor_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Packages publicly readable" ON vendor_packages
  FOR SELECT USING (true);

CREATE POLICY "Vendor owners can manage packages" ON vendor_packages
  FOR ALL USING (auth.uid() IN (
    SELECT profile_id FROM vendors WHERE id = vendor_packages.vendor_id
  ));

GRANT SELECT ON vendor_packages TO anon;
GRANT SELECT ON vendor_packages TO authenticated;

INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-photos', 'vendor-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Vendor photos storage public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'vendor-photos');

CREATE POLICY "Vendor photos storage owner write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vendor-photos' AND auth.uid() = owner);

-- 004: Events --------------------------------------------------
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

-- 005: Bookings & Messages -------------------------------------
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

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('praise', 'complaint', 'suggestion')),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback" ON feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage feedback" ON feedback
  FOR ALL USING (has_role(auth.uid(), 'admin'));

GRANT INSERT ON feedback TO anon;
GRANT INSERT ON feedback TO authenticated;
GRANT SELECT, UPDATE ON feedback TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE feedback;
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_applications;

-- 006: Admin RPCs ----------------------------------------------
CREATE OR REPLACE FUNCTION approve_vendor_application(application_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  app_record RECORD;
  new_vendor_id UUID;
BEGIN
  SELECT * INTO app_record FROM vendor_applications WHERE id = application_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  INSERT INTO vendors (profile_id, business_name, category, description, location, website, instagram, is_verified)
  VALUES (
    app_record.user_id,
    app_record.business_name,
    app_record.category,
    app_record.description,
    app_record.location,
    app_record.website,
    app_record.instagram,
    true
  )
  RETURNING id INTO new_vendor_id;

  INSERT INTO user_roles (user_id, role) VALUES (app_record.user_id, 'vendor')
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE vendor_applications SET status = 'approved', updated_at = now() WHERE id = application_id;
END;
$$;

GRANT EXECUTE ON FUNCTION approve_vendor_application TO service_role;
GRANT EXECUTE ON FUNCTION approve_vendor_application TO authenticated;

CREATE OR REPLACE FUNCTION reject_vendor_application(application_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE vendor_applications SET status = 'rejected', updated_at = now() WHERE id = application_id;
END;
$$;

GRANT EXECUTE ON FUNCTION reject_vendor_application TO service_role;
GRANT EXECUTE ON FUNCTION reject_vendor_application TO authenticated;

-- ============================================================
-- Auth Settings (run separately in Dashboard, see instructions)
-- ============================================================

-- ============================================================
-- Seed Data (run AFTER first user signs up so profile exists)
-- ============================================================
