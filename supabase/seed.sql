-- Seed 6 luxury vendors
INSERT INTO vendors (id, profile_id, business_name, category, description, location, website, instagram, rating, review_count, is_verified)
VALUES
  (
    'v1-vendor-0000-0000-0000-000000000001',
    (SELECT id FROM profiles LIMIT 1),
    'Lagos Grand Venue',
    'venue',
    'An opulent waterfront event space in Victoria Island, featuring crystal chandeliers, marble finishes, and panoramic ocean views. Capacity for 1,200 guests.',
    'Victoria Island, Lagos',
    'https://lagosgrandvenue.com',
    '@lagosgrandvenue',
    4.9, 124, true
  ),
  (
    'v2-vendor-0000-0000-0000-000000000002',
    (SELECT id FROM profiles LIMIT 1),
    'Elegance by Efe',
    'decoration',
    'Award-winning luxury event styling and décor. Specializing in bespoke floral arrangements, lighting design, and immersive thematic transformations.',
    'Ikoyi, Lagos',
    'https://elegancebyefe.com',
    '@elegancebyefe',
    4.8, 89, true
  ),
  (
    'v3-vendor-0000-0000-0000-000000000003',
    (SELECT id FROM profiles LIMIT 1),
    'Savoir Faire Catering',
    'catering',
    'Continental and indigenous haute cuisine by Chef Amara. Every dish is a work of art, using the finest local and imported ingredients.',
    'Lekki, Lagos',
    'https://savoirfaire.ng',
    '@savoirfairecatering',
    4.9, 203, true
  ),
  (
    'v4-vendor-0000-0000-0000-000000000004',
    (SELECT id FROM profiles LIMIT 1),
    'Lens & Legacy',
    'photography',
    'Premium photography and cinematography with a fine-art editorial approach. We capture the poetry of your most important moments.',
    'Abuja',
    'https://lenslegacy.com',
    '@lenslegacy',
    4.7, 67, true
  ),
  (
    'v5-vendor-0000-0000-0000-000000000005',
    (SELECT id FROM profiles LIMIT 1),
    'Harmony & Strings',
    'music',
    'Nigeria''s premier live music ensemble. From string quartets to full orchestras and contemporary Afrobeats bands, we set the perfect tone.',
    'Lagos / Abuja',
    'https://harmonyandstrings.com',
    '@harmonyandstrings',
    4.8, 95, true
  ),
  (
    'v6-vendor-0000-0000-0000-000000000006',
    (SELECT id FROM profiles LIMIT 1),
    'Gold & Glow Beauty',
    'makeup',
    'Celebrity makeup artistry and bridal styling. We create signature looks that radiate confidence and sophistication.',
    'Victoria Island, Lagos',
    'https://goldglowbeauty.com',
    '@goldglowbeauty',
    4.6, 143, false
  )
ON CONFLICT (id) DO NOTHING;

-- Seed vendor photos
INSERT INTO vendor_photos (vendor_id, url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', true FROM vendors WHERE business_name = 'Lagos Grand Venue'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', false FROM vendors WHERE business_name = 'Lagos Grand Venue'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', true FROM vendors WHERE business_name = 'Elegance by Efe'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80', false FROM vendors WHERE business_name = 'Elegance by Efe'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80', true FROM vendors WHERE business_name = 'Savoir Faire Catering'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', false FROM vendors WHERE business_name = 'Savoir Faire Catering'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', true FROM vendors WHERE business_name = 'Lens & Legacy'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80', false FROM vendors WHERE business_name = 'Lens & Legacy'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80', true FROM vendors WHERE business_name = 'Harmony & Strings'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', false FROM vendors WHERE business_name = 'Harmony & Strings'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80', true FROM vendors WHERE business_name = 'Gold & Glow Beauty'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&q=80', false FROM vendors WHERE business_name = 'Gold & Glow Beauty'
ON CONFLICT DO NOTHING;

-- Seed vendor packages
INSERT INTO vendor_packages (vendor_id, name, description, price, currency)
SELECT id, 'Silver Hall', 'Half-day rental, 200 guests', 2500000, 'NGN' FROM vendors WHERE business_name = 'Lagos Grand Venue'
UNION ALL
SELECT id, 'Gold Hall', 'Full-day rental, 500 guests', 5000000, 'NGN' FROM vendors WHERE business_name = 'Lagos Grand Venue'
UNION ALL
SELECT id, 'Platinum Suite', 'Full weekend, 1,200 guests', 12000000, 'NGN' FROM vendors WHERE business_name = 'Lagos Grand Venue'
UNION ALL
SELECT id, 'Classic Décor', 'Floral centerpieces, draping, lighting', 1500000, 'NGN' FROM vendors WHERE business_name = 'Elegance by Efe'
UNION ALL
SELECT id, 'Luxury Transformation', 'Full venue redesign, custom installations', 4000000, 'NGN' FROM vendors WHERE business_name = 'Elegance by Efe'
UNION ALL
SELECT id, 'Tasting Menu', '5-course, 50 guests', 800000, 'NGN' FROM vendors WHERE business_name = 'Savoir Faire Catering'
UNION ALL
SELECT id, 'Grand Buffet', '8-course, 150 guests', 2000000, 'NGN' FROM vendors WHERE business_name = 'Savoir Faire Catering'
UNION ALL
SELECT id, 'Imperial Service', 'Full waitstaff, 300 guests', 6000000, 'NGN' FROM vendors WHERE business_name = 'Savoir Faire Catering'
UNION ALL
SELECT id, 'Essentials', '6 hours, 300 edited photos', 500000, 'NGN' FROM vendors WHERE business_name = 'Lens & Legacy'
UNION ALL
SELECT id, 'Luxury', '12 hours, 2 photographers, album', 1200000, 'NGN' FROM vendors WHERE business_name = 'Lens & Legacy'
UNION ALL
SELECT id, 'Cinematic', 'Full film + photography team', 3000000, 'NGN' FROM vendors WHERE business_name = 'Lens & Legacy'
UNION ALL
SELECT id, 'Soloist', 'Solo pianist or harpist', 350000, 'NGN' FROM vendors WHERE business_name = 'Harmony & Strings'
UNION ALL
SELECT id, 'Quartet', 'String quartet, 3 hours', 900000, 'NGN' FROM vendors WHERE business_name = 'Harmony & Strings'
UNION ALL
SELECT id, 'Grand Ensemble', '12-piece band + sound', 3500000, 'NGN' FROM vendors WHERE business_name = 'Harmony & Strings'
UNION ALL
SELECT id, 'Bridal Trial', 'Consultation + trial look', 150000, 'NGN' FROM vendors WHERE business_name = 'Gold & Glow Beauty'
UNION ALL
SELECT id, 'Bridal Full', 'Bridal + 3 bridesmaids', 500000, 'NGN' FROM vendors WHERE business_name = 'Gold & Glow Beauty'
UNION ALL
SELECT id, 'VIP Glam', 'Full bridal party + mother', 1200000, 'NGN' FROM vendors WHERE business_name = 'Gold & Glow Beauty'
ON CONFLICT DO NOTHING;
