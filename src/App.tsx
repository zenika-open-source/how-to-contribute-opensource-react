import { useState, useEffect } from 'react';
import citiesData from '@/lib/cities.json';
import { getWeatherForCities } from '@/lib/weather';
import WeatherDashboard from '@/components/weather-dashboard';
import { Toaster } from "@/components/ui/toaster";
import type { City, CityWithWeather } from '@/types';

function App() {
  const [citiesWithWeather, setCitiesWithWeather] = useState<CityWithWeather[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialData() {
      const cities = citiesData as City[];
      try {
        const weatherDataResults = await getWeatherForCities(cities);
        
        const citiesWithWeatherData = cities.map((city, index) => {
          const weather = weatherDataResults[index] || null;
          return {
            city,
            weather,
          };
        });
        
        setCitiesWithWeather(citiesWithWeatherData);
      } catch (error) {
        console.error("Failed to fetch initial weather data:", error);
        setCitiesWithWeather(cities.map(city => ({ city, weather: null })));
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen font-body antialiased">
      <main className="container mx-auto p-4 md:p-8">
        <WeatherDashboard initialCitiesWithWeather={citiesWithWeather} />
      </main>
      <Toaster />
    </div>
  );
}

export default App;