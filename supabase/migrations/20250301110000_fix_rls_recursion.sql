-- Fix infinite recursion: "Admins can read all profiles" selects from profiles,
-- which re-triggers RLS on profiles. Use a SECURITY DEFINER function so the
-- admin check bypasses RLS.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

-- Recreate policies that used inline "exists (select from profiles)" to use is_admin().

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Admins can insert posts" on public.posts;
create policy "Admins can insert posts"
  on public.posts for insert
  with check (public.is_admin());

drop policy if exists "Admins can update posts" on public.posts;
create policy "Admins can update posts"
  on public.posts for update
  using (public.is_admin());

drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts"
  on public.posts for delete
  using (public.is_admin());

drop policy if exists "Admins can update admin_settings" on public.admin_settings;
create policy "Admins can update admin_settings"
  on public.admin_settings for update
  using (public.is_admin());

drop policy if exists "Admins can insert admin_settings" on public.admin_settings;
create policy "Admins can insert admin_settings"
  on public.admin_settings for insert
  with check (public.is_admin());
