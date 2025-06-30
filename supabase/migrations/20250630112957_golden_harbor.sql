/*
  # Enhanced Student Learning Profiles

  1. New Tables
    - `student_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `grade_level` (integer, 6-12)
      - `learning_style` (text, visual/audio/text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `learning_roadmaps`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `subject` (text)
      - `topic` (text)
      - `plan_type` (text, fast-track/deep-learning)
      - `roadmap_data` (jsonb)
      - `created_at` (timestamp)
    
    - `student_interactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `subject` (text)
      - `topic` (text)
      - `interaction_type` (text, question/answer/doubt)
      - `content` (text)
      - `ai_response` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Updates to existing tables
    - Add performance tracking columns to student_progress
*/

-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  grade_level integer CHECK (grade_level >= 6 AND grade_level <= 12),
  learning_style text CHECK (learning_style IN ('visual', 'audio', 'text')) DEFAULT 'text',
  preferred_subjects text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create learning_roadmaps table
CREATE TABLE IF NOT EXISTS learning_roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topic text NOT NULL,
  plan_type text CHECK (plan_type IN ('fast-track', 'deep-learning')) DEFAULT 'deep-learning',
  roadmap_data jsonb DEFAULT '{}',
  progress jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create student_interactions table
CREATE TABLE IF NOT EXISTS student_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topic text NOT NULL,
  subtopic text,
  interaction_type text CHECK (interaction_type IN ('question', 'answer', 'doubt', 'feedback')) NOT NULL,
  content text NOT NULL,
  ai_response text,
  context jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create student_progress table if it does not exist
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topic text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  quiz_score integer,
  UNIQUE(user_id, subject, topic)
);

-- Update student_progress table with additional columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_progress' AND column_name = 'subtopic'
  ) THEN
    ALTER TABLE student_progress ADD COLUMN subtopic text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_progress' AND column_name = 'time_spent'
  ) THEN
    ALTER TABLE student_progress ADD COLUMN time_spent integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_progress' AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE student_progress ADD COLUMN difficulty_level text DEFAULT 'medium';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for student_profiles
CREATE POLICY "Users can read own profile"
  ON student_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON student_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON student_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for learning_roadmaps
CREATE POLICY "Users can read own roadmaps"
  ON learning_roadmaps
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roadmaps"
  ON learning_roadmaps
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmaps"
  ON learning_roadmaps
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for student_interactions
CREATE POLICY "Users can read own interactions"
  ON student_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions"
  ON student_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_roadmaps_updated_at
  BEFORE UPDATE ON learning_roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();