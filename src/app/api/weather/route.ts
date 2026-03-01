import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const WEATHER_LAT = 38.6631;
const WEATHER_LON = -90.5771;
const WEATHER_ZIP = '63005,us';
const WEATHER_CITY_NAME = 'Chesterfield, MO';

const iconMap: Record<string, string> = {
  '01d': 'clear-day',
  '02d': 'partly-cloudy-day',
  '03d': 'cloudy',
  '04d': 'cloudy',
  '09d': 'rain',
  '10d': 'rain',
  '11d': 'thunderstorm',
  '13d': 'snow',
  '50d': 'fog',
  '01n': 'clear-night',
  '02n': 'partly-cloudy-night',
  '03n': 'cloudy',
  '04n': 'cloudy',
  '09n': 'rain',
  '10n': 'rain',
  '11n': 'thunderstorm',
  '13n': 'snow',
  '50n': 'fog',
};

async function getWeatherProvider(): Promise<string> {
  const serviceClient = createServiceRoleClient();
  const client = serviceClient ?? await createClient();
  const { data: settings } = await client
    .from('admin_settings')
    .select('weather_service')
    .limit(1)
    .single();
  return (settings?.weather_service as string) ?? 'openweather';
}

export async function GET() {
  const provider = await getWeatherProvider();

  if (provider === 'openmeteo') {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America/Chicago`
    );
    if (!res.ok) {
      const body = await res.text();
      console.error('[weather] Open-Meteo failed:', res.status, body);
      return NextResponse.json(
        { error: 'Weather fetch failed', detail: `Open-Meteo returned ${res.status}: ${body.slice(0, 200)}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    const current = data.current;
    const daily = data.daily;
    const temp = Math.round(current.temperature_2m);
    const highTemp = daily?.temperature_2m_max?.[0] != null ? Math.round(daily.temperature_2m_max[0]) : undefined;
    const lowTemp = daily?.temperature_2m_min?.[0] != null ? Math.round(daily.temperature_2m_min[0]) : undefined;
    const code = current.weather_code;
    let condition = 'Clear';
    let icon = 'clear-day';
    if (code >= 1 && code <= 3) {
      condition = code === 1 ? 'Clear' : 'Partly cloudy';
      icon = code === 1 ? 'clear-day' : 'partly-cloudy-day';
    } else if (code >= 45 && code <= 48) condition = 'Fog';
    else if (code >= 51 && code <= 67) {
      condition = 'Rain';
      icon = 'rain';
    } else if (code >= 71 && code <= 77) {
      condition = 'Snow';
      icon = 'snow';
    } else if (code >= 80 && code <= 82) {
      condition = 'Rain';
      icon = 'rain';
    } else if (code >= 95 && code <= 99) {
      condition = 'Thunderstorm';
      icon = 'thunderstorm';
    }

    return NextResponse.json({
      temp,
      city: WEATHER_CITY_NAME,
      condition,
      summary: '',
      highTemp,
      lowTemp,
      icon,
    });
  }

  const keyRaw = process.env.OPENWEATHER_API_KEY;
  const key = typeof keyRaw === 'string' ? keyRaw.trim() : '';
  if (!key) {
    return NextResponse.json({ error: 'OpenWeather API key not configured' }, { status: 503 });
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${WEATHER_ZIP}&units=imperial&appid=${encodeURIComponent(key)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    console.error('[weather] OpenWeather failed:', res.status, body);
    return NextResponse.json(
      { error: 'Weather fetch failed', detail: `OpenWeather returned ${res.status}: ${body.slice(0, 200)}` },
      { status: 502 }
    );
  }

  const data = await res.json();
  let condition = data.weather?.[0]?.main ?? 'Unknown';
  if (condition === 'Rain') condition = 'Raining';
  else if (condition === 'Snow') condition = 'Snowing';
  else if (condition === 'Haze') condition = 'Hazy';
  else if (condition === 'Mist') condition = 'Misting';
  else if (condition === 'Clouds') condition = 'Cloudy';

  const icon = iconMap[data.weather?.[0]?.icon] ?? 'clear-day';

  return NextResponse.json({
    temp: Math.round(data.main?.temp ?? 0),
    city: data.name ?? WEATHER_CITY_NAME,
    condition,
    summary: '',
    highTemp: data.main?.temp_max != null ? Math.round(data.main.temp_max) : undefined,
    lowTemp: data.main?.temp_min != null ? Math.round(data.main.temp_min) : undefined,
    icon,
  });
}
