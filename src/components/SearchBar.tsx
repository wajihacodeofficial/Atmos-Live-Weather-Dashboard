'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { searchCities } from '@/lib/weather';
import { useDebouncedCallback } from '@/hooks/useDebounce';

interface City {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onSearch: (city: string, lat?: number, lon?: number) => void;
  onLocate: () => void;
  isLoading: boolean;
}

export default function SearchBar({
  onSearch,
  onLocate,
  isLoading,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchCities = useDebouncedCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setSearching(true);
    try {
      const data = await searchCities(q);
      setResults(data);
      setShowDropdown(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, 400);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    fetchCities(val);
  };

  const handleSelect = (city: City) => {
    setQuery(`${city.name}, ${city.country}`);
    setShowDropdown(false);
    onSearch(city.name, city.lat, city.lon);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    fetchCities.cancel();
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              color: 'var(--text-dim)',
            }}
          />
          <input
            ref={inputRef}
            className="search-field"
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={handleInput}
            onFocus={() => query.length > 1 && setShowDropdown(true)}
            autoComplete="off"
          />

          <div
            style={{
              position: 'absolute',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {query && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-dim)',
                }}
              >
                <X size={16} />
              </button>
            )}

            <div
              style={{
                width: '1px',
                height: '20px',
                background: 'var(--border-subtle)',
              }}
            />

            <button
              type="button"
              onClick={onLocate}
              title="Locate me"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <MapPin size={18} />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Modern Dropdown */}
      {showDropdown && results.length > 0 && (
        <div
          className="glass shadow-premium"
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            left: 0,
            right: 0,
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.95)',
            padding: '8px',
          }}
        >
          {results.map((city, i) => (
            <div
              key={i}
              onClick={() => handleSelect(city)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
              }}
              className="glass-hover"
            >
              <div
                className="glass"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                <MapPin size={14} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                  }}
                >
                  {city.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  {[city.state, city.country].filter(Boolean).join(', ')}
                </div>
              </div>
              <Search size={12} color="var(--text-dim)" opacity={0.5} />
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
