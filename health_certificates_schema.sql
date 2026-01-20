-- Drop columns for delegate and price as valid SQL commands
ALTER TABLE health_certificates DROP COLUMN IF EXISTS delegate;
ALTER TABLE health_certificates DROP COLUMN IF EXISTS price;

-- Updated Create Table Definition (for reference or new installs)
create table if not exists health_certificates (
  id uuid default uuid_generate_v4() primary key,
  certificate_number text,
  issue_date text,
  issuer text,
  expiry_date text,
  holder_name text,
  holder_id text,
  gender text,
  nationality text,
  profession text,
  program_name text,
  program_end_date text,
  facility_name text,
  facility_license text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
