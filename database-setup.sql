-- ==========================================
-- DRYBUILD PRO - DATABASE SETUP
-- Complete Supabase Database Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- DROP EXISTING TABLES (for clean setup)
-- ==========================================
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS voice_notes CASCADE;
DROP TABLE IF EXISTS material_requests CASCADE;
DROP TABLE IF EXISTS defect_phases CASCADE;
DROP TABLE IF EXISTS phase_notes CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS activity_phases CASCADE;
DROP TABLE IF EXISTS defects CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ==========================================
-- USER PROFILES TABLE
-- ==========================================
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('supervisor', 'trade')),
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- SITES TABLE
-- ==========================================
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  client TEXT,
  project_manager UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  start_date DATE,
  expected_completion DATE,
  total_units INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- EMPLOYEES TABLE
-- ==========================================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  start_date DATE,
  status TEXT DEFAULT 'active',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- MATERIALS TABLE
-- ==========================================
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  sku TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ACTIVITIES TABLE
-- ==========================================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('normal', 'patch')),
  level TEXT NOT NULL,
  unit TEXT NOT NULL,
  description TEXT,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  overall_progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ACTIVITY PHASES TABLE
-- ==========================================
CREATE TABLE activity_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
  phase_name TEXT NOT NULL,
  phase_order INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- PHASE NOTES TABLE
-- ==========================================
CREATE TABLE phase_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id UUID REFERENCES activity_phases(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- PHOTOS TABLE
-- ==========================================
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES activity_phases(id) ON DELETE CASCADE,
  defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- DEFECTS TABLE
-- ==========================================
CREATE TABLE defects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  level TEXT NOT NULL,
  unit TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
  reported_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- DEFECT PHASES TABLE
-- ==========================================
CREATE TABLE defect_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  defect_id UUID REFERENCES defects(id) ON DELETE CASCADE NOT NULL,
  phase_name TEXT NOT NULL,
  phase_order INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- MATERIAL REQUESTS TABLE
-- ==========================================
CREATE TABLE material_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  level TEXT NOT NULL,
  unit_location TEXT NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'normal', 'urgent')),
  notes TEXT,
  photo_url TEXT,
  requested_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- VOICE NOTES TABLE
-- ==========================================
CREATE TABLE voice_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  duration INTEGER NOT NULL,
  transcription TEXT,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES activity_phases(id) ON DELETE CASCADE,
  defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  action_data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_activities_assigned_to ON activities(assigned_to);
CREATE INDEX idx_activities_site_id ON activities(site_id);
CREATE INDEX idx_activities_created_by ON activities(created_by);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_status ON activities(status);

CREATE INDEX idx_activity_phases_activity_id ON activity_phases(activity_id);
CREATE INDEX idx_activity_phases_status ON activity_phases(status);

CREATE INDEX idx_defects_assigned_to ON defects(assigned_to);
CREATE INDEX idx_defects_status ON defects(status);
CREATE INDEX idx_defects_priority ON defects(priority);
CREATE INDEX idx_defects_reported_by ON defects(reported_by);

CREATE INDEX idx_defect_phases_defect_id ON defect_phases(defect_id);

