-- =========================================================
-- SOLVIFY — Seed: Categories
-- Safe to re-run (uses on conflict do nothing)
-- =========================================================

insert into public.categories (name, slug, description, icon) values
  ('Electrical',            'electrical',            'Electricians, wiring, generators, inverters, solar.',      '⚡'),
  ('Plumbing',              'plumbing',              'Pipes, leaks, installations, water systems.',              '🔧'),
  ('Mechanics',             'mechanics',             'Auto repairs, diagnostics, servicing.',                    '🚗'),
  ('Cleaning',              'cleaning',              'Home, office, deep cleaning, post-construction.',          '🧹'),
  ('Tutoring',              'tutoring',              'Academic tutors for all levels and subjects.',             '📚'),
  ('Graphic Design',        'graphic-design',        'Logos, branding, flyers, social media visuals.',           '🎨'),
  ('Web Development',       'web-development',       'Websites, apps, e-commerce, maintenance.',                 '💻'),
  ('Engineering',           'engineering',           'Civil, mechanical, structural engineering services.',      '🏗️'),
  ('Appliance Repair',      'appliance-repair',      'Fridges, ACs, washing machines, microwaves.',              '🔌'),
  ('General Technician',    'general-technician',    'Handyman services and general repairs.',                   '🛠️')
on conflict (slug) do nothing;