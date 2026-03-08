import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById } from '../data/posts.js';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';

function SimpleMarkdown({ content }) {
  const lines = content.split('\n');
  return (
    <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.025rem' }}>
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '1.5rem 0 0.75rem', letterSpacing: '-0.02em' }}>{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: '1.5rem 0 0.5rem' }}>{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', margin: '1.2rem 0 0.4rem' }}>{line.slice(4)}</h3>;
        if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.4rem' }}>{line.slice(2)}</li>;
        if (line.startsWith('```')) return <div key={i} style={{ height: line === '```' ? 0 : undefined }} />;
        if (line.trim() === '') return <br key={i} />;
        // Bold inline **text**
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} style={{ marginBottom: '0.75rem' }}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{p}</strong> : p)}
          </p>
        );
      })}
    </div>
  );
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = getPostById(id);

  if (!post) return (
    <div className="section-padding" style={{ paddingTop: 96, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Post not found.</p>
      <Link to="/blog" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>← Back to Blog</Link>
    </div>
  );

  const tagColors = { React: '#00f5ff', Vite: '#a78bfa', Design: '#ec4899', Linux: '#10b981', JavaScript: '#f59e0b', Default: '#94a3b8' };

  return (
    <div className="section-padding" style={{ paddingTop: 96 }}>
      <div className="page-container" style={{ maxWidth: 780 }}>
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost"
          style={{ marginBottom: '2.5rem', display: 'inline-flex' }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.25rem' }}>
          {post.tags.map(tag => {
            const color = tagColors[tag] || tagColors.Default;
            return (
              <span key={tag} style={{
                padding: '3px 10px', borderRadius: 999,
                background: `${color}12`, border: `1px solid ${color}30`,
                color, fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
              }}>{tag}</span>
            );
          })}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-glass)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <User size={13} /> {post.author}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={13} /> {post.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={13} /> {post.readTime}
          </span>
        </div>

        {/* Content */}
        <SimpleMarkdown content={post.content} />
      </div>
    </div>
  );
}
