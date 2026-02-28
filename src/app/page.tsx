'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Cloud, RefreshCw } from 'lucide-react';
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
  const [weather, setWeather] = useState<WeatherData | null>(null);
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
    // Default to a city
    fetchWeather('London');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync main heart icon with favorites state changes
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
      /* DB might not be configured */
    }
  };

  const loadHistory = async () => {
    try {
      const res = await axios.get('/api/history');
      setHistory(res.data);
    } catch {
      /* DB might not be configured */
    }
  };

  const fetchWeather = useCallback(
    async (city: string, lat?: number, lon?: number) => {
      setLoading(true);
      setError(null);
      try {
        // Fetch current weather
        const weatherRes = await axios.get('/api/weather', {
          params: lat && lon ? { lat, lon } : { city },
        });
        const weatherData: WeatherData = weatherRes.data;
        setWeather(weatherData);
        setLastUpdated(new Date());

        // Check if favorite
        setIsFavorite(
          favorites.some(
            (f) => f.city.toLowerCase() === weatherData.city.toLowerCase()
          )
        );

        // Fetch forecast + AQI in parallel
        const forecastRes = await axios.get('/api/forecast', {
          params: { lat: weatherData.lat, lon: weatherData.lon },
        });
        setForecast({
          daily: forecastRes.data.daily,
          hourly: forecastRes.data.hourly,
        });
        setAirQuality(forecastRes.data.airQuality);

        // Log to history (best-effort)
        try {
          await axios.post('/api/history', {
            city: weatherData.city,
            country: weatherData.country,
            lat: weatherData.lat,
            lon: weatherData.lon,
          });
          loadHistory();
        } catch {
          /* non-fatal */
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error || 'City not found. Please try again.'
          );
        } else {
          setError('Something went wrong. Please check your API key.');
        }
      } finally {
        setLoading(false);
      }
    },
    [favorites]
  );

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather('', pos.coords.latitude, pos.coords.longitude),
      () => setError('Unable to retrieve your location.')
    );
  };

  const handleToggleFavorite = async () => {
    if (!weather) return;
    if (isFavorite) {
      const fav = favorites.find(
        (f) => f.city.toLowerCase() === weather.city.toLowerCase()
      );
      if (fav) {
        try {
          await axios.delete(`/api/favorites?id=${fav.id}`);
          setIsFavorite(false);
          loadFavorites();
        } catch {
          /* non-fatal */
        }
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
      } catch {
        /* non-fatal */
      }
    }
  };

  const handleRemoveFavorite = async (id: number) => {
    try {
      await axios.delete(`/api/favorites?id=${id}`);
      loadFavorites();
    } catch {
      /* non-fatal */
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete('/api/history');
      setHistory([]);
    } catch {
      /* non-fatal */
    }
  };

  const handleRefresh = () => {
    if (weather) fetchWeather(weather.city, weather.lat, weather.lon);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Navigation */}
      <nav className="nav-bar" style={{ position: 'relative', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(59,130,246,0.4)',
            }}
          >
            <Cloud size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h1
              style={{
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              <span className="gradient-text">Atmos</span>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
                Dashboard
              </span>
            </h1>
          </div>
        </div>

        {/* Search bar in nav */}
        <div
          style={{
            flex: 1,
            maxWidth: '460px',
            marginLeft: '40px',
            position: 'relative',
          }}
        >
          <SearchBar
            onSearch={fetchWeather}
            onLocate={handleLocate}
            isLoading={loading}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Unit toggle */}
          <div className="unit-toggle">
            <button
              className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
              onClick={() => setUnit('C')}
              id="unit-celsius"
            >
              °C
            </button>
            <button
              className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
              onClick={() => setUnit('F')}
              id="unit-fahrenheit"
            >
              °F
            </button>
          </div>

          {/* Refresh */}
          {weather && (
            <button
              onClick={handleRefresh}
              title="Refresh"
              id="refresh-btn"
              style={{
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--accent-blue)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(59,130,246,0.2)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'rgba(59,130,246,0.1)')
              }
            >
              <RefreshCw
                size={16}
                style={{
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                }}
              />
            </button>
          )}
        </div>
      </nav>

      {/* Main layout */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <div className="dashboard-grid">
          {/* LEFT COLUMN */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Error state */}
            {error && (
              <div className="error-card">
                <span style={{ fontSize: '20px' }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                    Error
                  </div>
                  <div style={{ fontSize: '13px' }}>{error}</div>
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && !weather && (
              <div
                style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}
              >
                <div className="skeleton" style={{ height: '400px' }} />
              </div>
            )}

            {/* Hero weather card */}
            {weather && !loading && (
              <HeroCard
                data={weather}
                unit={unit}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* Last updated */}
            {lastUpdated && !loading && (
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                }}
              >
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}

            {/* Wind card */}
            {weather && !loading && <WindCard data={weather} />}

            {/* Air Quality */}
            {airQuality && !loading && <AirQualityCard data={airQuality} />}

            {/* Side panel */}
            {(favorites.length > 0 || history.length > 0) && (
              <SidePanel
                favorites={favorites}
                history={history}
                onSelect={fetchWeather}
                onRemoveFavorite={handleRemoveFavorite}
                onClearHistory={handleClearHistory}
              />
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Loading skeletons */}
            {loading && (
              <>
                <div
                  className="skeleton"
                  style={{ height: '140px', borderRadius: 'var(--radius-lg)' }}
                />
                <div
                  className="skeleton"
                  style={{ height: '420px', borderRadius: 'var(--radius-lg)' }}
                />
              </>
            )}

            {/* 7-day forecast */}
            {forecast && !loading && (
              <ForecastCard forecast={forecast.daily} unit={unit} />
            )}

            {/* Charts */}
            {forecast && !loading && (
              <WeatherCharts
                daily={forecast.daily}
                hourly={forecast.hourly}
                unit={unit}
              />
            )}

            {/* Empty state */}
            {!weather && !loading && !error && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '400px',
                  gap: '16px',
                  color: 'var(--text-muted)',
                }}
              >
                <div style={{ fontSize: '64px' }}>🌍</div>
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Search for any city
                </p>
                <p style={{ fontSize: '14px', textAlign: 'center' }}>
                  Enter a city name above to get live weather data,
                  <br />
                  7-day forecasts, and analytics.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '24px',
          borderTop: '1px solid var(--border)',
          color: 'var(--text-muted)',
          fontSize: '12px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Cloud size={14} style={{ color: 'var(--accent-blue)' }} />
          <span>Atmos Dashboard · Powered by OpenWeatherMap</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <a
            href="https://openweathermap.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
          >
            API Docs
          </a>
        </div>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
