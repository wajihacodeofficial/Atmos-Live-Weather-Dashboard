'use client';

import { AirQuality, getAQILabel } from '@/lib/weather';
import { Leaf } from 'lucide-react';

interface AirQualityCardProps {
  data: AirQuality;
}

export default function AirQualityCard({ data }: AirQualityCardProps) {
  const { label, color } = getAQILabel(data.aqi);

  const pollutants = [
    { label: 'PM2.5', value: data.pm2_5, unit: 'µg/m³' },
    { label: 'PM10', value: data.pm10, unit: 'µg/m³' },
    { label: 'O₃', value: data.o3, unit: 'µg/m³' },
    { label: 'NO₂', value: data.no2, unit: 'µg/m³' },
  ];

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
        <Leaf size={14} color={color} />
        <h4
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-dim)',
          }}
        >
          Air Quality
        </h4>
      </div>

      {/* AQI Big Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: `${color}15`,
            border: `2px solid ${color}40`,
            display: 'grid',
            placeItems: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
            color,
          }}
        >
          {data.aqi}
        </div>
        <div>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color }}>{label}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            Air Quality Index
          </p>
        </div>
      </div>

      {/* AQI Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            height: '6px',
            borderRadius: '3px',
            background:
              'linear-gradient(to right, #00e400, #ffff00, #ff7e00, #ff0000, #8f3f97)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-5px',
              left: `${((data.aqi - 1) / 4) * 100}%`,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: color,
              border: '3px solid var(--bg-dark)',
              boxShadow: `0 0 10px ${color}80`,
              transform: 'translateX(-50%)',
              transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
      </div>

      {/* Pollutant Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
        }}
      >
        {pollutants.map((p) => (
          <div
            key={p.label}
            className="glass"
            style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)' }}
          >
            <p
              style={{
                fontSize: '10px',
                color: 'var(--text-dim)',
                fontWeight: 600,
              }}
            >
              {p.label}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 700 }}>
              {p.value.toFixed(1)}{' '}
              <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                {p.unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
