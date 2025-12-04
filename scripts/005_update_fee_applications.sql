-- Add new columns for form_data and voucher_data to store complete form information
ALTER TABLE fee_applications 
ADD COLUMN IF NOT EXISTS form_data JSONB,
ADD COLUMN IF NOT EXISTS voucher_data JSONB;
