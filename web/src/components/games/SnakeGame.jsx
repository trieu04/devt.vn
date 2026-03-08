import { useState, useEffect, useRef, useCallback } from 'react';
import { saveScore } from '../../data/rankings.js';

const CELL = 20;
const COLS = 20;
const ROWS = 20;
const W = CELL * COLS;
const H = CELL * ROWS;

const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

function rand(max) { return Math.floor(Math.random() * max); }
function newFood(snake) {
  let food;
  do { food = { x: rand(COLS), y: rand(ROWS) }; }
  while (snake.some(s => s.x === food.x && s.y === food.y));
  return food;
}

const SPEEDS = { Easy: 150, Normal: 100, Hard: 60 };

export default function SnakeGame({ onScoreUpdate }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const loopRef = useRef(null);
  const lastRef = useRef(0);

  const [status, setStatus] = useState('idle'); // idle | playing | paused | over
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('Normal');
  const [showSave, setShowSave] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);

  const initState = useCallback(() => ({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    score: 0,
  }), []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !stateRef.current) return;
    const ctx = canvas.getContext('2d');
    const { snake, food } = stateRef.current;

    // Background
    ctx.fillStyle = '#050816';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke();
    }

    // Food
    const fx = food.x * CELL + CELL / 2, fy = food.y * CELL + CELL / 2;
    const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, CELL / 2);
    grad.addColorStop(0, '#ff6b9d');
    grad.addColorStop(1, '#ec4899');
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 20;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(fx, fy, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((seg, i) => {
      const ratio = i / snake.length;
      const r = ctx.createLinearGradient(seg.x * CELL, seg.y * CELL, (seg.x + 1) * CELL, (seg.y + 1) * CELL);
      if (i === 0) {
        r.addColorStop(0, '#00f5ff');
        r.addColorStop(1, '#0ea5e9');
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 15;
      } else {
        const alpha = Math.max(0.3, 1 - ratio * 0.6);
        r.addColorStop(0, `rgba(124, 58, 237, ${alpha})`);
        r.addColorStop(1, `rgba(0, 245, 255, ${alpha * 0.6})`);
        ctx.shadowColor = '#7c3aed';
        ctx.shadowBlur = 8;
      }
      ctx.fillStyle = r;
      const padding = i === 0 ? 2 : 3;
      const radius = i === 0 ? 6 : 4;
      const x = seg.x * CELL + padding;
      const y = seg.y * CELL + padding;
      const size = CELL - padding * 2;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, radius);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const gameLoop = useCallback((ts) => {
    if (!stateRef.current) return;
    const interval = SPEEDS[difficulty];
    if (ts - lastRef.current >= interval) {
      lastRef.current = ts;
      const state = stateRef.current;
      state.dir = state.nextDir;
      const head = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y };

      // Walls
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
        setStatus('over');
        setScore(state.score);
        setShowSave(true);
        return;
      }
      // Self
      if (state.snake.some(s => s.x === head.x && s.y === head.y)) {
        setStatus('over');
        setScore(state.score);
        setShowSave(true);
        return;
      }

      state.snake = [head, ...state.snake];
      if (head.x === state.food.x && head.y === state.food.y) {
        state.score += 10 * (difficulty === 'Hard' ? 3 : difficulty === 'Normal' ? 2 : 1);
        state.food = newFood(state.snake);
        setScore(state.score);
      } else {
        state.snake.pop();
      }
    }
    draw();
    loopRef.current = requestAnimationFrame(gameLoop);
  }, [difficulty, draw]);

  const startGame = useCallback(() => {
    const state = initState();
    state.food = newFood(state.snake);
    stateRef.current = state;
    setScore(0);
    setStatus('playing');
    setSaved(false);
    setShowSave(false);
    setPlayerName('');
    lastRef.current = 0;
    loopRef.current = requestAnimationFrame(gameLoop);
  }, [initState, gameLoop]);

  const pauseGame = useCallback(() => {
    if (status === 'playing') {
      cancelAnimationFrame(loopRef.current);
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('playing');
      loopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [status, gameLoop]);

  useEffect(() => {
    const handleKey = (e) => {
      if (DIRS[e.key]) {
        e.preventDefault();
        const { x, y } = DIRS[e.key];
        const cur = stateRef.current?.dir;
        // Prevent 180
        if (cur && !(x === -cur.x && y === -cur.y)) {
          if (stateRef.current) stateRef.current.nextDir = { x, y };
        }
      }
      if (e.key === ' ') { e.preventDefault(); pauseGame(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pauseGame]);

  useEffect(() => {
    // Initial draw
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#050816';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke(); }

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 245, 255, 0.6)';
    ctx.font = 'bold 18px JetBrains Mono, monospace';
    ctx.fillText('Press START to play', W / 2, H / 2);

    return () => cancelAnimationFrame(loopRef.current);
  }, []);

  const handleSave = () => {
    const updated = saveScore(playerName || 'Anonymous', score);
    setSaved(true);
    setShowSave(false);
    if (onScoreUpdate) onScoreUpdate(updated);
  };

  // D-pad for mobile
  const DPad = () => {
    const press = (key) => {
      if (!stateRef.current) return;
      const d = DIRS[key];
      const cur = stateRef.current.dir;
      if (!(d.x === -cur.x && d.y === -cur.y)) stateRef.current.nextDir = d;
    };
    const btnStyle = (extra = {}) => ({
      width: 50, height: 50, borderRadius: 10,
      background: 'rgba(0, 245, 255, 0.08)',
      border: '1px solid rgba(0, 245, 255, 0.2)',
      color: 'var(--accent-cyan)', fontSize: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', userSelect: 'none',
      WebkitUserSelect: 'none',
      ...extra,
    });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 12 }}>
        <button style={btnStyle()} onTouchStart={() => press('ArrowUp')} onMouseDown={() => press('ArrowUp')}>↑</button>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={btnStyle()} onTouchStart={() => press('ArrowLeft')} onMouseDown={() => press('ArrowLeft')}>←</button>
          <div style={{ width: 50, height: 50 }} />
          <button style={btnStyle()} onTouchStart={() => press('ArrowRight')} onMouseDown={() => press('ArrowRight')}>→</button>
        </div>
        <button style={btnStyle()} onTouchStart={() => press('ArrowDown')} onMouseDown={() => press('ArrowDown')}>↓</button>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', display: 'block' }}>SCORE</span>
          <span style={{ color: 'var(--accent-cyan)', fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{score}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {status === 'idle' || status === 'over' ? (
            <>
              {['Easy', 'Normal', 'Hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                    background: difficulty === d ? 'rgba(0, 245, 255, 0.12)' : 'transparent',
                    border: `1px solid ${difficulty === d ? 'rgba(0, 245, 255, 0.4)' : 'var(--border-glass)'}`,
                    color: difficulty === d ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s',
                  }}
                >{d}</button>
              ))}
              <button className="btn btn-primary" onClick={startGame} style={{ padding: '6px 20px', fontSize: '0.9rem' }}>
                {status === 'over' ? '↺ Restart' : '▶ Start'}
              </button>
            </>
          ) : (
            <button className="btn btn-secondary" onClick={pauseGame}>
              {status === 'paused' ? '▶ Resume' : '⏸ Pause'}
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            display: 'block',
            borderRadius: 12,
            border: '1px solid rgba(0, 245, 255, 0.15)',
            boxShadow: '0 0 30px rgba(0, 245, 255, 0.1)',
            maxWidth: '100%',
          }}
        />

        {/* Overlay */}
        {(status === 'idle' || status === 'over' || status === 'paused') && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(5, 8, 22, 0.65)',
            backdropFilter: 'blur(4px)',
            borderRadius: 12,
          }}>
            {status === 'over' && (
              <>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-pink)', marginBottom: 4 }}>Game Over</p>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>Score: {score}</p>
                {showSave && !saved && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <input
                      className="input-field"
                      placeholder="Your name"
                      value={playerName}
                      onChange={e => setPlayerName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSave()}
                      style={{ width: 140, textAlign: 'center' }}
                    />
                    <button className="btn btn-primary" onClick={handleSave}>Save Score</button>
                  </div>
                )}
                {saved && <p style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>✓ Score saved!</p>}
              </>
            )}
            {status === 'paused' && (
              <p style={{ color: 'var(--accent-cyan)', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>PAUSED</p>
            )}
          </div>
        )}
      </div>

      {/* D-pad & hints */}
      <DPad />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
        Arrow keys / WASD to move · Space to pause
      </p>
    </div>
  );
}
