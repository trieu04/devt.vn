import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, RefreshCw } from 'lucide-react';
import { getRankings } from '../../data/rankings.js';

const medalColors = ['#f59e0b', '#94a3b8', '#cd7f32'];
const medalIcons = [Trophy, Medal, Star];

export default function Leaderboard({ refresh }) {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    setRankings(getRankings());
  }, [refresh]);

  const handleRefresh = () => setRankings(getRankings());

  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Leaderboard</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>Top Snake Players</p>
        </div>
        <button
          onClick={handleRefresh}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, borderRadius: 6, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rankings.slice(0, 10).map((entry, i) => {
          const IconComp = i < 3 ? medalIcons[i] : null;
          const medalColor = medalColors[i] || 'var(--text-muted)';
          const isTopThree = i < 3;

          return (
            <div
              key={i}
              className="glass"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                border: isTopThree ? `1px solid ${medalColor}30` : '1px solid var(--border-glass)',
                background: isTopThree ? `${medalColor}08` : 'var(--bg-card)',
                transition: 'all 0.2s',
              }}
            >
              {/* Rank */}
              <div style={{ width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {IconComp ? (
                  <IconComp size={18} style={{ color: medalColor }} />
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    #{i + 1}
                  </span>
                )}
              </div>

              {/* Avatar placeholder */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `linear-gradient(135deg, ${isTopThree ? medalColor : 'var(--accent-violet)'}, var(--accent-cyan))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, color: '#000',
                flexShrink: 0,
              }}>
                {entry.name.charAt(0).toUpperCase()}
              </div>

              {/* Name & date */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: isTopThree ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {entry.name}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{entry.date}</p>
              </div>

              {/* Score */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem',
                color: isTopThree ? medalColor : 'var(--accent-cyan)',
                textShadow: isTopThree ? `0 0 10px ${medalColor}60` : '0 0 10px rgba(0, 245, 255, 0.4)',
              }}>
                {entry.score}
              </div>
            </div>
          );
        })}

        {rankings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            No scores yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
}
