'use client';

import { Star, MapPin, Clock, Trash2 } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            <Star size={14} style={{ color: 'var(--accent-orange)' }} />
            <p className="section-title" style={{ marginBottom: 0 }}>
              Favorites
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {favorites.map((f) => (
              <div
                key={f.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(249,115,22,0.06)',
                  border: '1px solid rgba(249,115,22,0.15)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() =>
                  onSelect(f.city, f.lat ?? undefined, f.lon ?? undefined)
                }
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(249,115,22,0.12)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'rgba(249,115,22,0.06)')
                }
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <MapPin size={14} style={{ color: 'var(--accent-orange)' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                      {f.city}
                    </div>
                    {f.country && (
                      <div
                        style={{ fontSize: '11px', color: 'var(--text-muted)' }}
                      >
                        {f.country}
                      </div>
                    )}
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
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: '4px',
                    display: 'flex',
                  }}
                  title="Remove favorite"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} style={{ color: 'var(--text-muted)' }} />
              <p className="section-title" style={{ marginBottom: 0 }}>
                Recent
              </p>
            </div>
            {onClearHistory && (
              <button
                onClick={onClearHistory}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                }}
                title="Clear History"
              >
                Clear All
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {history.slice(0, 6).map((h) => (
              <div
                key={h.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                }}
                onClick={() =>
                  onSelect(h.city, h.lat ?? undefined, h.lon ?? undefined)
                }
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                <Clock
                  size={12}
                  style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                />
                <span>
                  {h.city}
                  {h.country ? `, ${h.country}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
