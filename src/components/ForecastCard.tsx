'use client';

import { ForecastItem } from '@/lib/weather';
import { format } from 'date-fns';
import {
  Droplets,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Snowflake,
  CloudFog,
} from 'lucide-react';

interface ForecastCardProps {
  forecast: ForecastItem[];
  unit: 'C' | 'F';
}

const toF = (c: number) => Math.round((c * 9) / 5 + 32);

const WeatherIcon = ({ main, size = 24 }: { main: string; size?: number }) => {
  const props = { size, className: 'transition-smooth' };
  switch (main.toLowerCase()) {
    case 'clear':
      return <Sun {...props} color="#fbbf24" />;
    case 'clouds':
      return <Cloud {...props} color="#94a3b8" />;
    case 'rain':
      return <CloudRain {...props} color="#3b82f6" />;
    case 'thunderstorm':
      return <CloudLightning {...props} color="#8b5cf6" />;
    case 'snow':
      return <Snowflake {...props} color="#fff" />;
    case 'mist':
    case 'fog':
    case 'haze':
      return <CloudFog {...props} color="#94a3b8" />;
    default:
      return <Cloud {...props} color="#3b82f6" />;
  }
};

export default function ForecastCard({ forecast, unit }: ForecastCardProps) {
  const convert = (c: number) => (unit === 'C' ? c : toF(c));

  return (
    <div className="glass card-premium" style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h4
          style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-dim)',
          }}
        >
          Extended Forecast
        </h4>
        <div
          style={{
            padding: '4px 12px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            fontSize: '11px',
            color: 'var(--text-sub)',
          }}
        >
          Next 7 Days
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.75rem',
        }}
      >
        {forecast.map((day, i) => {
          const date = new Date(day.dt * 1000);
          const isToday = i === 0;
          return (
            <div
              key={day.dt}
              className="glass glass-hover"
              style={{
                padding: '1.25rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.75rem',
                background: isToday
                  ? 'rgba(59,130,246,0.1)'
                  : 'rgba(255,255,255,0.02)',
                borderColor: isToday
                  ? 'var(--primary)'
                  : 'var(--border-subtle)',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: isToday ? 'var(--primary)' : 'var(--text-dim)',
                }}
              >
                {isToday ? 'Today' : format(date, 'EEE')}
              </span>

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
                <WeatherIcon main={day.main} size={20} />
              </div>

              <div>
                <p style={{ fontSize: '15px', fontWeight: 700 }}>
                  {convert(day.temp_max)}°
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-dim)',
                    fontWeight: 600,
                  }}
                >
                  {convert(day.temp_min)}°
                </p>
              </div>

              {day.pop > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    color: 'var(--accent)',
                    fontWeight: 700,
                  }}
                >
                  <Droplets size={10} />
                  {day.pop}%
                </div>
              ) : (
                <div style={{ height: '15px' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
