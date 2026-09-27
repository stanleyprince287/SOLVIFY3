-- =========================================================
-- SOLVIFY — Seed: Services
-- References categories by slug
-- =========================================================

insert into public.services (category_id, name, slug, description)
select c.id, s.name, s.slug, s.description
from public.categories c
join (values
  -- Electrical
  ('electrical', 'Generator Repair',            'generator-repair',            'Repair of faulty generators.'),
  ('electrical', 'Generator Installation',      'generator-installation',      'Install new generators.'),
  ('electrical', 'House Wiring',                'house-wiring',                'Full or partial house wiring.'),
  ('electrical', 'Electrical Repairs',          'electrical-repairs',          'General electrical fault fixes.'),
  ('electrical', 'Inverter Installation',       'inverter-installation',       'Inverter and battery setup.'),
  ('electrical', 'Solar Installation',          'solar-installation',          'Solar panels and systems.'),
  ('electrical', 'Socket & Switch Repair',      'socket-switch-repair',        'Fix or replace sockets and switches.'),

  -- Plumbing
  ('plumbing',   'Pipe Repair',                 'pipe-repair',                 'Repair or replace leaking pipes.'),
  ('plumbing',   'Tap Installation',            'tap-installation',            'Install taps and faucets.'),
  ('plumbing',   'Toilet Repair',               'toilet-repair',               'Fix flushing or leaking toilets.'),
  ('plumbing',   'Water Tank Installation',     'water-tank-installation',     'Install overhead or underground tanks.'),
  ('plumbing',   'Drainage Cleaning',           'drainage-cleaning',           'Unblock and clean drains.'),
  ('plumbing',   'Bathroom Fitting',            'bathroom-fitting',            'Full bathroom plumbing fit-out.'),

  -- Mechanics
  ('mechanics',  'Engine Diagnostics',          'engine-diagnostics',          'Computer diagnostics for engines.'),
  ('mechanics',  'Oil Change',                  'oil-change',                  'Routine oil and filter change.'),
  ('mechanics',  'Brake Repair',                'brake-repair',                'Brake pad and system repair.'),
  ('mechanics',  'Car AC Repair',               'car-ac-repair',               'Repair car air conditioning.'),
  ('mechanics',  'Battery Replacement',         'battery-replacement',         'Replace or recharge car battery.'),
  ('mechanics',  'Tyre Change',                 'tyre-change',                 'Tyre replacement and balancing.'),

  -- Cleaning
  ('cleaning',   'House Cleaning',              'house-cleaning',              'Regular residential cleaning.'),
  ('cleaning',   'Deep Cleaning',               'deep-cleaning',               'Thorough top-to-bottom cleaning.'),
  ('cleaning',   'Office Cleaning',             'office-cleaning',             'Commercial office cleaning.'),
  ('cleaning',   'Post-Construction Cleaning',  'post-construction-cleaning',  'Cleanup after building work.'),
  ('cleaning',   'Carpet Cleaning',             'carpet-cleaning',             'Shampoo and steam carpets.'),
  ('cleaning',   'Sofa & Upholstery Cleaning',  'sofa-upholstery-cleaning',    'Deep-clean sofas and chairs.'),

  -- Tutoring
  ('tutoring',   'Math Tutoring',               'math-tutoring',               'Primary to university math.'),
  ('tutoring',   'English Tutoring',            'english-tutoring',            'Language and literature tutoring.'),
  ('tutoring',   'Science Tutoring',            'science-tutoring',            'Physics, chemistry, biology.'),
  ('tutoring',   'Exam Prep',                   'exam-prep',                   'WAEC, JAMB, SAT, IELTS prep.'),
  ('tutoring',   'Computer Skills Tutoring',    'computer-skills-tutoring',    'Basic to advanced computer skills.'),

  -- Graphic Design
  ('graphic-design', 'Logo Design',             'logo-design',                 'Custom logo creation.'),
  ('graphic-design', 'Flyer & Poster Design',   'flyer-poster-design',         'Print-ready flyers and posters.'),
  ('graphic-design', 'Social Media Design',     'social-media-design',         'Posts, stories, banners.'),
  ('graphic-design', 'Brand Identity',          'brand-identity',              'Full brand kit and guidelines.'),
  ('graphic-design', 'Book Cover Design',       'book-cover-design',           'Ebook and print covers.'),

  -- Web Development
  ('web-development', 'Website Design',         'website-design',              'Custom website design.'),
  ('web-development', 'E-commerce Store',       'ecommerce-store',             'Online store setup.'),
  ('web-development', 'Web App Development',    'web-app-development',         'Custom web applications.'),
  ('web-development', 'Website Maintenance',    'website-maintenance',         'Ongoing site upkeep.'),
  ('web-development', 'SEO Optimization',       'seo-optimization',            'Search engine optimization.'),

  -- Engineering
  ('engineering',    'Structural Engineering',  'structural-engineering',      'Structural design and analysis.'),
  ('engineering',    'Civil Engineering',       'civil-engineering',           'Roads, drainage, foundations.'),
  ('engineering',    'Mechanical Engineering',  'mechanical-engineering',      'Mechanical systems design.'),
  ('engineering',    'Project Supervision',     'project-supervision',         'Construction supervision.'),

  -- Appliance Repair
  ('appliance-repair', 'Fridge Repair',         'fridge-repair',               'Repair refrigerators and freezers.'),
  ('appliance-repair', 'AC Repair',             'ac-repair',                   'Fix air conditioners.'),
  ('appliance-repair', 'Washing Machine Repair', 'washing-machine-repair',     'Repair washing machines.'),
  ('appliance-repair', 'Microwave Repair',      'microwave-repair',            'Fix microwaves.'),
  ('appliance-repair', 'Gas Cooker Repair',     'gas-cooker-repair',           'Fix gas cookers.'),

  -- General Technician
  ('general-technician', 'Handyman Services',   'handyman-services',           'General household repairs.'),
  ('general-technician', 'Furniture Assembly',  'furniture-assembly',          'Assemble flat-pack furniture.'),
  ('general-technician', 'Painting',            'painting',                    'Interior and exterior painting.')
) as s(cat_slug, name, slug, description)
  on s.cat_slug = c.slug
on conflict (category_id, slug) do nothing;