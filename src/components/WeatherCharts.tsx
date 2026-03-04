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
import { Thermometer, CloudRain, Droplets, Wind } from 'lucide-react';

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
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--border-bright)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-dim)',
            marginBottom: '8px',
            fontWeight: 600,
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
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: p.color,
              }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
              {p.name}:
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
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
    {
      key: 'temperature' as const,
      label: 'Temperature',
      icon: <Thermometer size={14} />,
    },
    {
      key: 'precipitation' as const,
      label: 'Rain',
      icon: <CloudRain size={14} />,
    },
    {
      key: 'humidity' as const,
      label: 'Humidity',
      icon: <Droplets size={14} />,
    },
    { key: 'wind' as const, label: 'Wind', icon: <Wind size={14} /> },
  ];

  const chartColor = '#64748b';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Tab Switcher */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(255,255,255,0.03)',
          padding: '6px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition-smooth)',
              background: activeTab === tab.key ? '#fff' : 'transparent',
              color:
                activeTab === tab.key ? 'var(--bg-dark)' : 'var(--text-sub)',
              boxShadow:
                activeTab === tab.key ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hourly Chart */}
      <div>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-dim)',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Next 24 Hours
        </p>
        <ResponsiveContainer width="100%" height={200}>
          {activeTab === 'temperature' ? (
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="tempGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="feelsGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: chartColor }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartColor }}
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
                fill="url(#tempGrad2)"
                strokeWidth={2.5}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="feels"
                name="Feels like"
                stroke="#8b5cf6"
                fill="url(#feelsGrad2)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 2"
              />
            </AreaChart>
          ) : activeTab === 'precipitation' ? (
            <BarChart data={hourlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: chartColor }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartColor }}
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
                radius={[6, 6, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          ) : activeTab === 'humidity' ? (
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="humGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: chartColor }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartColor }}
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
                fill="url(#humGrad2)"
                strokeWidth={2.5}
                dot={false}
              />
            </AreaChart>
          ) : (
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="windGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: chartColor }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartColor }}
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
                fill="url(#windGrad2)"
                strokeWidth={2.5}
                dot={false}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Daily Overview */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '2rem',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-dim)',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          7-Day Overview
        </p>
        <ResponsiveContainer width="100%" height={180}>
          {activeTab === 'temperature' ? (
            <LineChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: chartColor }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartColor }}
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
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f97316' }}
              />
              <Line
                type="monotone"
                dataKey="min"
                name="Min temp"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#3b82f6' }}
              />
            </LineChart>
          ) : (
            <BarChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: chartColor }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartColor }}
                axisLine={false}
                tickLine={false}
                unit={activeTab === 'wind' ? ' km/h' : '%'}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Bar
                dataKey={
                  activeTab === 'wind'
                    ? 'wind'
                    : activeTab === 'humidity'
                      ? 'humidity'
                      : 'pop'
                }
                name={
                  activeTab === 'wind'
                    ? 'Wind'
                    : activeTab === 'humidity'
                      ? 'Humidity'
                      : 'Rain chance'
                }
                fill={activeTab === 'wind' ? '#14b8a6' : '#06b6d4'}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
