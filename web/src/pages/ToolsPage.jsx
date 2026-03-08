import { useState } from 'react';
import { tools } from '../data/tools.js';
import { Wrench, X } from 'lucide-react';

// Tool implementations
function Base64Tool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('encode');
  const [result, setResult] = useState('');
  const [err, setErr] = useState('');
  const run = () => {
    try {
      setErr('');
      if (mode === 'encode') setResult(btoa(unescape(encodeURIComponent(text))));
      else setResult(decodeURIComponent(escape(atob(text))));
    } catch { setErr('Invalid input'); setResult(''); }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {['encode', 'decode'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ padding: '5px 14px', borderRadius: 6, cursor: 'pointer', background: mode === m ? 'rgba(0,245,255,0.1)' : 'transparent', border: `1px solid ${mode === m ? 'rgba(0,245,255,0.4)' : 'var(--border-glass)'}`, color: mode === m ? 'var(--accent-cyan)' : 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'capitalize' }}>{m}</button>
        ))}
      </div>
      <textarea className="input-field" value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." style={{ minHeight: 80, fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }} />
      <button className="btn btn-primary" onClick={run}>Convert</button>
      {err && <p style={{ color: 'var(--accent-pink)', fontSize: '0.85rem' }}>{err}</p>}
      {result && <textarea readOnly className="input-field" value={result} style={{ minHeight: 80, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(0,245,255,0.04)' }} onClick={e => e.target.select()} />}
    </div>
  );
}

function ColorTool() {
  const [hex, setHex] = useState('#00f5ff');
  const hexToRgb = (h) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? `rgb(${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)})` : ''; };
  const hexToHsl = (h) => {
    let r = parseInt(h.slice(1, 3), 16) / 255, g = parseInt(h.slice(3, 5), 16) / 255, b = parseInt(h.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b); let hue, s, l = (max + min) / 2;
    if (max === min) { hue = s = 0; } else { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break; case g: hue = ((b - r) / d + 2) / 6; break; default: hue = ((r - g) / d + 4) / 6; } }
    return `hsl(${Math.round(hue * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ width: '100%', height: 80, borderRadius: 10, background: hex, border: '1px solid var(--border-glass)' }} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} style={{ width: 50, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'none' }} />
        <input className="input-field" value={hex} onChange={e => setHex(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', flex: 1 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {['HEX', 'RGB', 'HSL'].slice(0, 2).map((label, i) => (
          <div key={label} className="glass" style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer' }} onClick={() => navigator.clipboard?.writeText(i === 0 ? hex : hexToRgb(hex))}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{label}</p>
            <p style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>{i === 0 ? hex : hexToRgb(hex)}</p>
          </div>
        ))}
      </div>
      <div className="glass" style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer' }} onClick={() => navigator.clipboard?.writeText(hexToHsl(hex))}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>HSL</p>
        <p style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600 }}>{hexToHsl(hex)}</p>
      </div>
    </div>
  );
}

function TimerTool() {
  const [sec, setSec] = useState(60);
  const [left, setLeft] = useState(null);
  const [running, setRunning] = useState(false);
  const ref = useState(null);
  const start = () => { setLeft(sec); setRunning(true); };
  const reset = () => { setRunning(false); setLeft(null); clearInterval(ref[0]); };
  useState(() => {
    if (!running || left === null) return;
    const id = setInterval(() => setLeft(l => { if (l <= 1) { clearInterval(id); setRunning(false); return 0; } return l - 1; }), 1000);
    return () => clearInterval(id);
  });
  const display = left !== null ? left : sec;
  const pct = left !== null ? (left / sec) * 100 : 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="70" cy="70" r="60" fill="none" stroke="var(--accent-cyan)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 60}`} strokeDashoffset={`${2 * Math.PI * 60 * (1 - pct / 100)}`}
            style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 1s linear', filter: 'drop-shadow(0 0 8px var(--accent-cyan))' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: left === 0 ? 'var(--accent-pink)' : 'var(--accent-cyan)' }}>
          {display}s
        </div>
      </div>
      <input className="input-field" type="number" value={sec} onChange={e => setSec(Number(e.target.value))} min={1} max={3600} style={{ width: 120, textAlign: 'center', fontFamily: 'var(--font-mono)' }} disabled={running} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary" onClick={start} disabled={running}>▶ Start</button>
        <button className="btn btn-ghost" onClick={reset}>↺ Reset</button>
      </div>
      {left === 0 && <p style={{ color: 'var(--accent-pink)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>⏰ Time's up!</p>}
    </div>
  );
}

function LoremTool() {
  const base = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ';
  const [count, setCount] = useState(1);
  const [type, setType] = useState('paragraphs');
  const gen = () => {
    if (type === 'paragraphs') return Array(count).fill(base.repeat(3).trim()).join('\n\n');
    const words = base.split(' ').filter(Boolean);
    return Array(count).fill(null).map((_, i) => words[i % words.length]).join(' ');
  };
  const [result, setResult] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['paragraphs', 'words'].map(t => (
          <button key={t} onClick={() => setType(t)} style={{ padding: '5px 14px', borderRadius: 6, cursor: 'pointer', background: type === t ? 'rgba(0,245,255,0.1)' : 'transparent', border: `1px solid ${type === t ? 'rgba(0,245,255,0.4)' : 'var(--border-glass)'}`, color: type === t ? 'var(--accent-cyan)' : 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'capitalize' }}>{t}</button>
        ))}
        <input type="number" min={1} max={10} value={count} onChange={e => setCount(Number(e.target.value))} className="input-field" style={{ width: 70, textAlign: 'center' }} />
      </div>
      <button className="btn btn-primary" onClick={() => setResult(gen())}>Generate</button>
      {result && <textarea readOnly className="input-field" value={result} style={{ minHeight: 120, fontSize: '0.85rem', resize: 'vertical' }} onClick={e => e.target.select()} />}
    </div>
  );
}

function JsonTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [err, setErr] = useState('');
  const format = () => {
    try { setErr(''); setOutput(JSON.stringify(JSON.parse(input), null, 2)); }
    catch (e) { setErr(e.message); setOutput(''); }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <textarea className="input-field" value={input} onChange={e => setInput(e.target.value)} placeholder='{"key": "value"}' style={{ minHeight: 100, fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }} />
      <button className="btn btn-primary" onClick={format}>Format JSON</button>
      {err && <p style={{ color: 'var(--accent-pink)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>❌ {err}</p>}
      {output && <textarea readOnly className="input-field" value={output} style={{ minHeight: 140, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(16,185,129,0.04)', borderColor: 'rgba(16,185,129,0.2)' }} onClick={e => e.target.select()} />}
    </div>
  );
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function HashTool() {
  const [text, setText] = useState('');
  const [hash, setHash] = useState('');
  const run = async () => { setHash(await sha256(text)); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input className="input-field" value={text} onChange={e => setText(e.target.value)} placeholder="Enter text to hash..." />
      <button className="btn btn-primary" onClick={run}>Generate SHA-256</button>
      {hash && <div className="glass" style={{ padding: '12px', borderRadius: 8, wordBreak: 'break-all', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)', cursor: 'pointer' }} onClick={() => navigator.clipboard?.writeText(hash)}>{hash}</div>}
    </div>
  );
}

function DiffTool() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const diff = () => {
    const la = a.split('\n'), lb = b.split('\n');
    const max = Math.max(la.length, lb.length);
    return Array(max).fill(null).map((_, i) => ({
      left: la[i] ?? null, right: lb[i] ?? null,
      same: la[i] === lb[i],
    }));
  };
  const [shown, setShown] = useState(false);
  const result = diff();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <textarea className="input-field" value={a} onChange={e => setA(e.target.value)} placeholder="Original text..." style={{ minHeight: 100, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
        <textarea className="input-field" value={b} onChange={e => setB(e.target.value)} placeholder="Modified text..." style={{ minHeight: 100, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} />
      </div>
      <button className="btn btn-primary" onClick={() => setShown(true)}>Compare</button>
      {shown && (
        <div className="glass" style={{ padding: '12px', borderRadius: 8, maxHeight: 200, overflowY: 'auto' }}>
          {result.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 2 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '2px 6px', borderRadius: 4, background: row.same ? 'transparent' : 'rgba(236,72,153,0.1)', color: row.same ? 'var(--text-muted)' : 'var(--accent-pink)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{row.left ?? ''}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', padding: '2px 6px', borderRadius: 4, background: row.same ? 'transparent' : 'rgba(16,185,129,0.1)', color: row.same ? 'var(--text-muted)' : '#10b981', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{row.right ?? ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QrTool() {
  const [text, setText] = useState('https://devt.vn');
  const size = 200;
  const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}&color=00f5ff&bgcolor=050816` : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <input className="input-field" value={text} onChange={e => setText(e.target.value)} placeholder="URL or text..." style={{ width: '100%' }} />
      {qrUrl && <img src={qrUrl} alt="QR Code" style={{ width: size, height: size, borderRadius: 8, border: '1px solid var(--border-glass)' }} />}
    </div>
  );
}

const toolComponents = { base64: Base64Tool, color: ColorTool, timer: TimerTool, lorem: LoremTool, json: JsonTool, hash: HashTool, diff: DiffTool, qr: QrTool };

export default function ToolsPage() {
  const [active, setActive] = useState(null);
  const ToolComponent = active ? toolComponents[active.id] : null;

  return (
    <div className="section-padding" style={{ paddingTop: 96 }}>
      <div className="page-container">
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem' }}>
            <div style={{ width: 32, height: 2, background: '#f59e0b' }} />
            <span className="tag" style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}>Tools</span>
          </div>
          <h1 className="section-title">Web Tools</h1>
          <p className="section-subtitle">Handy utilities for developers. Click a tool to open.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: active ? '2.5rem' : 0 }}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActive(active?.id === tool.id ? null : tool)}
              style={{
                textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', padding: 0,
              }}
            >
              <div
                className="glass glass-hover"
                style={{
                  padding: '1.5rem 1.25rem',
                  borderRadius: 14,
                  border: `1px solid ${active?.id === tool.id ? 'rgba(245,158,11,0.4)' : 'var(--border-glass)'}`,
                  background: active?.id === tool.id ? 'rgba(245,158,11,0.06)' : 'var(--bg-card)',
                  transition: 'all 0.3s',
                  height: '100%',
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{tool.icon}</div>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: 6 }}>{tool.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>{tool.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
                  {tool.tags.map(t => (
                    <span key={t} className="tag" style={{ fontSize: '0.68rem', color: '#f59e0b', borderColor: 'rgba(245,158,11,0.25)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tool panel */}
        {active && ToolComponent && (
          <div
            className="glass"
            style={{
              padding: '2rem',
              borderRadius: 16,
              border: '1px solid rgba(245, 158, 11, 0.2)',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.4rem' }}>{active.icon}</span>
                <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{active.name}</h2>
              </div>
              <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, borderRadius: 6, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <X size={16} />
              </button>
            </div>
            <ToolComponent />
          </div>
        )}
      </div>
    </div>
  );
}
