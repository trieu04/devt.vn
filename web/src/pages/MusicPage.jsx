import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music2, Disc3 } from 'lucide-react';
import { playlist } from '../data/music.js';

const genreColors = { Lofi: '#00f5ff', Synthwave: '#a78bfa', Ambient: '#10b981', Jazz: '#f59e0b', Electronic: '#ec4899' };

export default function MusicPage() {
  const [current, setCurrent] = useState(null);

  return (
    <div className="section-padding" style={{ paddingTop: 96 }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem' }}>
            <div style={{ width: 32, height: 2, background: 'var(--accent-cyan)' }} />
            <span className="tag">Music</span>
          </div>
          <h1 className="section-title">Playlist</h1>
          <p className="section-subtitle">Background tracks for focus, chill, and creativity. Use the floating player <span style={{ color: 'var(--accent-cyan)' }}>↘</span> to control playback.</p>
        </div>

        {/* Playlist grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {playlist.map((track, i) => {
            const color = genreColors[track.genre] || 'var(--accent-cyan)';
            const isActive = current === i;
            return (
              <div
                key={track.id}
                onClick={() => setCurrent(i)}
                className="glass glass-hover"
                style={{
                  padding: '1.5rem',
                  borderRadius: 14,
                  border: `1px solid ${isActive ? color + '40' : 'var(--border-glass)'}`,
                  boxShadow: isActive ? `0 0 20px ${color}20` : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Ambient glow */}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: -20, right: -20, width: 100, height: 100,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
                  {/* Album art */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 10, flexShrink: 0,
                    background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                    border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: isActive ? 'spin-slow 4s linear infinite' : 'none',
                  }}>
                    <Disc3 size={24} style={{ color }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: isActive ? color : 'var(--text-primary)', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.artist}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <span className="tag" style={{ color, borderColor: `${color}30`, fontSize: '0.7rem' }}>{track.genre}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{track.duration}</span>
                    </div>
                  </div>

                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: isActive ? color : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    <Music2 size={14} style={{ color: isActive ? '#000' : 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <p>🎵 Use the floating player in the bottom-right corner to control music playback</p>
        </div>
      </div>
    </div>
  );
}
