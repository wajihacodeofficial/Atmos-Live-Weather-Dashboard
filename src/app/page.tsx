'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Cloud,
  RefreshCw,
  Search,
  MapPin,
  Menu,
  Bell,
  Settings,
  ChevronRight,
  Info,
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import HeroCard from '@/components/HeroCard';
import ForecastCard from '@/components/ForecastCard';
import WeatherCharts from '@/components/WeatherCharts';
import AirQualityCard from '@/components/AirQualityCard';
import WindCard from '@/components/WindCard';
import SidePanel from '@/components/SidePanel';
import {
  WeatherData,
  ForecastItem,
  HourlyForecast,
  AirQuality,
} from '@/lib/weather';

interface FavoriteCity {
  id: number;
  city: string;
  country?: string | null;
  lat?: number | null;
  lon?: number | null;
  createdAt: string;
}

interface HistoryCity {
  id: number;
  city: string;
  country?: string | null;
  lat?: number | null;
  lon?: number | null;
  createdAt: string;
}

export default function Dashboard() {
  const [weather, setWeather] = useState<
    (WeatherData & { isMock?: boolean }) | null
  >(null);
  const [forecast, setForecast] = useState<{
    daily: ForecastItem[];
    hourly: HourlyForecast[];
  } | null>(null);
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [history, setHistory] = useState<HistoryCity[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load favorites and history on mount
  useEffect(() => {
    loadFavorites();
    loadHistory();
    fetchWeather('London');
  }, []);

  // Sync main heart icon
  useEffect(() => {
    if (weather) {
      setIsFavorite(
        favorites.some(
          (f) => f.city.toLowerCase() === weather.city.toLowerCase()
        )
      );
    }
  }, [favorites, weather]);

  const loadFavorites = async () => {
    try {
      const res = await axios.get('/api/favorites');
      setFavorites(res.data);
    } catch {
      /* DB check */
    }
  };

  const loadHistory = async () => {
    try {
      const res = await axios.get('/api/history');
      setHistory(res.data);
    } catch {
      /* DB check */
    }
  };

  const fetchWeather = useCallback(
    async (city: string, lat?: number, lon?: number) => {
      setLoading(true);
      setError(null);
      try {
        const weatherRes = await axios.get('/api/weather', {
          params: lat && lon ? { lat, lon } : { city },
        });
        const weatherData = weatherRes.data;
        setWeather(weatherData);
        setLastUpdated(new Date());

        const forecastRes = await axios.get('/api/forecast', {
          params: { lat: weatherData.lat, lon: weatherData.lon },
        });
        setForecast({
          daily: forecastRes.data.daily,
          hourly: forecastRes.data.hourly,
        });
        setAirQuality(forecastRes.data.airQuality);

        // History log
        if (!weatherData.isMock) {
          try {
            await axios.post('/api/history', {
              city: weatherData.city,
              country: weatherData.country,
              lat: weatherData.lat,
              lon: weatherData.lon,
            });
            loadHistory();
          } catch {}
        }
      } catch (err) {
        setError(
          'Connection issues or invalid city. Displaying local cache if available.'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather('', pos.coords.latitude, pos.coords.longitude),
      () => setError('Location permission denied.')
    );
  };

  const handleToggleFavorite = async () => {
    if (!weather || weather.isMock) return;
    if (isFavorite) {
      const fav = favorites.find(
        (f) => f.city.toLowerCase() === weather.city.toLowerCase()
      );
      if (fav) {
        try {
          await axios.delete(`/api/favorites?id=${fav.id}`);
          setIsFavorite(false);
          loadFavorites();
        } catch {}
      }
    } else {
      try {
        await axios.post('/api/favorites', {
          city: weather.city,
          country: weather.country,
          lat: weather.lat,
          lon: weather.lon,
        });
        setIsFavorite(true);
        loadFavorites();
      } catch {}
    }
  };

  const handleRefresh = () => {
    if (weather) fetchWeather(weather.city, weather.lat, weather.lon);
  };

  return (
    <div className="min-h-screen">
      <div className="app-bg" />

      {weather?.isMock && (
        <div className="demo-banner">
          <Info size={14} style={{ display: 'inline', marginRight: '8px' }} />
          DEMO MODE: Using mock data because OpenWeatherMap API key is invalid
          or missing.
        </div>
      )}

      <nav className="nav-wrap">
        <div className="brand-logo" onClick={() => window.location.reload()}>
          <div className="logo-icon">
            <Cloud size={24} color="white" />
          </div>
          <h1 className="heading-font">
            <span className="gradient-text">Atmos</span>
            <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>
              Dash
            </span>
          </h1>
        </div>

        <div className="search-wrapper">
          <SearchBar
            onSearch={fetchWeather}
            onLocate={handleLocate}
            isLoading={loading}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="unit-switcher">
            <button
              className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
              onClick={() => setUnit('C')}
            >
              °C
            </button>
            <button
              className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
              onClick={() => setUnit('F')}
            >
              °F
            </button>
          </div>

          <button
            className="btn-icon"
            onClick={handleRefresh}
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <div
            className="btn-icon"
            style={{ borderColor: 'transparent', cursor: 'default' }}
          >
            <Bell size={18} color="var(--text-dim)" />
          </div>
        </div>
      </nav>

      <main className="dashboard-container">
        {/* Left Side: Core Weather & Insights */}
        <section
          className="animate-fade"
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {error && (
            <div
              className="glass"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: '1rem',
                borderLeft: '4px solid #ef4444',
              }}
            >
              <span style={{ color: '#ef4444' }}>⚠️</span>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                {error}
              </p>
            </div>
          )}

          {loading && !weather ? (
            <div
              className="glass animate-pulse"
              style={{ height: '450px', borderRadius: 'var(--radius-xl)' }}
            />
          ) : (
            weather && (
              <HeroCard
                data={weather}
                unit={unit}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            )
          )}

          <div className="stat-grid">
            {weather && <WindCard data={weather} />}
            {airQuality && <AirQualityCard data={airQuality} />}
          </div>

          <SidePanel
            favorites={favorites}
            history={history}
            onSelect={fetchWeather}
            onRemoveFavorite={(id) =>
              axios.delete(`/api/favorites?id=${id}`).then(loadFavorites)
            }
            onClearHistory={() =>
              axios.delete('/api/history').then(() => setHistory([]))
            }
          />
        </section>

        {/* Right Side: Forecast & Analytics */}
        <section
          className="animate-fade"
          style={{
            animationDelay: '0.2s',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {loading ? (
            <div
              className="glass animate-pulse"
              style={{ height: '200px', borderRadius: 'var(--radius-xl)' }}
            />
          ) : (
            forecast && <ForecastCard forecast={forecast.daily} unit={unit} />
          )}

          {forecast && (
            <div className="glass card-premium">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                }}
              >
                <h3
                  className="heading-font"
                  style={{ fontSize: '1.25rem', fontWeight: 600 }}
                >
                  Weather Analytics
                </h3>
                <div
                  className="glass"
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Next 7 Days
                </div>
              </div>
              <WeatherCharts
                daily={forecast.daily}
                hourly={forecast.hourly}
                unit={unit}
              />
            </div>
          )}

          {/* Detailed Stats Grid */}
          {weather && (
            <div
              className="glass card-premium"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px',
                }}
              >
                <Settings size={14} color="var(--primary)" />
                <h4
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--text-dim)',
                  }}
                >
                  Atmospheric Details
                </h4>
              </div>
              <div className="stat-grid-4 stat-grid" style={{ gap: '2rem' }}>
                <div>
                  <p style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                    Humidity
                  </p>
                  <p style={{ fontSize: '1.50rem', fontWeight: 700 }}>
                    {weather.humidity}%
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                    Pressure
                  </p>
                  <p style={{ fontSize: '1.50rem', fontWeight: 700 }}>
                    {weather.pressure}{' '}
                    <span style={{ fontSize: '12px' }}>hPa</span>
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                    Visibility
                  </p>
                  <p style={{ fontSize: '1.50rem', fontWeight: 700 }}>
                    {weather.visibility}{' '}
                    <span style={{ fontSize: '12px' }}>km</span>
                  </p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                    Wind Degree
                  </p>
                  <p style={{ fontSize: '1.50rem', fontWeight: 700 }}>
                    {weather.wind_deg}°
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer
        style={{
          padding: '4rem 2rem 2rem',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: '4rem',
        }}
      >
        <div
          className="dashboard-container"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            padding: 0,
          }}
        >
          <div>
            <div
              className="brand-logo"
              style={{ fontSize: '1rem', marginBottom: '1rem' }}
            >
              <div
                className="logo-icon"
                style={{ width: '30px', height: '30px' }}
              >
                <Cloud size={16} color="white" />
              </div>
              <span>AtmosDash</span>
            </div>
            <p
              style={{
                color: 'var(--text-dim)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
              }}
            >
              Professional weather intelligence for modern environments.
              Data-driven insights at your fingertips.
            </p>
          </div>
          <div style={{ paddingLeft: '2rem' }}>
            <h5
              style={{
                fontWeight: 700,
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              Platform
            </h5>
            <ul
              style={{
                listStyle: 'none',
                color: 'var(--text-sub)',
                fontSize: '0.875rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <li className="glass-hover" style={{ cursor: 'pointer' }}>
                Live Weather
              </li>
              <li className="glass-hover" style={{ cursor: 'pointer' }}>
                Forecast Maps
              </li>
              <li className="glass-hover" style={{ cursor: 'pointer' }}>
                Air Quality
              </li>
            </ul>
          </div>
          <div>
            <h5
              style={{
                fontWeight: 700,
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              Resources
            </h5>
            <ul
              style={{
                listStyle: 'none',
                color: 'var(--text-sub)',
                fontSize: '0.875rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <li>OpenWeather API</li>
              <li>Documentation</li>
              <li>HCI Guidelines</li>
            </ul>
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: '3rem',
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
          }}
        >
          © 2024 Atmos Dashboard. Built with Next.js and Prisma. Designed for
          visual excellence.
        </div>
      </footer>

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
