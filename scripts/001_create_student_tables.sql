-- Create students table to store registration data
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  trust_id text unique not null,
  student_name text not null,
  father_name text,
  mother_name text,
  date_of_birth date,
  gender text,
  mobile_number text,
  email_id text,
  address text,
  login_time timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create academic_details table for SSC, Diploma, B.Tech info
create table if not exists public.academic_details (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  level text not null, -- 'ssc', 'diploma', 'btech'
  school_or_college_name text,
  board_or_branch text,
  year_of_passing_or_studying text,
  percentage_or_cgpa text,
  pin_number text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on students table
alter table public.students enable row level security;

-- Create RLS policies for students (allow anyone to view/insert for registration purposes)
create policy "students_insert_public"
  on public.students for insert
  with check (true);

create policy "students_select_by_trust_id"
  on public.students for select
  using (true);

create policy "students_update_own"
  on public.students for update
  using (true);

-- Enable RLS on academic_details table
alter table public.academic_details enable row level security;

-- Create RLS policies for academic_details
create policy "academic_details_insert_public"
  on public.academic_details for insert
  with check (true);

create policy "academic_details_select_public"
  on public.academic_details for select
  using (true);

-- Create indexes for better query performance
create index if not exists idx_students_trust_id on public.students(trust_id);
create index if not exists idx_academic_details_student_id on public.academic_details(student_id);
