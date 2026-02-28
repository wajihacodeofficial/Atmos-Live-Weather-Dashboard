'use client';

import { WeatherData, getWindDirection } from '@/lib/weather';
import { Wind, ArrowUp } from 'lucide-react';

interface WindCardProps {
  data: WeatherData;
}

export default function WindCard({ data }: WindCardProps) {
  const direction = getWindDirection(data.wind_deg);

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <p className="section-title">Wind</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Compass */}
        <div
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            flexShrink: 0,
          }}
        >
          {/* Outer ring */}
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '2px solid var(--border)',
              position: 'absolute',
              background:
                'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
            }}
          />
          {/* Cardinal labels */}
          {[
            { label: 'N', deg: 0, x: 50, y: 8 },
            { label: 'E', deg: 90, x: 92, y: 52 },
            { label: 'S', deg: 180, x: 50, y: 95 },
            { label: 'W', deg: 270, x: 6, y: 52 },
          ].map(({ label, x, y }) => (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                fontSize: '10px',
                fontWeight: 700,
                color:
                  label === 'N' ? 'var(--accent-blue)' : 'var(--text-muted)',
              }}
            >
              {label}
            </div>
          ))}
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${data.wind_deg}deg)`,
              transformOrigin: 'center center',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <ArrowUp
              size={20}
              style={{
                color: 'var(--accent-blue)',
                filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.6))',
              }}
            />
          </div>
          {/* Center dot */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-blue)',
              boxShadow: '0 0 8px rgba(59,130,246,0.6)',
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              marginBottom: '4px',
            }}
          >
            <span style={{ fontSize: '36px', fontWeight: 700 }}>
              {data.wind_speed}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              km/h
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <Wind size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              From {direction}
            </span>
          </div>

          {/* Speed indicator bar */}
          <div
            style={{
              height: '6px',
              background: 'var(--bg-secondary)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min((data.wind_speed / 120) * 100, 100)}%`,
                background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                borderRadius: '3px',
                transition: 'width 1s ease',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '4px',
            }}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              0
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Calm
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Storm
            </span>
          </div>

          <div
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              background: 'rgba(59,130,246,0.08)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            {data.wind_speed < 20
              ? '🍃 Calm breeze'
              : data.wind_speed < 40
                ? '💨 Moderate wind'
                : data.wind_speed < 70
                  ? '🌬️ Strong wind'
                  : '⚠️ Dangerous wind'}
          </div>
        </div>
      </div>
    </div>
  );
}
