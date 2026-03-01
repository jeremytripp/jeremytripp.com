# jeremytripp.com

Rebuilt with Next.js 14+ (App Router), TypeScript, Tailwind CSS, and Supabase. The original site lives in `legacy/` for reference.

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - Run the schema in `supabase/migrations/20250301000000_initial_schema.sql` in the SQL Editor (or use Supabase CLI: `supabase db push`).
   - **Google OAuth**: In Authentication → Providers, enable Google. Paste your Google Client ID and Client Secret (from [Google Cloud Console](https://console.cloud.google.com/apis/credentials); create an OAuth 2.0 Client ID if needed). In Google Cloud Console, set **Authorized redirect URI** to `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback` (get the exact URL from Supabase → Authentication → URL Configuration).
   - In Authentication → URL Configuration, set Site URL and add your app’s callback to Redirect URLs, e.g. `http://localhost:3000/auth/callback` or `http://localhost:3001/auth/callback` (and your production URL).

3. **Environment**
   - Copy `.env.example` to `.env.local`.
   - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project.
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured in the Supabase Dashboard (Authentication → Providers → Google), not in `.env`.
   - Optional: `OPENWEATHER_API_KEY` for the OpenWeather weather option (or use Open-Meteo in Admin, which doesn’t need a key).

4. **First admin**
   - Sign in with OAuth, then in Supabase SQL Editor run:
     ```sql
     update public.profiles set role = 'admin' where id = 'your-auth-user-uuid';
     ```

5. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

- Connect the repo to Vercel.
- Set the same env vars in the Vercel project.
- Add your production URL (e.g. `https://jeremytripp.com`) to Supabase Redirect URLs and as Site URL.

## Features

- **Blog**: List and single post; admins can create, edit, delete posts.
- **Weather**: Page powered by OpenWeather or Open-Meteo (configurable in Admin).
- **Account**: Profile view for signed-in users.
- **Admin**: Post list with edit links, new post, and weather service selector.
