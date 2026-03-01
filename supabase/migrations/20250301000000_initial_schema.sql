-- profiles: extends auth.users with app-specific profile and role
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('admin', 'family', 'friend', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- posts: blog posts (public read, admin write)
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text,
  body text,
  author text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- admin_settings: singleton row for app config (e.g. weather_service)
create table public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  weather_service text not null default 'openweather' check (weather_service in ('openweather', 'openmeteo')),
  updated_at timestamptz not null default now()
);

-- Insert singleton admin_settings row
insert into public.admin_settings (weather_service) values ('openweather');

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.admin_settings enable row level security;

-- profiles: users can read own; admins can read all
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- posts: everyone can read; only admins can insert/update/delete
create policy "Anyone can read posts"
  on public.posts for select
  using (true);

create policy "Admins can insert posts"
  on public.posts for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can update posts"
  on public.posts for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can delete posts"
  on public.posts for delete
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- admin_settings: authenticated can read; only admins can update
create policy "Authenticated can read admin_settings"
  on public.admin_settings for select
  to authenticated
  using (true);

create policy "Admins can update admin_settings"
  on public.admin_settings for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "Admins can insert admin_settings"
  on public.admin_settings for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
