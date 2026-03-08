import { useState } from 'react';
import SnakeGame from '../components/games/SnakeGame.jsx';
import Leaderboard from '../components/games/Leaderboard.jsx';
import { Gamepad2, Trophy, Zap } from 'lucide-react';

export default function GamesPage() {
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  const handleScoreUpdate = () => setLeaderboardKey(k => k + 1);

  return (
    <div className="section-padding" style={{ paddingTop: 96 }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem' }}>
            <div style={{ width: 32, height: 2, background: 'var(--accent-violet)' }} />
            <span className="tag" style={{ color: '#a78bfa', borderColor: 'rgba(124,58,237,0.3)' }}>Games</span>
          </div>
          <h1 className="section-title">
            <Gamepad2 size={30} style={{ display: 'inline', color: 'var(--accent-violet)', marginRight: 12 }} />
            Game Zone
          </h1>
          <p className="section-subtitle">Take a break. Play some games. Compete for the top spot.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '3rem',
          alignItems: 'start',
        }}>
          {/* Game */}
          <div>
            <div style={{
              marginBottom: '1.25rem',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                padding: '6px 14px', borderRadius: 8,
                background: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Zap size={14} style={{ color: 'var(--accent-violet)' }} />
                <span style={{ color: '#a78bfa', fontWeight: 600, fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>SNAKE</span>
              </div>
            </div>
            <SnakeGame onScoreUpdate={handleScoreUpdate} />
          </div>

          {/* Leaderboard */}
          <div>
            <div style={{
              marginBottom: '1.25rem',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Trophy size={18} style={{ color: '#f59e0b' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>Rankings</span>
            </div>
            <Leaderboard key={leaderboardKey} refresh={leaderboardKey} />
          </div>
        </div>

        {/* Responsive fix */}
        <style>{`
          @media (max-width: 900px) {
            .games-layout { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
