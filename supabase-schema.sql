-- DryBuild Pro Database Schema

-- Users table (handled by Supabase Auth)
-- Additional user profile data
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('supervisor', 'trade')),
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sites
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  client TEXT,
  project_manager UUID REFERENCES user_profiles(id),
  start_date DATE,
  expected_completion DATE,
  total_units INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Materials
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  sku TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('normal', 'patch')),
  level TEXT NOT NULL,
  unit TEXT NOT NULL,
  description TEXT,
  site_id UUID REFERENCES sites(id),
  assigned_to UUID REFERENCES employees(id),
  created_by UUID REFERENCES user_profiles(id),
  status TEXT DEFAULT 'pending',
  overall_progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Phases
CREATE TABLE activity_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  phase_name TEXT NOT NULL,
  phase_order INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase Notes
CREATE TABLE phase_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID REFERENCES activity_phases(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES activity_phases(id) ON DELETE CASCADE,
  defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Defects
CREATE TABLE defects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  level TEXT NOT NULL,
  unit TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  activity_id UUID REFERENCES activities(id),
  site_id UUID REFERENCES sites(id),
  assigned_to UUID REFERENCES employees(id),
  reported_by UUID REFERENCES user_profiles(id),
  status TEXT DEFAULT 'open',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Defect Phases (for repair workflow)
CREATE TABLE defect_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
  phase_name TEXT NOT NULL,
  phase_order INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material Requests
CREATE TABLE material_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  level TEXT NOT NULL,
  unit_location TEXT NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'normal', 'urgent')),
  notes TEXT,
  photo_url TEXT,
  requested_by UUID REFERENCES user_profiles(id),
  status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Notes
CREATE TABLE voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  duration INTEGER NOT NULL,
  transcription TEXT,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES activity_phases(id) ON DELETE CASCADE,
  defect_id UUID REFERENCES defects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES user_profiles(id),
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_activities_assigned_to ON activities(assigned_to);
CREATE INDEX idx_activities_site_id ON activities(site_id);
CREATE INDEX idx_defects_assigned_to ON defects(assigned_to);
CREATE INDEX idx_defects_status ON defects(status);
CREATE INDEX idx_material_requests_status ON material_requests(status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_photos_activity ON photos(activity_id);
CREATE INDEX idx_photos_defect ON photos(defect_id);

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies for activities
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

-- Policies for defects
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

-- Policies for material_requests
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

-- Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
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

-- Function to calculate activity overall progress
CREATE OR REPLACE FUNCTION calculate_activity_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE activities
  SET overall_progress = (
    SELECT COALESCE(AVG(progress), 0)
    FROM activity_phases
    WHERE activity_id = NEW.activity_id
  )
  WHERE id = NEW.activity_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_activity_progress
  AFTER INSERT OR UPDATE ON activity_phases
  FOR EACH ROW
  EXECUTE FUNCTION calculate_activity_progress();
