'use client';

import { WeatherData } from '@/lib/weather';
import { Heart, Droplets, Wind, Eye, Gauge, Thermometer } from 'lucide-react';
import { format } from 'date-fns';

interface HeroCardProps {
  data: WeatherData;
  unit: 'C' | 'F';
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const toF = (c: number) => Math.round((c * 9) / 5 + 32);

export default function HeroCard({
  data,
  unit,
  isFavorite,
  onToggleFavorite,
}: HeroCardProps) {
  const temp = unit === 'C' ? data.temp : toF(data.temp);
  const feelsLike = unit === 'C' ? data.feels_like : toF(data.feels_like);
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

  const now = new Date();
  const sunriseTime = format(new Date(data.sunrise * 1000), 'h:mm a');
  const sunsetTime = format(new Date(data.sunset * 1000), 'h:mm a');

  const getWeatherGradient = (main: string) => {
    switch (main.toLowerCase()) {
      case 'clear':
        return 'linear-gradient(145deg, #0f2347 0%, #1a4480 50%, #0d1f3c 100%)';
      case 'clouds':
        return 'linear-gradient(145deg, #1a2744 0%, #2d3f5e 50%, #0d1f3c 100%)';
      case 'rain':
      case 'drizzle':
        return 'linear-gradient(145deg, #0d1f3c 0%, #1a2d4a 50%, #0f2347 100%)';
      case 'thunderstorm':
        return 'linear-gradient(145deg, #0a0a1a 0%, #1a1535 50%, #0d1f3c 100%)';
      case 'snow':
        return 'linear-gradient(145deg, #1a2a44 0%, #2a3f5f 50%, #0d1f3c 100%)';
      default:
        return 'linear-gradient(145deg, #0d1f3c 0%, #162944 50%, #0d1f3c 100%)';
    }
  };

  return (
    <div
      style={{
        background: getWeatherGradient(data.main),
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="shimmer-overlay" />

      {/* Top row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 6px #22c55e',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Live
            </span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 700, lineHeight: 1.2 }}>
            {data.city}
          </h2>
          <div
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginTop: '2px',
            }}
          >
            {data.country} · {format(now, 'EEEE, MMM d')}
          </div>
        </div>
        <button
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          id="favorite-toggle-btn"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Main temp display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '24px',
        }}
      >
        <div>
          <div className="temp-display">
            {temp}°
            <span style={{ fontSize: '48px', opacity: 0.6 }}>{unit}</span>
          </div>
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Thermometer size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Feels like {feelsLike}°{unit}
            </span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <span
              className="badge badge-blue"
              style={{ textTransform: 'capitalize' }}
            >
              {data.description}
            </span>
          </div>
        </div>

        <div className="weather-icon-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={iconUrl}
            alt={data.description}
            width={120}
            height={120}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(99,179,237,0.4))',
              zIndex: 1,
              position: 'relative',
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)',
        }}
      >
        {[
          {
            icon: <Droplets size={16} />,
            label: 'Humidity',
            value: `${data.humidity}%`,
            color: '#06b6d4',
          },
          {
            icon: <Wind size={16} />,
            label: 'Wind',
            value: `${data.wind_speed} km/h`,
            color: '#8b5cf6',
          },
          {
            icon: <Eye size={16} />,
            label: 'Visibility',
            value: `${data.visibility} km`,
            color: '#14b8a6',
          },
          {
            icon: <Gauge size={16} />,
            label: 'Pressure',
            value: `${data.pressure} hPa`,
            color: '#f97316',
          },
        ].map(({ icon, label, value, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div
              style={{
                color,
                marginBottom: '4px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {icon}
            </div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Sunrise/Sunset */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🌅</span>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Sunrise
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>
              {sunriseTime}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Sunset
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>
              {sunsetTime}
            </div>
          </div>
          <span style={{ fontSize: '20px' }}>🌇</span>
        </div>
      </div>
    </div>
  );
}
