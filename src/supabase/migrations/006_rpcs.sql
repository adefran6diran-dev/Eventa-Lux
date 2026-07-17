-- Approve vendor application
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
  -- Get application
  SELECT * INTO app_record FROM vendor_applications WHERE id = application_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  -- Create vendor record
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

  -- Grant vendor role
  INSERT INTO user_roles (user_id, role) VALUES (app_record.user_id, 'vendor')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Mark application as approved
  UPDATE vendor_applications SET status = 'approved', updated_at = now() WHERE id = application_id;
END;
$$;

GRANT EXECUTE ON FUNCTION approve_vendor_application TO service_role;
GRANT EXECUTE ON FUNCTION approve_vendor_application TO authenticated;

-- Reject vendor application
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
