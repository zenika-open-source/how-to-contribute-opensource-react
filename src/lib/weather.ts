import type { LucideIcon } from 'lucide-react';
import { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, Snowflake, Zap, CloudHail, Cloudy } from 'lucide-react';
import type { City, WeatherData } from '@/types';

export type WeatherInfo = {
  description: string;
  icon: LucideIcon;
};

export async function getWeatherForCities(cities: City[], unit: 'celsius' | 'fahrenheit' = 'celsius'): Promise<(WeatherData | null)[]> {
  if (cities.length === 0) return [];

  const lats = cities.map(c => c.latitude.toFixed(2)).join(',');
  const lons = cities.map(c => c.longitude.toFixed(2)).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=${unit}&wind_speed_unit=mph&timezone=auto&forecast_days=8`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch weather data:", response.statusText);
      return cities.map(() => null);
    }
    
    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map(d => (d.current && d.daily) ? {
        temperature: d.current.temperature_2m,
        humidity: d.current.relative_humidity_2m,
        isDay: d.current.is_day,
        precipitation: d.current.precipitation,
        rain: d.current.rain,
        showers: d.current.showers,
        snowfall: d.current.snowfall,
        weatherCode: d.current.weather_code,
        windSpeed: d.current.wind_speed_10m,
        daily: {
            time: d.daily.time,
            weatherCode: d.daily.weather_code,
            temperatureMax: d.daily.temperature_2m_max,
            temperatureMin: d.daily.temperature_2m_min,
        }
      } : null);
    } else if (data && data.current && data.daily) { // Handle single location response
      return [{
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        isDay: data.current.is_day,
        precipitation: data.current.precipitation,
        rain: data.current.rain,
        showers: data.current.showers,
        snowfall: data.current.snowfall,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        daily: {
            time: data.daily.time,
            weatherCode: data.daily.weather_code,
            temperatureMax: data.daily.temperature_2m_max,
            temperatureMin: data.daily.temperature_2m_min,
        }
      }];
    }
    
    return cities.map(() => null);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return cities.map(() => null);
  }
}

export function getWeatherInfoFromCode(code: number, isDay: number = 1): WeatherInfo {
  if (code === 0) return { description: 'Clear sky', icon: isDay ? Sun : Moon };
  if (code === 1) return { description: 'Mainly clear', icon: isDay ? CloudSun : CloudMoon };
  if (code === 2) return { description: 'Partly cloudy', icon: isDay ? CloudSun : CloudMoon };
  if (code === 3) return { description: 'Overcast', icon: Cloud };
  if ([45, 48].includes(code)) return { description: 'Fog', icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(code)) return { description: 'Drizzle', icon: CloudDrizzle };
  if ([61, 63, 65, 66, 67].includes(code)) return { description: 'Rain', icon: CloudRain };
  if ([71, 73, 75, 77].includes(code)) return { description: 'Snow', icon: CloudSnow };
  if ([80, 81, 82].includes(code)) return { description: 'Rain showers', icon: CloudRain };
  if ([85, 86].includes(code)) return { description: 'Snow showers', icon: Snowflake };
  if (code === 95) return { description: 'Thunderstorm', icon: Zap };
  if ([96, 99].includes(code)) return { description: 'Thunderstorm with hail', icon: CloudHail };
  
  return { description: 'Cloudy', icon: Cloudy };
}
