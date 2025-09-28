import { getWeatherInfoFromCode } from '@/lib/weather';

type WeatherIconProps = {
  weatherCode: number;
  isDay: number;
  className?: string;
};

export function WeatherIcon({ weatherCode, isDay, className }: WeatherIconProps) {
  const { icon: Icon } = getWeatherInfoFromCode(weatherCode, isDay);
  return <Icon className={className} />;
}
