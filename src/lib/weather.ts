import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  description: string;
  icon: string;
  main: string;
  sunrise: number;
  sunset: number;
  uvi?: number;
  timestamp: number;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  temp_min: number;
  temp_max: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  main: string;
  pop: number; // precipitation probability
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  pop: number;
}

export interface AirQuality {
  aqi: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export const getWindDirection = (deg: number): string => {
  const dirs = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  return dirs[Math.round(deg / 22.5) % 16];
};

export const getAQILabel = (aqi: number): { label: string; color: string } => {
  switch (aqi) {
    case 1:
      return { label: 'Good', color: '#00e400' };
    case 2:
      return { label: 'Fair', color: '#ffff00' };
    case 3:
      return { label: 'Moderate', color: '#ff7e00' };
    case 4:
      return { label: 'Poor', color: '#ff0000' };
    case 5:
      return { label: 'Very Poor', color: '#8f3f97' };
    default:
      return { label: 'Unknown', color: '#888' };
  }
};

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: { q: city, appid: API_KEY, units: 'metric' },
  });
  const d = response.data;
  return {
    city: d.name,
    country: d.sys.country,
    lat: d.coord.lat,
    lon: d.coord.lon,
    temp: Math.round(d.main.temp),
    feels_like: Math.round(d.main.feels_like),
    humidity: d.main.humidity,
    pressure: d.main.pressure,
    visibility: Math.round(d.visibility / 1000),
    wind_speed: Math.round(d.wind.speed * 3.6),
    wind_deg: d.wind.deg,
    description: d.weather[0].description,
    icon: d.weather[0].icon,
    main: d.weather[0].main,
    sunrise: d.sys.sunrise,
    sunset: d.sys.sunset,
    timestamp: d.dt,
  };
};

export const getWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: API_KEY, units: 'metric' },
  });
  const d = response.data;
  return {
    city: d.name,
    country: d.sys.country,
    lat: d.coord.lat,
    lon: d.coord.lon,
    temp: Math.round(d.main.temp),
    feels_like: Math.round(d.main.feels_like),
    humidity: d.main.humidity,
    pressure: d.main.pressure,
    visibility: Math.round(d.visibility / 1000),
    wind_speed: Math.round(d.wind.speed * 3.6),
    wind_deg: d.wind.deg,
    description: d.weather[0].description,
    icon: d.weather[0].icon,
    main: d.weather[0].main,
    sunrise: d.sys.sunrise,
    sunset: d.sys.sunset,
    timestamp: d.dt,
  };
};

export const getForecast = async (
  lat: number,
  lon: number
): Promise<{ daily: ForecastItem[]; hourly: HourlyForecast[] }> => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, appid: API_KEY, units: 'metric', cnt: 40 },
  });

  const list = response.data.list;

  // Group by day for daily forecast
  const dailyMap: { [key: string]: ForecastItem[] } = {};
  list.forEach((item: Record<string, unknown>) => {
    const date = new Date((item.dt as number) * 1000).toLocaleDateString(
      'en-US'
    );
    if (!dailyMap[date]) dailyMap[date] = [];
    const weather = (item.weather as Array<Record<string, unknown>>)[0];
    const main = item.main as Record<string, number>;
    const wind = item.wind as Record<string, number>;
    dailyMap[date].push({
      dt: item.dt as number,
      temp: Math.round(main.temp),
      temp_min: Math.round(main.temp_min),
      temp_max: Math.round(main.temp_max),
      feels_like: Math.round(main.feels_like),
      humidity: main.humidity,
      wind_speed: Math.round(wind.speed * 3.6),
      description: weather.description as string,
      icon: weather.icon as string,
      main: weather.main as string,
      pop: Math.round((item.pop as number) * 100),
    });
  });

  const daily: ForecastItem[] = Object.values(dailyMap)
    .slice(0, 7)
    .map((items) => {
      const temps = items.map((i) => i.temp);
      const avg = items[Math.floor(items.length / 2)];
      return {
        ...avg,
        temp: Math.round(temps.reduce((a, b) => a + b) / temps.length),
        temp_min: Math.min(...items.map((i) => i.temp_min)),
        temp_max: Math.max(...items.map((i) => i.temp_max)),
      };
    });

  // Hourly for next 24 hours
  const hourly: HourlyForecast[] = list
    .slice(0, 8)
    .map((item: Record<string, unknown>) => {
      const weather = (item.weather as Array<Record<string, unknown>>)[0];
      const main = item.main as Record<string, number>;
      const wind = item.wind as Record<string, number>;
      return {
        dt: item.dt as number,
        temp: Math.round(main.temp),
        feels_like: Math.round(main.feels_like),
        humidity: main.humidity,
        wind_speed: Math.round(wind.speed * 3.6),
        description: weather.description as string,
        icon: weather.icon as string,
        pop: Math.round((item.pop as number) * 100),
      };
    });

  return { daily, hourly };
};

export const getAirQuality = async (
  lat: number,
  lon: number
): Promise<AirQuality> => {
  const response = await axios.get(`${BASE_URL}/air_pollution`, {
    params: { lat, lon, appid: API_KEY },
  });
  const comp = response.data.list[0].components;
  return {
    aqi: response.data.list[0].main.aqi,
    co: comp.co,
    no: comp.no,
    no2: comp.no2,
    o3: comp.o3,
    so2: comp.so2,
    pm2_5: comp.pm2_5,
    pm10: comp.pm10,
    nh3: comp.nh3,
  };
};

export const searchCities = async (query: string) => {
  const response = await axios.get(`${GEO_URL}/direct`, {
    params: { q: query, limit: 5, appid: API_KEY },
  });
  return response.data.map((item: Record<string, unknown>) => ({
    name: item.name,
    country: item.country,
    state: item.state,
    lat: item.lat,
    lon: item.lon,
  }));
};
