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
        <div className="search-container">
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search city, region..."
            value={query}
            onChange={handleInput}
            autoComplete="off"
            id="city-search-input"
          />
          {/* Icons inside input */}
          <div
            style={{
              position: 'absolute',
              right: '16px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                }}
              >
                <X size={16} />
              </button>
            )}
            {isLoading || searching ? (
              <Loader2
                size={18}
                style={{
                  color: 'var(--accent-blue)',
                  animation: 'spin 1s linear infinite',
                }}
              />
            ) : (
              <button
                type="submit"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                }}
              >
                <Search size={18} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Location button */}
      <button
        onClick={onLocate}
        title="Use my location"
        id="locate-btn"
        style={{
          position: 'absolute',
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '10px',
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--accent-blue)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'rgba(59,130,246,0.2)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = 'rgba(59,130,246,0.1)')
        }
      >
        <MapPin size={18} />
      </button>

      {/* Autocomplete */}
      {showDropdown && results.length > 0 && (
        <div className="autocomplete-list" style={{ left: 0, right: '60px' }}>
          {results.map((city, i) => (
            <div
              key={i}
              className="autocomplete-item"
              onClick={() => handleSelect(city)}
            >
              <MapPin
                size={16}
                style={{ color: 'var(--accent-blue)', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>
                  {city.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {[city.state, city.country].filter(Boolean).join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