CREATE INDEX idx_material_requests_status ON material_requests(status);
CREATE INDEX idx_material_requests_requested_by ON material_requests(requested_by);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX idx_photos_activity ON photos(activity_id);
CREATE INDEX idx_photos_defect ON photos(defect_id);
CREATE INDEX idx_photos_phase ON photos(phase_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE defect_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_notes ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Activities Policies
CREATE POLICY "Supervisors can view all activities" ON activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Trade workers can view assigned activities" ON activities
  FOR SELECT USING (
    assigned_to IN (
      SELECT id FROM employees WHERE email = (
        SELECT email FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Supervisors can insert activities" ON activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Supervisors can update activities" ON activities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Assigned users can update activity progress" ON activities
  FOR UPDATE USING (
    assigned_to IN (
      SELECT id FROM employees WHERE email = (
        SELECT email FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Supervisors can delete activities" ON activities
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- Activity Phases Policies
CREATE POLICY "Users can view phases of activities they can see" ON activity_phases
  FOR SELECT USING (true);

CREATE POLICY "Users can insert phases" ON activity_phases
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update phases" ON activity_phases
  FOR UPDATE USING (true);

-- Defects Policies
CREATE POLICY "Everyone can view defects" ON defects
  FOR SELECT USING (true);

CREATE POLICY "Everyone can create defects" ON defects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Supervisors and assigned users can update defects" ON defects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    ) OR
    assigned_to IN (
      SELECT id FROM employees WHERE email = (
        SELECT email FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

-- Defect Phases Policies
CREATE POLICY "Everyone can view defect phases" ON defect_phases
  FOR SELECT USING (true);

CREATE POLICY "Users can insert defect phases" ON defect_phases
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update defect phases" ON defect_phases
  FOR UPDATE USING (true);

-- Material Requests Policies
CREATE POLICY "Everyone can view own requests" ON material_requests
  FOR SELECT USING (requested_by = auth.uid());

CREATE POLICY "Supervisors can view all requests" ON material_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Everyone can create requests" ON material_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Supervisors can update requests" ON material_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Sites Policies (Supervisor only)
CREATE POLICY "Supervisors can view sites" ON sites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Supervisors can insert sites" ON sites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Supervisors can update sites" ON sites
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Supervisors can delete sites" ON sites
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- Employees Policies (Supervisor only)
CREATE POLICY "Everyone can view employees" ON employees
  FOR SELECT USING (true);

CREATE POLICY "Supervisors can insert employees" ON employees
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Supervisors can update employees" ON employees
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Supervisors can delete employees" ON employees
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- Materials Policies (Supervisor only)
CREATE POLICY "Everyone can view materials" ON materials
  FOR SELECT USING (true);

CREATE POLICY "Supervisors can insert materials" ON materials
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Supervisors can update materials" ON materials
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Supervisors can delete materials" ON materials
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- Photos Policies
CREATE POLICY "Everyone can view photos" ON photos
  FOR SELECT USING (true);

CREATE POLICY "Users can insert photos" ON photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own photos" ON photos
  FOR DELETE USING (uploaded_by = auth.uid());

-- Voice Notes Policies
CREATE POLICY "Everyone can view voice notes" ON voice_notes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert voice notes" ON voice_notes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own voice notes" ON voice_notes
  FOR DELETE USING (created_by = auth.uid());

-- Phase Notes Policies
CREATE POLICY "Everyone can view phase notes" ON phase_notes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert phase notes" ON phase_notes
  FOR INSERT WITH CHECK (true);

-- ==========================================
-- FUNCTIONS AND TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to relevant tables
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_defects_updated_at
  BEFORE UPDATE ON defects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_activity_phases_updated_at
  BEFORE UPDATE ON activity_phases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to calculate activity overall progress
CREATE OR REPLACE FUNCTION calculate_activity_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE activities
  SET overall_progress = (
    SELECT COALESCE(AVG(progress), 0)::INTEGER
    FROM activity_phases
    WHERE activity_id = NEW.activity_id
  )
  WHERE id = NEW.activity_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update activity progress when phases change
CREATE TRIGGER update_activity_progress
  AFTER INSERT OR UPDATE OR DELETE ON activity_phases
  FOR EACH ROW
  EXECUTE FUNCTION calculate_activity_progress();

-- Function to auto-create phases when activity is created
CREATE OR REPLACE FUNCTION create_activity_phases()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'normal' THEN
    -- Create 5 phases for normal units
    INSERT INTO activity_phases (activity_id, phase_name, phase_order) VALUES
      (NEW.id, 'Plasterboard Fixing', 1),
      (NEW.id, 'Taping', 2),
      (NEW.id, 'Second Coat', 3),
      (NEW.id, 'Top Coat', 4),
      (NEW.id, 'Sanding', 5);
  ELSIF NEW.type = 'patch' THEN
    -- Create 4 phases for patches
    INSERT INTO activity_phases (activity_id, phase_name, phase_order) VALUES
      (NEW.id, 'Assessment', 1),
      (NEW.id, 'Repair', 2),
      (NEW.id, 'Finishing', 3),
      (NEW.id, 'Final Inspection', 4);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create phases
CREATE TRIGGER create_phases_on_activity_insert
  AFTER INSERT ON activities
  FOR EACH ROW
  EXECUTE FUNCTION create_activity_phases();

-- Function to auto-create defect phases
CREATE OR REPLACE FUNCTION create_defect_phases()
RETURNS TRIGGER AS $$
BEGIN
  -- Create 4 phases for defects
  INSERT INTO defect_phases (defect_id, phase_name, phase_order) VALUES
    (NEW.id, 'Assessment', 1),
    (NEW.id, 'Repair', 2),
    (NEW.id, 'Finishing', 3),
    (NEW.id, 'Inspection', 4);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create defect phases
CREATE TRIGGER create_phases_on_defect_insert
  AFTER INSERT ON defects
  FOR EACH ROW
  EXECUTE FUNCTION create_defect_phases();

-- ==========================================
-- SAMPLE DATA FOR TESTING (OPTIONAL)
-- ==========================================

-- Insert sample material categories
INSERT INTO materials (name, category, unit, sku, status) VALUES
  ('13mm Standard Plasterboard', 'Plasterboard', 'sheets', 'PB-13-STD', 'active'),
  ('13mm Water-Resistant Plasterboard', 'Plasterboard', 'sheets', 'PB-13-WR', 'active'),
  ('16mm Fire-Resistant Plasterboard', 'Plasterboard', 'sheets', 'PB-16-FR', 'active'),
  ('Base Coat Compound', 'Compound', 'bags', 'CC-BASE', 'active'),
  ('Top Coat Compound', 'Compound', 'bags', 'CC-TOP', 'active'),
  ('Paper Tape', 'Tape', 'rolls', 'TP-PAPER', 'active'),
  ('Mesh Tape', 'Tape', 'rolls', 'TP-MESH', 'active'),
  ('Metal Corner Bead', 'Corner Bead', 'units', 'CB-METAL', 'active'),
  ('Drywall Screws 25mm', 'Fasteners', 'boxes', 'SCR-25', 'active'),
  ('Drywall Screws 32mm', 'Fasteners', 'boxes', 'SCR-32', 'active');

-- ==========================================
-- STORAGE BUCKETS (Run in Supabase Dashboard > Storage)
-- ==========================================
-- You need to manually create these buckets in Supabase Dashboard:
-- 1. 'photos' - for activity/defect photos
-- 2. 'voice-notes' - for voice recordings
-- 3. 'avatars' - for user profile pictures

-- Storage policies (run after creating buckets):
-- For photos bucket:
-- POLICY: authenticated users can upload
-- POLICY: public can view

-- For voice-notes bucket:
-- POLICY: authenticated users can upload
-- POLICY: authenticated users can view own notes

-- For avatars bucket:
-- POLICY: authenticated users can upload own avatar
-- POLICY: public can view

-- ==========================================
-- SETUP COMPLETE
-- ==========================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Create storage buckets as described above
-- 3. Set up storage policies
-- 4. Update your .env file with Supabase credentials
-- 5. Start the application with npm start
