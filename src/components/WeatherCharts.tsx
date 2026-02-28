'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import { ForecastItem, HourlyForecast } from '@/lib/weather';
import { format } from 'date-fns';
import { useState } from 'react';

interface WeatherChartsProps {
  daily: ForecastItem[];
  hourly: HourlyForecast[];
  unit: 'C' | 'F';
}

const toF = (c: number) => Math.round((c * 9) / 5 + 32);

const CustomTooltip = ({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  unit: 'C' | 'F';
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#0d1f3c',
          border: '1px solid rgba(99,179,237,0.2)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '8px',
          }}
        >
          {label}
        </p>
        {payload.map((p, i) => (
          <div
            key={i}
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
                background: p.color,
              }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {p.name}:
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {p.name.toLowerCase().includes('temp') ||
              p.name.toLowerCase().includes('feels')
                ? `${p.value}°${unit}`
                : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function WeatherCharts({
  daily,
  hourly,
  unit,
}: WeatherChartsProps) {
  const [activeTab, setActiveTab] = useState<
    'temperature' | 'precipitation' | 'humidity' | 'wind'
  >('temperature');

  const convert = (c: number) => (unit === 'C' ? c : toF(c));

  const hourlyData = hourly.map((h) => ({
    time: format(new Date(h.dt * 1000), 'ha'),
    temp: convert(h.temp),
    feels: convert(h.feels_like),
    humidity: h.humidity,
    wind: h.wind_speed,
    pop: h.pop,
  }));

  const dailyData = daily.map((d) => ({
    day: format(new Date(d.dt * 1000), 'EEE'),
    max: convert(d.temp_max),
    min: convert(d.temp_min),
    avg: convert(d.temp),
    humidity: d.humidity,
    wind: d.wind_speed,
    pop: d.pop,
  }));

  const tabs = [
    { key: 'temperature', label: '🌡️ Temperature' },
    { key: 'precipitation', label: '🌧️ Rain Chance' },
    { key: 'humidity', label: '💧 Humidity' },
    { key: 'wind', label: '💨 Wind' },
  ] as const;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p className="section-title" style={{ marginBottom: 0 }}>
          Weather Analytics
        </p>
        <div className="tab-bar" style={{ overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              id={`chart-tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hourly chart section */}
      <div style={{ marginBottom: '12px' }}>
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Next 24 hours
        </p>
        <ResponsiveContainer width="100%" height={180}>
          {activeTab === 'temperature' ? (
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="feelsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(99,179,237,0.08)"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
                unit={`°${unit}`}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Area
                type="monotone"
                dataKey="temp"
                name="Temp"
                stroke="#3b82f6"
                fill="url(#tempGrad)"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="feels"
                name="Feels like"
                stroke="#8b5cf6"
                fill="url(#feelsGrad)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 2"
              />
            </AreaChart>
          ) : activeTab === 'precipitation' ? (
            <BarChart data={hourlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(99,179,237,0.08)"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Bar
                dataKey="pop"
                name="Rain chance"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          ) : activeTab === 'humidity' ? (
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(99,179,237,0.08)"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <ReferenceLine
                y={60}
                stroke="rgba(249,115,22,0.4)"
                strokeDasharray="4 2"
                label={{ value: 'High', fill: '#f97316', fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#06b6d4"
                fill="url(#humGrad)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          ) : (
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(99,179,237,0.08)"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
                unit=" km/h"
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Area
                type="monotone"
                dataKey="wind"
                name="Wind speed"
                stroke="#14b8a6"
                fill="url(#windGrad)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '20px',
          marginTop: '8px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          7-day overview
        </p>
        <ResponsiveContainer width="100%" height={160}>
          {activeTab === 'temperature' ? (
            <LineChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(99,179,237,0.08)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
                unit={`°${unit}`}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Line
                type="monotone"
                dataKey="max"
                name="Max temp"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 3, fill: '#f97316' }}
              />
              <Line
                type="monotone"
                dataKey="min"
                name="Min temp"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#3b82f6' }}
              />
            </LineChart>
          ) : activeTab === 'precipitation' ? (
            <BarChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(99,179,237,0.08)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Bar
                dataKey="pop"
                name="Rain chance"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : activeTab === 'humidity' ? (
            <BarChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(99,179,237,0.08)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Bar
                dataKey="humidity"
                name="Humidity"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <BarChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(99,179,237,0.08)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#4a7a9b' }}
                axisLine={false}
                tickLine={false}
                unit=" km/h"
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Bar
                dataKey="wind"
                name="Wind"
                fill="#14b8a6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
