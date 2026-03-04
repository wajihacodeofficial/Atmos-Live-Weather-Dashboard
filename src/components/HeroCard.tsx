'use client';

import { WeatherData } from '@/lib/weather';
import {
  Heart,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Thermometer,
  Sun,
  Sunset,
} from 'lucide-react';
import { format } from 'date-fns';

interface HeroCardProps {
  data: WeatherData & { isMock?: boolean };
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
        return 'linear-gradient(145deg, #1e3a8a 0%, #1e40af 50%, #1e1b4b 100%)';
      case 'clouds':
        return 'linear-gradient(145deg, #1e293b 0%, #334155 50%, #0f172a 100%)';
      case 'rain':
        return 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #020617 100%)';
      default:
        return 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)';
    }
  };

  return (
    <div
      className="glass card-premium shadow-premium animate-fade"
      style={{ background: getWeatherGradient(data.main) }}
    >
      {/* City & Locale */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 12px #10b981',
              }}
            />
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Station Connected
            </p>
          </div>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '-0.04em',
            }}
          >
            {data.city}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            {data.country} · {format(now, 'EEEE, MMM d HH:mm')}
          </p>
        </div>

        <button
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)',
            color: isFavorite ? '#f59e0b' : '#fff',
          }}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Hero Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '3rem 0',
        }}
      >
        <div>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                fontSize: '8rem',
                fontWeight: 800,
                letterSpacing: '-0.05em',
                lineHeight: 1,
              }}
            >
              {temp}°
            </span>
            <span
              style={{
                fontSize: '2rem',
                fontWeight: 300,
                verticalAlign: 'top',
                color: 'rgba(255,255,255,0.4)',
                marginLeft: '0.5rem',
              }}
            >
              {unit}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <div
              className="glass"
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Thermometer size={14} color="var(--primary)" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>
                Feels {feelsLike}°
              </span>
            </div>
            <p
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'capitalize',
              }}
            >
              {data.description}
            </p>
          </div>
        </div>

        <div
          className="weather-icon-wrap"
          style={{ transform: 'scale(1.5)', marginRight: '2rem' }}
        >
          <img
            src={iconUrl}
            alt={data.description}
            width={120}
            height={120}
            style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3))' }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="glass"
            style={{
              width: '40px',
              height: '40px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '12px',
            }}
          >
            <Sun size={20} color="#fbbf24" />
          </div>
          <div>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--text-dim)',
                fontWeight: 600,
              }}
            >
              SUNRISE
            </p>
            <p style={{ fontWeight: 700 }}>{sunriseTime}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="glass"
            style={{
              width: '40px',
              height: '40px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '12px',
            }}
          >
            <Sunset size={20} color="#f87171" />
          </div>
          <div>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--text-dim)',
                fontWeight: 600,
              }}
            >
              SUNSET
            </p>
            <p style={{ fontWeight: 700 }}>{sunsetTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
