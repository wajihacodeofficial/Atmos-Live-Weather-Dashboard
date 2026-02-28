'use client';

import { AirQuality, getAQILabel } from '@/lib/weather';

interface AirQualityCardProps {
  data: AirQuality;
}

export default function AirQualityCard({ data }: AirQualityCardProps) {
  const { label, color } = getAQILabel(data.aqi);
  const aqiPercent = ((data.aqi - 1) / 4) * 100;

  const pollutants = [
    {
      name: 'PM2.5',
      value: data.pm2_5.toFixed(1),
      unit: 'μg/m³',
      threshold: 25,
      color: '#3b82f6',
    },
    {
      name: 'PM10',
      value: data.pm10.toFixed(1),
      unit: 'μg/m³',
      threshold: 50,
      color: '#8b5cf6',
    },
    {
      name: 'O₃',
      value: data.o3.toFixed(1),
      unit: 'μg/m³',
      threshold: 100,
      color: '#06b6d4',
    },
    {
      name: 'NO₂',
      value: data.no2.toFixed(1),
      unit: 'μg/m³',
      threshold: 40,
      color: '#14b8a6',
    },
    {
      name: 'SO₂',
      value: data.so2.toFixed(1),
      unit: 'μg/m³',
      threshold: 20,
      color: '#f97316',
    },
    {
      name: 'CO',
      value: (data.co / 1000).toFixed(2),
      unit: 'mg/m³',
      threshold: 10,
      color: '#ec4899',
    },
  ];

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <p className="section-title">Air Quality Index</p>

      {/* AQI Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: `${color}22`,
            border: `3px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 0 20px ${color}44`,
          }}
        >
          <span style={{ fontSize: '22px', fontWeight: 700, color }}>
            {data.aqi}
          </span>
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 700, color }}>
            {label}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '4px',
            }}
          >
            {data.aqi === 1
              ? 'Air quality is satisfactory.'
              : data.aqi === 2
                ? 'Acceptable for most people.'
                : data.aqi === 3
                  ? 'Sensitive groups may be affected.'
                  : data.aqi === 4
                    ? 'Health effects expected.'
                    : 'Serious health effects for all.'}
          </div>
        </div>
      </div>

      {/* AQI gradient bar */}
      <div style={{ marginBottom: '24px' }}>
        <div className="aqi-bar">
          <div
            className="aqi-indicator"
            style={{ left: `${Math.min(Math.max(aqiPercent, 4), 96)}%` }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '6px',
          }}
        >
          {['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'].map((l) => (
            <span
              key={l}
              style={{
                fontSize: '9px',
                color: 'var(--text-muted)',
                letterSpacing: '0.02em',
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Pollutant grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {pollutants.map(({ name, value, unit, threshold, color: c }) => {
          const pct = Math.min((parseFloat(value) / threshold) * 100, 100);
          return (
            <div
              key={name}
              className="stat-card"
              style={{ padding: '14px', textAlign: 'center' }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                }}
              >
                {name}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: c }}>
                {value}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  marginBottom: '8px',
                }}
              >
                {unit}
              </div>
              <div
                style={{
                  height: '3px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '2px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: c,
                    borderRadius: '2px',
                    transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
