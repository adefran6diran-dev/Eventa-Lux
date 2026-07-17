-- Vendor applications table
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
GRANT ALL ON vendor_applications TO service_role;

-- Vendors table
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
GRANT ALL ON vendors TO service_role;

-- Vendor photos
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
GRANT ALL ON vendor_photos TO service_role;

-- Vendor packages
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
GRANT ALL ON vendor_packages TO service_role;

-- Vendor photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-photos', 'vendor-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Vendor photos storage public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'vendor-photos');

CREATE POLICY "Vendor photos storage owner write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vendor-photos' AND auth.uid() = owner);
