import { useState, useEffect } from 'react';
import { ArrowRight, Github, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile.js';

const roles = profile.roles;

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [typing, setTyping] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  useEffect(() => {
    const role = roles[roleIndex];
    let timeout;
    if (typing) {
      if (displayText.length < role.length) {
        timeout = setTimeout(() => setDisplayText(role.slice(0, displayText.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 40);
      } else {
        setRoleIndex(i => (i + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, typing, roleIndex]);

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 80,
    }}>
      {/* Animated background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* Grid */}
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
        {/* Gradient orbs */}
        <div style={{
          position: 'absolute', top: '10%', right: '10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '40%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
      </div>

      <div className="page-container" style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem' }}>
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* Badge */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="tag" style={{ fontSize: '0.78rem' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse-glow 2s infinite' }} />
              &nbsp;Available for hire
            </span>
          </div>

          {/* Greeting */}
          <p style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 500 }}>
            &gt; Hello, World! 👋
          </p>

          {/* Name */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: '1rem',
          }}>
            I'm{' '}
            <span className="text-gradient-full">{profile.name}</span>
          </h1>

          {/* Typewriter */}
          <div style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)',
            minHeight: '2rem',
          }}>
            <span>{displayText}</span>
            <span className="cursor-blink" style={{ color: 'var(--accent-cyan)', marginLeft: 2 }}>▌</span>
          </div>

          {/* Bio */}
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            maxWidth: 560,
            marginBottom: '2.5rem',
          }}>
            {profile.bio}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '3rem' }}>
            <Link to="/blog" className="btn btn-primary">
              Read Blog <ArrowRight size={16} />
            </Link>
            <Link to="/tools" className="btn btn-secondary">
              Try Tools <ExternalLink size={16} />
            </Link>
            <a href={`mailto:${profile.email}`} className="btn btn-ghost">
              <Mail size={16} /> Contact
            </a>
          </div>

          {/* Social */}
          {profile.social.github && (
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Github size={18} />
              <span>github</span>
            </a>
          )}
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: 'var(--text-muted)', fontSize: '0.75rem', animation: 'float 2s ease-in-out infinite',
        }}>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(0, 245, 255, 0.5))' }} />
          <span style={{ letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>SCROLL</span>
        </div>
      </div>
    </section>
  );
}
