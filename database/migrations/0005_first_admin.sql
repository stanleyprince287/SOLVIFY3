-- Replace with YOUR email that you registered with
update public.users
set role = 'ADMIN'
where email = 'you@example.com';

-- Verify it worked
select id, full_name, email, role from public.users where role = 'ADMIN';