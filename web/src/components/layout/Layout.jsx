import Navbar from './Navbar.jsx';
import { Code2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      borderTop: '1px solid var(--border-glass)',
      background: 'rgba(5, 8, 22, 0.8)',
      padding: '2.5rem 1.5rem',
      marginTop: 'auto',
    }}>
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="logo-glitch" style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.04em',
              position: 'relative',
              textShadow: '0 0 15px rgba(0, 245, 255, 0.3)',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #fff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>devt</span>
              <span style={{ color: 'var(--accent-cyan)' }}>.vn</span>
            </span>
          </Link>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
          Built with <Heart size={11} style={{ color: 'var(--accent-pink)' }} fill="currentColor" /> using React + Vite + Tailwind
        </p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['Home', '/'], ['Blog', '/blog'], ['Games', '/games'], ['Tools', '/tools']].map(([label, to]) => (
            <Link key={to} to={to} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent-cyan)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >{label}</Link>
          ))}
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>© {year} devt.vn — All rights reserved</p>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
