-- =========================================================
-- SOLVIFY — 0003 Row Level Security
-- Run AFTER 0001_init.sql
-- =========================================================

alter table public.users                  enable row level security;
alter table public.professionals          enable row level security;
alter table public.categories             enable row level security;
alter table public.services               enable row level security;
alter table public.professional_services  enable row level security;
alter table public.locations              enable row level security;
alter table public.professional_locations enable row level security;
alter table public.portfolios             enable row level security;
alter table public.professional_availability enable row level security;
alter table public.service_requests       enable row level security;
alter table public.request_services       enable row level security;
alter table public.jobs                   enable row level security;
alter table public.reviews                enable row level security;
alter table public.notifications          enable row level security;
alter table public.reports                enable row level security;
alter table public.verification_records   enable row level security;
alter table public.job_events             enable row level security;
alter table public.recommendation_scores  enable row level security;
alter table public.professional_stats     enable row level security;

-- ---------- helper: is current user an admin? ----------
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'ADMIN' and u.is_active
  );
$$;

-- Helper macro-ish: drop-then-create to keep this file idempotent
-- (Postgres has no `create policy if not exists`)

-- ---------- users ----------
drop policy if exists users_self_read on public.users;
create policy users_self_read on public.users for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists users_self_update on public.users;
create policy users_self_update on public.users for update
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists users_admin_all on public.users;
create policy users_admin_all on public.users for all
  using (public.is_admin());

-- ---------- categories / services / locations ----------
drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories for select using (true);

drop policy if exists categories_admin on public.categories;
create policy categories_admin on public.categories for all using (public.is_admin());

drop policy if exists services_read on public.services;
create policy services_read on public.services for select using (true);

drop policy if exists services_admin on public.services;
create policy services_admin on public.services for all using (public.is_admin());

drop policy if exists locations_read on public.locations;
create policy locations_read on public.locations for select using (true);

drop policy if exists locations_admin on public.locations;
create policy locations_admin on public.locations for all using (public.is_admin());

-- ---------- professionals ----------
drop policy if exists professionals_read on public.professionals;
create policy professionals_read on public.professionals for select using (true);

drop policy if exists professionals_owner on public.professionals;
create policy professionals_owner on public.professionals for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists professionals_insert on public.professionals;
create policy professionals_insert on public.professionals for insert
  with check (user_id = auth.uid());

drop policy if exists professionals_admin on public.professionals;
create policy professionals_admin on public.professionals for all using (public.is_admin());

-- ---------- portfolios ----------
drop policy if exists portfolios_read on public.portfolios;
create policy portfolios_read on public.portfolios for select using (true);

drop policy if exists portfolios_owner on public.portfolios;
create policy portfolios_owner on public.portfolios for all using (
  exists (select 1 from public.professionals p
          where p.id = portfolios.professional_id and p.user_id = auth.uid())
);

-- ---------- service_requests ----------
drop policy if exists requests_customer on public.service_requests;
create policy requests_customer on public.service_requests for all
  using (customer_id = auth.uid() or public.is_admin())
  with check (customer_id = auth.uid() or public.is_admin());

-- ---------- jobs ----------
drop policy if exists jobs_participants on public.jobs;
create policy jobs_participants on public.jobs for select using (
  customer_id = auth.uid()
  or exists (select 1 from public.professionals p
             where p.id = jobs.professional_id and p.user_id = auth.uid())
  or public.is_admin()
);

drop policy if exists jobs_professional_update on public.jobs;
create policy jobs_professional_update on public.jobs for update using (
  exists (select 1 from public.professionals p
          where p.id = jobs.professional_id and p.user_id = auth.uid())
) with check (true);

-- ---------- reviews ----------
drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select using (true);

drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert with check (
  customer_id = auth.uid()
  and exists (
    select 1 from public.jobs j
    where j.id = reviews.job_id
      and j.customer_id = auth.uid()
      and j.professional_id = reviews.professional_id
      and j.status = 'COMPLETED'
  )
);

drop policy if exists reviews_admin on public.reviews;
create policy reviews_admin on public.reviews for all using (public.is_admin());

-- ---------- notifications ----------
drop policy if exists notifications_owner on public.notifications;
create policy notifications_owner on public.notifications for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- reports ----------
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert with check (reporter_id = auth.uid());

drop policy if exists reports_self on public.reports;
create policy reports_self on public.reports for select using (reporter_id = auth.uid());

drop policy if exists reports_admin on public.reports;
create policy reports_admin on public.reports for all using (public.is_admin());

-- ---------- verification ----------
drop policy if exists verification_owner_read on public.verification_records;
create policy verification_owner_read on public.verification_records for select using (
  exists (select 1 from public.professionals p
          where p.id = verification_records.professional_id and p.user_id = auth.uid())
);

drop policy if exists verification_owner_create on public.verification_records;
create policy verification_owner_create on public.verification_records for insert with check (
  exists (select 1 from public.professionals p
          where p.id = verification_records.professional_id and p.user_id = auth.uid())
);

drop policy if exists verification_admin on public.verification_records;
create policy verification_admin on public.verification_records for all using (public.is_admin());

-- ---------- job events ----------
drop policy if exists job_events_read on public.job_events;
create policy job_events_read on public.job_events for select using (
  exists (
    select 1 from public.jobs j
    where j.id = job_events.job_id
      and (j.customer_id = auth.uid()
        or exists (select 1 from public.professionals p
                   where p.id = j.professional_id and p.user_id = auth.uid())
        or public.is_admin())
  )
);