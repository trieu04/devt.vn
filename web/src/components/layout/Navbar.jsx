import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Code2, Music, Gamepad2, BookOpen, Wrench } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/', icon: null },
  { label: 'Music', path: '/music', icon: Music },
  { label: 'Games', path: '/games', icon: Gamepad2 },
  { label: 'Blog', path: '/blog', icon: BookOpen },
  { label: 'Tools', path: '/tools', icon: Wrench },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s',
        ...(scrolled ? {
          background: 'rgba(5, 8, 22, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 245, 255, 0.08)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        } : {
          background: 'transparent',
        }),
      }}
    >
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span className="logo-glitch" style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '1.4rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.04em',
            position: 'relative',
            textShadow: '0 0 20px rgba(0, 245, 255, 0.4)',
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>devt</span>
            <span style={{ color: 'var(--accent-cyan)' }}>.vn</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(0, 245, 255, 0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(0, 245, 255, 0.2)' : '1px solid transparent',
              })}
            >
              {Icon && <Icon size={14} />}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="show-mobile"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 6,
          }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          background: 'rgba(5, 8, 22, 0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-glass)',
          padding: '1rem 1.5rem 1.5rem',
        }}>
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                borderRadius: 8,
                fontSize: '1rem',
                fontWeight: 500,
                textDecoration: 'none',
                marginBottom: 4,
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(0, 245, 255, 0.08)' : 'transparent',
              })}
            >
              {Icon && <Icon size={16} />}
              {label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </header>
  );
}
