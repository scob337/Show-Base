-- Drop existing tables to reset database
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS project_images CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create service categories table
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert service categories
INSERT INTO service_categories (name, description, icon) VALUES
  ('Graphic Design', 'Logo design, branding, visual identity', '🎨'),
  ('UI/UX Design', 'User interface and experience design', '🎯'),
  ('Web Development', 'Frontend and full-stack web development', '💻'),
  ('Mobile Development', 'iOS and Android app development', '📱'),
  ('Backend Development', 'Server-side development and APIs', '⚙️'),
  ('Frontend Development', 'React, Vue, Angular, and more', '🖥️'),
  ('Content Writing', 'Blog posts, copywriting, content strategy', '✍️'),
  ('Video Production', 'Video editing, motion graphics, animation', '🎬'),
  ('Photography', 'Professional photography services', '📸'),
  ('Digital Marketing', 'SEO, social media, marketing strategy', '📊'),
  ('Branding', 'Brand strategy and identity design', '🏷️'),
  ('Illustration', 'Digital and traditional illustration', '🖌️');

-- Create users profile table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  bio TEXT,
  specialty TEXT REFERENCES service_categories(name),
  user_type TEXT NOT NULL CHECK (user_type IN ('provider', 'seeker')),
  avatar_url TEXT,
  hourly_rate DECIMAL(10, 2),
  years_experience INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT REFERENCES service_categories(name),
  tools TEXT[],
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project images table
CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Service Categories RLS Policies
CREATE POLICY "Allow users to view all service categories" ON service_categories FOR SELECT USING (true);

-- Profiles RLS Policies
CREATE POLICY "Allow users to view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects RLS Policies
CREATE POLICY "Allow users to view all projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow users to create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Project Images RLS Policies
CREATE POLICY "Allow users to view all project images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Allow users to insert project images" ON project_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid())
);
CREATE POLICY "Allow users to delete their project images" ON project_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid())
);

-- Messages RLS Policies
CREATE POLICY "Allow users to view their messages" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Allow users to send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews RLS Policies
CREATE POLICY "Allow users to view all reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow users to create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
