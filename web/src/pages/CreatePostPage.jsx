import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPost } from '../data/posts.js';
import { ArrowLeft, Eye, Edit3, Send } from 'lucide-react';

function SimpleMarkdownPreview({ content }) {
  const lines = content.split('\n');
  return (
    <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, minHeight: 200 }}>
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '1rem 0 0.5rem' }}>{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: '1rem 0 0.4rem' }}>{line.slice(3)}</h2>;
        if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.3rem' }}>{line.slice(2)}</li>;
        if (line.trim() === '') return <br key={i} />;
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} style={{ marginBottom: '0.5rem' }}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: 'var(--text-primary)' }}>{p}</strong> : p)}
          </p>
        );
      })}
    </div>
  );
}

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({ title: '', tags: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    setSubmitting(true);
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    addPost({ title: form.title, tags, content: form.content, excerpt: form.content.slice(0, 120) + '...' });
    setTimeout(() => navigate('/blog'), 500);
  };

  return (
    <div className="section-padding" style={{ paddingTop: 96 }}>
      <div className="page-container" style={{ maxWidth: 780 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost"
            style={{ display: 'inline-flex' }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setPreview(false)}
              style={{
                padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                background: !preview ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
                border: `1px solid ${!preview ? 'rgba(0, 245, 255, 0.3)' : 'var(--border-glass)'}`,
                color: !preview ? 'var(--accent-cyan)' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 500,
              }}
            ><Edit3 size={14} /> Write</button>
            <button
              onClick={() => setPreview(true)}
              style={{
                padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                background: preview ? 'rgba(0, 245, 255, 0.1)' : 'transparent',
                border: `1px solid ${preview ? 'rgba(0, 245, 255, 0.3)' : 'var(--border-glass)'}`,
                color: preview ? 'var(--accent-cyan)' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 500,
              }}
            ><Eye size={14} /> Preview</button>
          </div>
        </div>

        <h1 className="section-title" style={{ marginBottom: '2rem' }}>
          <Edit3 size={26} style={{ display: 'inline', marginRight: 10, color: 'var(--accent-cyan)' }} />
          New Post
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
              TITLE *
            </label>
            <input
              className="input-field"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Post title..."
              required
              style={{ fontSize: '1.1rem' }}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
              TAGS (comma separated)
            </label>
            <input
              className="input-field"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="React, Vite, JavaScript"
            />
          </div>

          {/* Content */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
              CONTENT * (Markdown supported)
            </label>
            {preview ? (
              <div
                className="glass"
                style={{ padding: '1.5rem', borderRadius: 8, minHeight: 320, border: '1px solid var(--border-glass)' }}
              >
                {form.content ? <SimpleMarkdownPreview content={form.content} /> : (
                  <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>Nothing to preview yet...</p>
                )}
              </div>
            ) : (
              <textarea
                className="input-field"
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="# Title&#10;&#10;Your story here...&#10;&#10;Use **bold**, ## heading, - list"
                required
                style={{ minHeight: 320, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', resize: 'vertical' }}
              />
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Publishing...' : <><Send size={15} /> Publish Post</>}
          </button>
        </form>
      </div>
    </div>
  );
}
