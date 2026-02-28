'use client';

import { ForecastItem } from '@/lib/weather';
import { format } from 'date-fns';
import { Droplets } from 'lucide-react';

interface ForecastCardProps {
  forecast: ForecastItem[];
  unit: 'C' | 'F';
}

const toF = (c: number) => Math.round((c * 9) / 5 + 32);

const getWeatherEmoji = (main: string) => {
  switch (main.toLowerCase()) {
    case 'clear':
      return '☀️';
    case 'clouds':
      return '☁️';
    case 'rain':
      return '🌧️';
    case 'drizzle':
      return '🌦️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    case 'mist':
    case 'fog':
    case 'haze':
      return '🌫️';
    default:
      return '🌤️';
  }
};

export default function ForecastCard({ forecast, unit }: ForecastCardProps) {
  const convert = (c: number) => (unit === 'C' ? c : toF(c));

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <p className="section-title">7-Day Forecast</p>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {forecast.map((day, i) => {
          const date = new Date(day.dt * 1000);
          const isToday = i === 0;
          return (
            <div
              key={day.dt}
              className="forecast-card"
              style={{
                borderColor: isToday ? 'var(--accent-blue)' : undefined,
                background: isToday ? 'rgba(59,130,246,0.1)' : undefined,
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: isToday ? 'var(--accent-blue)' : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {isToday ? 'Today' : format(date, 'EEE')}
              </div>
              <div style={{ fontSize: '28px', margin: '8px 0' }}>
                {getWeatherEmoji(day.main)}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {convert(day.temp_max)}°
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                }}
              >
                {convert(day.temp_min)}°
              </div>
              {day.pop > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    fontSize: '11px',
                    color: '#06b6d4',
                  }}
                >
                  <Droplets size={10} />
                  {day.pop}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
