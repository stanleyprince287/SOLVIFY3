-- =========================================================
-- SOLVIFY — 0002 Triggers
-- Run AFTER 0001_init.sql
-- =========================================================

-- ---------- updated_at helper ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- Attach set_updated_at to every table that has updated_at
do $$
declare t text;
begin
  foreach t in array array[
    'users','categories','services','professionals','portfolios',
    'service_requests','jobs','reviews','verification_records'
  ]
  loop
    execute format('drop trigger if exists %I_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ---------- rating refresh on reviews ----------
create or replace function public.refresh_professional_rating()
returns trigger language plpgsql as $$
declare prof_id uuid;
begin
  prof_id := coalesce(new.professional_id, old.professional_id);

  update public.professionals p
  set average_rating = coalesce((
        select round(avg(rating)::numeric, 2)
        from public.reviews where professional_id = prof_id
      ), 0),
      total_reviews = (
        select count(*) from public.reviews where professional_id = prof_id
      )
  where p.id = prof_id;

  return null;
end; $$;

drop trigger if exists reviews_refresh_rating on public.reviews;
create trigger reviews_refresh_rating
after insert or update or delete on public.reviews
for each row execute function public.refresh_professional_rating();

-- ---------- job status transition guard ----------
create or replace function public.validate_job_transition()
returns trigger language plpgsql as $$
begin
  if old.status = new.status then return new; end if;

  if not (
       (old.status = 'REQUESTED'   and new.status in ('ACCEPTED','REJECTED','CANCELLED'))
    or (old.status = 'ACCEPTED'    and new.status in ('IN_PROGRESS','CANCELLED'))
    or (old.status = 'IN_PROGRESS' and new.status in ('COMPLETED','CANCELLED'))
  ) then
    raise exception 'Invalid job status transition: % -> %', old.status, new.status;
  end if;

  if new.status = 'ACCEPTED'    then new.accepted_at  := coalesce(new.accepted_at, now());  end if;
  if new.status = 'IN_PROGRESS' then new.started_at   := coalesce(new.started_at, now());   end if;
  if new.status = 'COMPLETED'   then new.completed_at := coalesce(new.completed_at, now()); end if;

  return new;
end; $$;

drop trigger if exists jobs_validate_transition on public.jobs;
create trigger jobs_validate_transition
before update on public.jobs
for each row execute function public.validate_job_transition();