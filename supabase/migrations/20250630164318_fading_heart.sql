/*
  # Add Missing Tables and Fix Schema Inconsistencies

  1. New Tables
    - `syllabus` - Course syllabus structure
    - Add missing columns to existing tables

  2. Schema Fixes
    - Add exam_type to student_profiles
    - Fix data types and constraints

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Create syllabus table
CREATE TABLE IF NOT EXISTS syllabus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class text NOT NULL,
  subject text NOT NULL,
  parent_subject text,
  chapter_id text NOT NULL,
  chapter_name text NOT NULL,
  "order" integer DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add exam_type to student_profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_profiles' AND column_name = 'exam_type'
  ) THEN
    ALTER TABLE student_profiles ADD COLUMN exam_type text DEFAULT 'Boards';
  END IF;
END $$;

-- Enable RLS on syllabus
ALTER TABLE syllabus ENABLE ROW LEVEL SECURITY;

-- Create policy for syllabus (public read access)
CREATE POLICY "Anyone can read syllabus"
  ON syllabus
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample syllabus data
INSERT INTO syllabus (class, subject, chapter_id, chapter_name, "order") VALUES
-- Class 10 Mathematics
('10', 'Mathematics', 'real_numbers', 'Real Numbers', 1),
('10', 'Mathematics', 'polynomials', 'Polynomials', 2),
('10', 'Mathematics', 'linear_equations', 'Pair of Linear Equations in Two Variables', 3),
('10', 'Mathematics', 'quadratic_equations', 'Quadratic Equations', 4),
('10', 'Mathematics', 'arithmetic_progressions', 'Arithmetic Progressions', 5),
('10', 'Mathematics', 'triangles', 'Triangles', 6),
('10', 'Mathematics', 'coordinate_geometry', 'Coordinate Geometry', 7),
('10', 'Mathematics', 'trigonometry', 'Introduction to Trigonometry', 8),
('10', 'Mathematics', 'circles', 'Circles', 9),
('10', 'Mathematics', 'areas_volumes', 'Areas and Volumes', 10),

-- Class 10 Science - Physics
('10', 'Science', 'Physics', 'light_reflection', 'Light - Reflection and Refraction', 1),
('10', 'Science', 'Physics', 'human_eye', 'The Human Eye and Colourful World', 2),
('10', 'Science', 'Physics', 'electricity', 'Electricity', 3),
('10', 'Science', 'Physics', 'magnetic_effects', 'Magnetic Effects of Electric Current', 4),

-- Class 10 Science - Chemistry
('10', 'Science', 'Chemistry', 'acids_bases', 'Acids, Bases and Salts', 1),
('10', 'Science', 'Chemistry', 'metals_nonmetals', 'Metals and Non-metals', 2),
('10', 'Science', 'Chemistry', 'carbon_compounds', 'Carbon and its Compounds', 3),
('10', 'Science', 'Chemistry', 'periodic_classification', 'Periodic Classification of Elements', 4),

-- Class 10 Science - Biology
('10', 'Science', 'Biology', 'life_processes', 'Life Processes', 1),
('10', 'Science', 'Biology', 'control_coordination', 'Control and Coordination', 2),
('10', 'Science', 'Biology', 'reproduction', 'How do Organisms Reproduce?', 3),
('10', 'Science', 'Biology', 'heredity_evolution', 'Heredity and Evolution', 4),

-- Class 10 History
('10', 'History', 'nationalism_europe', 'The Rise of Nationalism in Europe', 1),
('10', 'History', 'nationalism_india', 'Nationalism in India', 2),
('10', 'History', 'making_global_world', 'The Making of a Global World', 3),
('10', 'History', 'age_industrialization', 'The Age of Industrialization', 4),
('10', 'History', 'print_culture', 'Print Culture and the Modern World', 5)

ON CONFLICT (class, subject, chapter_id) DO NOTHING;

-- Create function to update updated_at for syllabus
CREATE TRIGGER update_syllabus_updated_at
  BEFORE UPDATE ON syllabus
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();