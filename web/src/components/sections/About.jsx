import { useState, useEffect, useRef } from 'react';
import { User, MapPin, Code2, Zap } from 'lucide-react';
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

const highlights = [
  { icon: Code2, label: 'Full-Stack', desc: 'React · Node · Postgres', color: '#00f5ff' },
  { icon: Zap, label: 'Fast Builder', desc: 'Ship features rapidly', color: '#f59e0b' },
  { icon: User, label: 'Team Player', desc: 'Collaborate & communicate', color: '#10b981' },
  { icon: MapPin, label: 'Vietnam', desc: profile.location, color: '#ec4899' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} id="about" className="section-padding" style={{ position: 'relative' }}>
      <div className="page-container">
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'none' : 'translateY(24px)',
          transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem' }}>
            <div style={{ width: 32, height: 2, background: 'var(--accent-cyan)' }} />
            <span className="tag">About Me</span>
          </div>
          <h2 className="section-title">Who Am I?</h2>
          <div className="divider" />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}>
            {/* Bio text */}
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {profile.bio}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8 }}>
                I care deeply about code quality, developer experience, and creating products that people love to use.
                Outside of work: gaming, music, and constantly learning new things.
              </p>
            </div>

            {/* Highlight cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {highlights.map(({ icon: Icon, label, desc, color }) => (
                <div
                  key={label}
                  className="glass glass-hover"
                  style={{
                    padding: '1.2rem',
                    borderRadius: 12,
                    transition: 'all 0.3s',
                    cursor: 'default',
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 10,
                  }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
