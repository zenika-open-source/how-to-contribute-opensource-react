import citiesData from '@/lib/cities.json';
import { getWeatherForCities } from '@/lib/weather';
import WeatherDashboard from '@/components/weather-dashboard';
import type { City, CityWithWeather } from '@/types';

async function getInitialData(): Promise<CityWithWeather[]> {
  const cities = citiesData as City[];
  try {
    const weatherDataResults = await getWeatherForCities(cities);

    const citiesWithWeather = cities.map((city, index) => {
      const weather = weatherDataResults[index] || null;
      return {
        city,
        weather,
      };
    });

    return citiesWithWeather;
  } catch (error) {
    console.error("Failed to fetch initial weather data:", error);
    return cities.map(city => ({ city, weather: null }));
  }
}

export default async function Home() {
  const initialCitiesWithWeather = await getInitialData();

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto p-4 md:p-8">
        <WeatherDashboard initialCitiesWithWeather={initialCitiesWithWeather} />
      </main>
    </div>
  );
}
