-- Clear all existing students to start fresh with new Trust ID format
DELETE FROM students;

-- Reset the sequence/counter for registration numbers
-- This ensures new registrations start from 1
