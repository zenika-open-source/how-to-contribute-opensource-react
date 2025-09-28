export type City = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type DailyForecast = {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
}

export type WeatherData = {
  temperature: number;
  humidity: number;
  isDay: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  windSpeed: number;
  daily: DailyForecast | null;
};

export type CityWithWeather = {
  city: City;
  weather: WeatherData | null;
};
