-- =========================================================
-- SOLVIFY — Initial schema
-- =========================================================

-- ---------- Enums ----------
create type user_role            as enum ('CUSTOMER','PROFESSIONAL','ADMIN');
create type verification_status  as enum ('PENDING','VERIFIED','REJECTED');
create type job_status           as enum ('REQUESTED','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED','REJECTED');
create type report_status        as enum ('OPEN','UNDER_REVIEW','RESOLVED','DISMISSED');
create type notification_type    as enum (
  'REQUEST_CREATED','REQUEST_ACCEPTED','REQUEST_REJECTED',
  'JOB_STARTED','JOB_COMPLETED','REVIEW_AVAILABLE',
  'VERIFICATION_APPROVED','VERIFICATION_REJECTED'
);

-- ---------- updated_at trigger helper ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- =========================================================
-- USERS  (mirrors auth.users)
-- =========================================================
create table public.users (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text not null,
  email           text not null unique,
  phone           text,
  role            user_role not null default 'CUSTOMER',
  location_id     uuid,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger users_updated_at before update on public.users
for each row execute function public.set_updated_at();

-- =========================================================
-- LOCATIONS
-- =========================================================
create table public.locations (
  id         uuid primary key default gen_random_uuid(),
  state      text not null,
  city       text not null,
  area       text,
  country    text not null default 'Nigeria',
  created_at timestamptz not null default now()
);
create index idx_locations_state_city on public.locations(state, city);

-- FK from users.location_id (added after locations exists)
alter table public.users
  add constraint users_location_fk
  foreign key (location_id) references public.locations(id) on delete set null;

-- =========================================================
-- CATEGORIES
-- =========================================================
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  icon        text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

-- =========================================================
-- SERVICES
-- =========================================================
create table public.services (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name        text not null,
  slug        text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (category_id, slug)
);
create index idx_services_category on public.services(category_id);
create trigger services_updated_at before update on public.services
for each row execute function public.set_updated_at();

-- =========================================================
-- PROFESSIONALS
-- =========================================================
create table public.professionals (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null unique references public.users(id) on delete cascade,
  bio                text,
  experience_years   int  not null default 0 check (experience_years >= 0),
  verification_status verification_status not null default 'PENDING',
  profile_photo_url  text,
  average_rating     numeric(3,2) not null default 0 check (average_rating between 0 and 5),
  total_reviews      int not null default 0,
  total_completed_jobs int not null default 0,
  starting_price     numeric(12,2),
  response_rate      numeric(5,2) not null default 0,
  is_available       boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index idx_professionals_verified on public.professionals(verification_status);
create trigger professionals_updated_at before update on public.professionals
for each row execute function public.set_updated_at();

-- =========================================================
-- PROFESSIONAL ↔ SERVICES
-- =========================================================
create table public.professional_services (
  id              uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  service_id      uuid not null references public.services(id) on delete cascade,
  price_from      numeric(12,2),
  price_to        numeric(12,2),
  created_at      timestamptz not null default now(),
  unique (professional_id, service_id)
);
create index idx_prof_services_service on public.professional_services(service_id);

-- =========================================================
-- PROFESSIONAL ↔ LOCATIONS
-- =========================================================
create table public.professional_locations (
  id              uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  location_id     uuid not null references public.locations(id) on delete cascade,
  service_radius  int,
  created_at      timestamptz not null default now(),
  unique (professional_id, location_id)
);
create index idx_prof_locations_location on public.professional_locations(location_id);

-- =========================================================
-- PROFESSIONAL STATS (denormalised counters)
-- =========================================================
create table public.professional_stats (
  professional_id       uuid primary key references public.professionals(id) on delete cascade,
  completed_jobs        int not null default 0,
  cancelled_jobs        int not null default 0,
  average_rating        numeric(3,2) not null default 0,
  total_reviews         int not null default 0,
  response_rate         numeric(5,2) not null default 0,
  average_response_time int,
  profile_views         int not null default 0,
  last_completed_job    timestamptz,
  updated_at            timestamptz not null default now()
);
create trigger prof_stats_updated_at before update on public.professional_stats
for each row execute function public.set_updated_at();

-- =========================================================
-- AVAILABILITY  (MVP: simple toggle)
-- =========================================================
create table public.professional_availability (
  id              uuid primary key default gen_random_uuid(),
  professional_id uuid not null unique references public.professionals(id) on delete cascade,
  is_available    boolean not null default true,
  availability_note text,
  updated_at      timestamptz not null default now()
);
create trigger prof_avail_updated_at before update on public.professional_availability
for each row execute function public.set_updated_at();

-- =========================================================
-- PORTFOLIOS
-- =========================================================
create table public.portfolios (
  id              uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  title           text not null,
  description     text,
  image_url       text not null,
  service_id      uuid references public.services(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_portfolios_professional on public.portfolios(professional_id);
create trigger portfolios_updated_at before update on public.portfolios
for each row execute function public.set_updated_at();

-- =========================================================
-- SERVICE REQUESTS
-- =========================================================
create table public.service_requests (
  id             uuid primary key default gen_random_uuid(),
  customer_id    uuid not null references public.users(id) on delete cascade,
  description    text not null,
  location_id    uuid references public.locations(id) on delete set null,
  budget_min     numeric(12,2),
  budget_max     numeric(12,2),
  preferred_date date,
  preferred_time time,
  status         job_status not null default 'REQUESTED',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index idx_requests_customer on public.service_requests(customer_id);
create trigger requests_updated_at before update on public.service_requests
for each row execute function public.set_updated_at();

-- =========================================================
-- REQUEST ↔ SERVICES
-- =========================================================
create table public.request_services (
  id         uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  unique (request_id, service_id)
);

-- =========================================================
-- JOBS
-- =========================================================
create table public.jobs (
  id              uuid primary key default gen_random_uuid(),
  request_id      uuid not null references public.service_requests(id) on delete cascade,
  customer_id     uuid not null references public.users(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  status          job_status not null default 'REQUESTED',
  accepted_at     timestamptz,
  started_at      timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_jobs_customer  on public.jobs(customer_id);
create index idx_jobs_prof      on public.jobs(professional_id);
create index idx_jobs_status    on public.jobs(status);
create trigger jobs_updated_at before update on public.jobs
for each row execute function public.set_updated_at();

-- =========================================================
-- JOB EVENTS (audit trail — spec §51)
-- =========================================================
create table public.job_events (
  id         uuid primary key default gen_random_uuid(),
  job_id     uuid not null references public.jobs(id) on delete cascade,
  event_type text not null,       -- e.g. 'REQUESTED','ACCEPTED','STARTED','COMPLETED','REVIEWED'
  actor_id   uuid references public.users(id) on delete set null,
  notes      text,
  created_at timestamptz not null default now()
);
create index idx_job_events_job on public.job_events(job_id);

-- =========================================================
-- REVIEWS
-- =========================================================
create table public.reviews (
  id              uuid primary key default gen_random_uuid(),
  job_id          uuid not null unique references public.jobs(id) on delete cascade,
  customer_id     uuid not null references public.users(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  rating          int not null check (rating between 1 and 5),
  review_text     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_reviews_professional on public.reviews(professional_id);
create trigger reviews_updated_at before update on public.reviews
for each row execute function public.set_updated_at();

-- =========================================================
-- RECOMMENDATION SCORES (snapshot log)
-- =========================================================
create table public.recommendation_scores (
  id                  uuid primary key default gen_random_uuid(),
  request_id          uuid references public.service_requests(id) on delete cascade,
  professional_id     uuid not null references public.professionals(id) on delete cascade,
  service_score       int not null,
  location_score      int not null,
  rating_score        numeric(4,2) not null,
  verification_score  int not null,
  experience_score    int not null,
  jobs_score          int not null,
  final_score         numeric(5,2) not null,
  created_at          timestamptz not null default now()
);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
create table public.notifications (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users(id) on delete cascade,
  type               notification_type not null,
  title              text not null,
  message            text,
  is_read            boolean not null default false,
  related_entity_type text,
  related_entity_id  uuid,
  created_at         timestamptz not null default now()
);
create index idx_notifications_user_unread on public.notifications(user_id, is_read);

-- =========================================================
-- REPORTS
-- =========================================================
create table public.reports (
  id                     uuid primary key default gen_random_uuid(),
  reporter_id            uuid not null references public.users(id) on delete cascade,
  reported_user_id       uuid references public.users(id) on delete set null,
  reported_professional_id uuid references public.professionals(id) on delete set null,
  reason                 text not null,
  description            text,
  status                 report_status not null default 'OPEN',
  admin_notes            text,
  created_at             timestamptz not null default now(),
  resolved_at            timestamptz
);

-- =========================================================
-- VERIFICATION RECORDS
-- =========================================================
create table public.verification_records (
  id              uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  status          verification_status not null default 'PENDING',
  submitted_data  jsonb not null default '{}'::jsonb,
  admin_notes     text,
  reviewed_by     uuid references public.users(id) on delete set null,
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index idx_verification_status on public.verification_records(status);
create trigger verification_updated_at before update on public.verification_records
for each row execute function public.set_updated_at();