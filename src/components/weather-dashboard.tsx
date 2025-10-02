"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Pin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WeatherCard from "./weather-card";
import type { CityWithWeather, City } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "./ui/separator";
import ForecastSheet from "./forecast-sheet";

type WeatherDashboardProps = {
  initialCitiesWithWeather: CityWithWeather[];
};

function WeatherCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export default function WeatherDashboard({
  initialCitiesWithWeather,
}: WeatherDashboardProps) {
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pinnedCityIds, setPinnedCityIds] = useState<number[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityWithWeather | null>(
    null
  );

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedPins = localStorage.getItem("pinnedCities");
    if (storedPins) {
      setPinnedCityIds(JSON.parse(storedPins));
    }
  }, []);

  useEffect(() => {
    const hasFailedFetches = initialCitiesWithWeather.some(
      (c) => c.weather === null
    );
    if (hasFailedFetches) {
      toast({
        variant: "destructive",
        title: "Failed to load some weather data",
        description:
          "There was a problem fetching weather for one or more cities.",
      });
    }
    setIsLoading(false);
  }, [initialCitiesWithWeather, toast]);

  useEffect(() => {
    const interval = setInterval(() => {
      navigate(window.location.pathname);
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [navigate]);

  const togglePin = (cityId: number) => {
    const newPinnedIds = pinnedCityIds.includes(cityId)
      ? pinnedCityIds.filter((id) => id !== cityId)
      : [...pinnedCityIds, cityId];
    setPinnedCityIds(newPinnedIds);
    localStorage.setItem("pinnedCities", JSON.stringify(newPinnedIds));
  };

  const handleViewForecast = (city: CityWithWeather) => {
    setSelectedCity(city);
  };

  const { pinnedCities, unpinnedCities } = useMemo(() => {
    const filtered = initialCitiesWithWeather.filter(
      (c) =>
        c.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pinned = filtered.filter((c) => pinnedCityIds.includes(c.city.id));
    const unpinned = filtered.filter((c) => !pinnedCityIds.includes(c.city.id));

    return { pinnedCities: pinned, unpinnedCities: unpinned };
  }, [initialCitiesWithWeather, searchTerm, pinnedCityIds]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold font-headline text-primary">
          Weather Dashboard
        </h1>
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search city or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Tabs
            value={unit}
            onValueChange={(value) =>
              setUnit(value as "celsius" | "fahrenheit")
            }
          >
            <TabsList>
              <TabsTrigger value="celsius">°C</TabsTrigger>
              <TabsTrigger value="fahrenheit">°F</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <WeatherCardSkeleton key={i} />
          ))}
        </div>
      ) : initialCitiesWithWeather.length > 0 ? (
        <div className="space-y-8">
          {pinnedCities.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Pin className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Pinned Cities</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pinnedCities.map(({ city, weather }) =>
                  weather ? (
                    <WeatherCard
                      key={city.id}
                      cityWithWeather={{ city, weather }}
                      unit={unit}
                      isPinned={true}
                      onPinToggle={togglePin}
                      onViewForecast={handleViewForecast}
                    />
                  ) : null
                )}
              </div>
              <Separator className="my-8" />
            </section>
          )}

          {unpinnedCities.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">All Cities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {unpinnedCities.map(({ city, weather }) =>
                  weather ? (
                    <WeatherCard
                      key={city.id}
                      cityWithWeather={{ city, weather }}
                      unit={unit}
                      isPinned={false}
                      onPinToggle={togglePin}
                      onViewForecast={handleViewForecast}
                    />
                  ) : null
                )}
              </div>
            </section>
          )}

          {pinnedCities.length === 0 && unpinnedCities.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No cities found. {searchTerm && "Try a different search."}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No weather data available.</p>
        </div>
      )}
      <ForecastSheet
        cityWithWeather={selectedCity}
        unit={unit}
        open={!!selectedCity}
        onOpenChange={(open) => {
          if (!open) setSelectedCity(null);
        }}
      />
    </div>
  );
}
