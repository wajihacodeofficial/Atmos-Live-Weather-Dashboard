'use client';

import { WeatherData, getWindDirection } from '@/lib/weather';
import { Wind, Navigation, Gauge } from 'lucide-react';

interface WindCardProps {
  data: WeatherData;
}

export default function WindCard({ data }: WindCardProps) {
  const direction = getWindDirection(data.wind_deg);

  return (
    <div className="glass card-premium" style={{ padding: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1.5rem',
        }}
      >
        <Wind size={14} color="var(--primary)" />
        <h4
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-dim)',
          }}
        >
          Wind Status
        </h4>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span
              style={{
                fontSize: '3rem',
                fontWeight: 800,
                letterSpacing: '-0.04em',
              }}
            >
              {data.wind_speed}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'var(--text-dim)',
                fontWeight: 600,
              }}
            >
              km/h
            </span>
          </div>
          <p
            style={{
              color: 'var(--text-sub)',
              fontSize: '13px',
              marginTop: '4px',
            }}
          >
            Direction:{' '}
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {direction} ({data.wind_deg}°)
            </span>
          </p>
        </div>

        {/* Compass */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '2px solid var(--border-bright)',
            background: 'rgba(255,255,255,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Navigation
            size={24}
            color="var(--primary)"
            style={{
              transform: `rotate(${data.wind_deg}deg)`,
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          {['N', 'E', 'S', 'W'].map((d, i) => (
            <span
              key={d}
              style={{
                position: 'absolute',
                fontSize: '8px',
                fontWeight: 700,
                color: 'var(--text-dim)',
                ...(i === 0
                  ? { top: '4px' }
                  : i === 1
                    ? { right: '4px' }
                    : i === 2
                      ? { bottom: '4px' }
                      : { left: '4px' }),
              }}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
