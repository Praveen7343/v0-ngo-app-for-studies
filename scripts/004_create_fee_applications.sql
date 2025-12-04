-- Create fee_applications table to store student fee requests
CREATE TABLE IF NOT EXISTS fee_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  trust_id VARCHAR(20) NOT NULL,
  fee_type VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2),
  reason TEXT NOT NULL,
  supporting_document TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  chairman_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_fee_applications_student_id ON fee_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_applications_status ON fee_applications(status);
CREATE INDEX IF NOT EXISTS idx_fee_applications_trust_id ON fee_applications(trust_id);

-- Enable RLS
ALTER TABLE fee_applications ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
CREATE POLICY "Allow public read access to fee_applications" ON fee_applications
  FOR SELECT USING (true);

-- Allow insert for all (students submitting applications)
CREATE POLICY "Allow public insert to fee_applications" ON fee_applications
  FOR INSERT WITH CHECK (true);

-- Allow update for service role (chairman reviewing applications)
CREATE POLICY "Allow service role update on fee_applications" ON fee_applications
  FOR UPDATE USING (true);
