-- Allow users to insert their own profile (e.g. when trigger didn't run or profile was missing)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
