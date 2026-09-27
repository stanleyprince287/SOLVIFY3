-- =========================================================
-- SOLVIFY — 0004 Auth sync
-- Mirrors auth.users → public.users and auto-creates professional rows
-- =========================================================

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'CUSTOMER')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.handle_new_professional()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role = 'PROFESSIONAL' then
    insert into public.professionals (user_id)
    values (new.id)
    on conflict (user_id) do nothing;

    insert into public.professional_availability (professional_id)
    select id from public.professionals where user_id = new.id
    on conflict (professional_id) do nothing;
  end if;
  return new;
end; $$;

drop trigger if exists users_create_professional on public.users;
create trigger users_create_professional
  after insert on public.users
  for each row execute function public.handle_new_professional();