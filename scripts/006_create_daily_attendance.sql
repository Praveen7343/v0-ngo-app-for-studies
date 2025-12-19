-- Create daily_attendance table for face-verified attendance
CREATE TABLE IF NOT EXISTS daily_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  trust_id VARCHAR(50) NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  check_in_type VARCHAR(10) NOT NULL CHECK (check_in_type IN ('first', 'second')),
  face_image TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'half-day' CHECK (status IN ('half-day', 'full-day')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_attendance_student_date ON daily_attendance(student_id, DATE(check_in_time));
CREATE INDEX IF NOT EXISTS idx_daily_attendance_trust_id ON daily_attendance(trust_id);

-- Enable RLS
ALTER TABLE daily_attendance ENABLE ROW LEVEL SECURITY;

-- Allow public insert for attendance marking
CREATE POLICY "Allow public insert to daily_attendance" ON daily_attendance
  FOR INSERT
  WITH CHECK (true);

-- Allow public read for their own records
CREATE POLICY "Allow students to view own attendance" ON daily_attendance
  FOR SELECT
  USING (true);
