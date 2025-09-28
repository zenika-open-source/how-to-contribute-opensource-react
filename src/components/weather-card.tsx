'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getWeatherInfoFromCode } from "@/lib/weather";
import type { CityWithWeather } from "@/types";
import { WeatherIcon } from "./weather-icon";
import { Droplets, Gauge, Wind, CloudRain, Pin, CalendarDays } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CardFooter } from "./ui/card";

type WeatherCardProps = {
  cityWithWeather: CityWithWeather;
  unit: 'celsius' | 'fahrenheit';
  isPinned: boolean;
  onPinToggle: (cityId: number) => void;
  onViewForecast: (city: CityWithWeather) => void;
};

export default function WeatherCard({ cityWithWeather, unit, isPinned, onPinToggle, onViewForecast }: WeatherCardProps) {
  if (!cityWithWeather?.weather || !cityWithWeather.city) return null;

  const { city, weather } = cityWithWeather;
  
  const weatherInfo = getWeatherInfoFromCode(weather.weatherCode, weather.isDay);

  const displayTemp = unit === 'celsius' 
    ? weather.temperature 
    : (weather.temperature * 9 / 5) + 32;

  const tempUnit = unit === 'celsius' ? 'C' : 'F';

  return (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-primary"
        onClick={() => onPinToggle(city.id)}
        aria-label={isPinned ? 'Unpin city' : 'Pin city'}
      >
        <Pin className={cn("h-5 w-5", isPinned && "fill-primary text-primary")} />
      </Button>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pr-12">
        <div>
            <CardTitle className="text-xl font-bold">{city.name}</CardTitle>
            <CardDescription>{city.country}</CardDescription>
        </div>
        <WeatherIcon weatherCode={weather.weatherCode} isDay={weather.isDay} className="h-10 w-10 text-primary" />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-grow">
        <div className="text-center my-4">
          <p className="text-7xl font-bold tracking-tighter text-foreground">
            {Math.round(displayTemp)}°<span className="text-5xl align-top font-light">{tempUnit}</span>
          </p>
          <p className="text-muted-foreground capitalize">{weatherInfo.description}</p>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 text-sm mt-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            <span>Humidity: {Math.round(weather.humidity)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-primary" />
            <span>Wind: {Math.round(weather.windSpeed)} mph</span>
          </div>
           <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            <span>Precip: {weather.precipitation} mm</span>
          </div>
           <div className="flex items-center gap-2">
            <CloudRain className="h-4 w-4 text-primary" />
            <span>Rain: {weather.rain} mm</span>
          </div>
        </div>
      </CardContent>
       <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewForecast(cityWithWeather)}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          View 7-Day Forecast
        </Button>
      </CardFooter>
    </Card>
  );
}
