import { useState, useEffect, useRef } from 'react';
import { profile } from '../../data/profile.js';

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

const categoryColors = {
  frontend: { color: '#00f5ff', bg: 'rgba(0, 245, 255, 0.08)', border: 'rgba(0, 245, 255, 0.2)', label: '⚡ Frontend' },
  backend: { color: '#a78bfa', bg: 'rgba(124, 58, 237, 0.08)', border: 'rgba(124, 58, 237, 0.2)', label: '⚙️ Backend' },
  devops: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', label: '🚀 DevOps' },
  tools: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)', label: '🛠️ Tools' },
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [active, setActive] = useState('all');

  const categories = Object.keys(profile.skills);
  const allSkills = categories.flatMap(cat => profile.skills[cat].map(s => ({ name: s, category: cat })));
  const filtered = active === 'all' ? allSkills : allSkills.filter(s => s.category === active);

  return (
    <section ref={ref} id="skills" className="section-padding" style={{
      background: 'rgba(255,255,255,0.01)',
      borderTop: '1px solid var(--border-glass)',
      borderBottom: '1px solid var(--border-glass)',
    }}>
      <div className="page-container">
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'none' : 'translateY(24px)',
          transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem' }}>
            <div style={{ width: 32, height: 2, background: 'var(--accent-violet)' }} />
            <span className="tag" style={{ borderColor: 'rgba(124, 58, 237, 0.3)', color: '#a78bfa' }}>Skills</span>
          </div>
          <h2 className="section-title">Tech Stack</h2>
          <p className="section-subtitle">Technologies I work with daily</p>

          {/* Filter tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '2rem' }}>
            <button
              onClick={() => setActive('all')}
              style={{
                padding: '6px 16px', borderRadius: 999,
                background: active === 'all' ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
                border: `1px solid ${active === 'all' ? 'rgba(0, 245, 255, 0.4)' : 'var(--border-glass)'}`,
                color: active === 'all' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >All</button>
            {categories.map(cat => {
              const { color, border, label } = categoryColors[cat];
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  style={{
                    padding: '6px 16px', borderRadius: 999,
                    background: isActive ? `${color}15` : 'transparent',
                    border: `1px solid ${isActive ? border : 'var(--border-glass)'}`,
                    color: isActive ? color : 'var(--text-muted)',
                    fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >{label}</button>
              );
            })}
          </div>

          {/* Skills grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {filtered.map(({ name, category }, i) => {
              const { color, bg, border } = categoryColors[category];
              return (
                <div
                  key={`${category}-${name}`}
                  className="glass glass-hover"
                  style={{
                    padding: '8px 18px',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', gap: 8,
                    border: `1px solid ${border}`,
                    background: bg,
                    cursor: 'default',
                    transition: 'all 0.25s',
                    opacity: inView ? 1 : 0,
                    animation: inView ? `slide-up 0.4s ease-out ${i * 30}ms forwards` : 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `0 0 15px ${color}30`;
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
