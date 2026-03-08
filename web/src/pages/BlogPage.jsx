import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../data/posts.js';
import { BookOpen, Plus, Clock, Tag, ArrowRight } from 'lucide-react';

const tagColors = {
  React: '#00f5ff', Vite: '#a78bfa', Design: '#ec4899',
  Linux: '#10b981', 'Dev Tools': '#f59e0b', Productivity: '#10b981',
  'Game Dev': '#a78bfa', Canvas: '#00f5ff', JavaScript: '#f59e0b',
  TypeScript: '#3b82f6', Node: '#10b981', Default: '#94a3b8',
};

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState('All');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const allTags = ['All', ...Array.from(new Set(posts.flatMap(p => p.tags)))];
  const filtered = selected === 'All' ? posts : posts.filter(p => p.tags.includes(selected));

  return (
    <div className="section-padding" style={{ paddingTop: 96 }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem' }}>
              <div style={{ width: 32, height: 2, background: '#10b981' }} />
              <span className="tag" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>Blog</span>
            </div>
            <h1 className="section-title">Articles</h1>
            <p className="section-subtitle" style={{ margin: 0 }}>Thoughts, experiments, and deep dives</p>
          </div>
          <Link to="/create-post" className="btn btn-primary">
            <Plus size={16} /> New Post
          </Link>
        </div>

        {/* Tag filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '2.5rem' }}>
          {allTags.map(tag => {
            const color = tagColors[tag] || tagColors.Default;
            const isActive = selected === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelected(tag)}
                style={{
                  padding: '5px 14px', borderRadius: 999, cursor: 'pointer',
                  background: isActive ? `${color}15` : 'transparent',
                  border: `1px solid ${isActive ? color + '40' : 'var(--border-glass)'}`,
                  color: isActive ? color : 'var(--text-muted)',
                  fontSize: '0.82rem', fontWeight: 500, transition: 'all 0.2s',
                }}
              >{tag}</button>
            );
          })}
        </div>

        {/* Posts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
              <article
                className="glass glass-hover"
                style={{
                  padding: '1.75rem',
                  borderRadius: 14,
                  border: '1px solid var(--border-glass)',
                  transition: 'all 0.3s',
                  height: '100%',
                  display: 'flex', flexDirection: 'column',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 245, 255, 0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
                  {post.tags.map(tag => {
                    const color = tagColors[tag] || tagColors.Default;
                    return (
                      <span key={tag} style={{
                        padding: '2px 8px', borderRadius: 999,
                        background: `${color}12`, border: `1px solid ${color}25`,
                        color, fontSize: '0.72rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
                      }}>{tag}</span>
                    );
                  })}
                </div>

                <h2 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '0.65rem', flex: 0 }}>{post.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>{post.excerpt}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{post.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {post.readTime}
                    </span>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--accent-cyan)' }} />
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}
