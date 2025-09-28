
'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { CityWithWeather } from "@/types";
import { format } from 'date-fns';
import { getWeatherInfoFromCode } from "@/lib/weather";
import { WeatherIcon } from "./weather-icon";

type ForecastSheetProps = {
    cityWithWeather: CityWithWeather | null;
    unit: 'celsius' | 'fahrenheit';
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function ForecastSheet({ cityWithWeather, unit, open, onOpenChange }: ForecastSheetProps) {
    if (!cityWithWeather || !cityWithWeather.weather || !cityWithWeather.weather.daily) {
        return null;
    }

    const { city, weather } = cityWithWeather;
    const { daily } = weather;
    const tempUnit = unit === 'celsius' ? '°C' : '°F';

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-bold">7-Day Forecast</SheetTitle>
                    <SheetDescription>
                        {city.name}, {city.country}
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-4">
                    {daily.time.slice(1).map((time, index) => {
                        const weatherInfo = getWeatherInfoFromCode(daily.weatherCode[index + 1]);
                        const maxTemp = daily.temperatureMax[index + 1];
                        const minTemp = daily.temperatureMin[index + 1];

                        return (
                            <div key={time} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div className="flex-1">
                                    <p className="font-bold">{format(new Date(time), 'EEE')}</p>
                                    <p className="text-sm text-muted-foreground">{weatherInfo.description}</p>
                                </div>
                                <WeatherIcon
                                    weatherCode={daily.weatherCode[index + 1]}
                                    isDay={1}
                                    className="h-8 w-8 text-primary mx-4"
                                />
                                <div className="text-right font-medium">
                                    <span>{Math.round(maxTemp)}{tempUnit}</span>
                                    <span className="text-muted-foreground"> / {Math.round(minTemp)}{tempUnit}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}
