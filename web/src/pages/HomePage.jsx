import Hero from '../components/sections/Hero.jsx';
import About from '../components/sections/About.jsx';
import Skills from '../components/sections/Skills.jsx';
import { Link } from 'react-router-dom';
import { Music, Gamepad2, Wrench, BookOpen, ArrowRight } from 'lucide-react';

const quickLinks = [
  { label: 'Music', path: '/music', icon: Music, desc: 'Listen to my playlist', color: '#00f5ff' },
  { label: 'Games', path: '/games', icon: Gamepad2, desc: 'Play Snake & more', color: '#a78bfa' },
  { label: 'Blog', path: '/blog', icon: BookOpen, desc: 'Read my articles', color: '#10b981' },
  { label: 'Tools', path: '/tools', icon: Wrench, desc: 'Web dev tools', color: '#f59e0b' },
];

export default function HomePage() {
  return (
    <div>
      <Hero />
      <About />
      <Skills />

      {/* Quick links section */}
      <section className="section-padding" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title text-gradient-full">Explore More</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>More than just a portfolio</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
          }}>
            {quickLinks.map(({ label, path, icon: Icon, desc, color }) => (
              <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                <div
                  className="glass glass-hover"
                  style={{
                    padding: '1.75rem 1.5rem',
                    borderRadius: 14,
                    border: `1px solid ${color}20`,
                    display: 'flex', flexDirection: 'column', gap: 12,
                    transition: 'all 0.3s',
                    height: '100%',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${color}50`;
                    e.currentTarget.style.boxShadow = `0 8px 30px ${color}18`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = `${color}20`;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${color}15`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{desc}</p>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, color, fontSize: '0.82rem', fontWeight: 600 }}>
                    Go <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
