export type ProfileRole = 'admin' | 'family' | 'friend' | 'user';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  description: string | null;
  body: string | null;
  author: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminSettings {
  id: string;
  weather_service: 'openweather' | 'openmeteo';
  updated_at: string;
}
