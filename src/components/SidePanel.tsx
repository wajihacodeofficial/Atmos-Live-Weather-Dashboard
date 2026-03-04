'use client';

import { Star, MapPin, Clock, Trash2, ChevronRight } from 'lucide-react';

interface City {
  id: number;
  city: string;
  country?: string | null;
  lat?: number | null;
  lon?: number | null;
  createdAt: string;
}

interface SidePanelProps {
  favorites: City[];
  history: City[];
  onSelect: (city: string, lat?: number, lon?: number) => void;
  onRemoveFavorite: (id: number) => void;
  onClearHistory?: () => void;
}

export default function SidePanel({
  favorites,
  history,
  onSelect,
  onRemoveFavorite,
  onClearHistory,
}: SidePanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="glass card-premium" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.5rem',
            }}
          >
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <h4
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-sub)',
              }}
            >
              Pinned Locations
            </h4>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {favorites.map((f) => (
              <div
                key={f.id}
                className="glass glass-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.03)',
                }}
                onClick={() =>
                  onSelect(f.city, f.lat ?? undefined, f.lon ?? undefined)
                }
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div
                    className="glass"
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '8px',
                    }}
                  >
                    <MapPin size={14} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>
                      {f.city}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {f.country}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(f.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="glass card-premium" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} color="var(--text-dim)" />
              <h4
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-sub)',
                }}
              >
                Recently Viewed
              </h4>
            </div>
            {onClearHistory && (
              <button
                onClick={onClearHistory}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {history.slice(0, 5).map((h) => (
              <div
                key={h.id}
                className="glass-hover"
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--text-sub)',
                }}
                onClick={() =>
                  onSelect(h.city, h.lat ?? undefined, h.lon ?? undefined)
                }
              >
                <span>
                  {h.city}, {h.country}
                </span>
                <ChevronRight size={14} opacity={0.3} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
