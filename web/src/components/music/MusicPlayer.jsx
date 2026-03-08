import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Music, ChevronUp, ChevronDown, List, X
} from 'lucide-react';
import { playlist } from '../../data/music.js';

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const soundRef = useRef(null);
  const animRef = useRef(null);
  const track = playlist[currentIndex];

  const stopCurrent = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
      soundRef.current = null;
    }
    cancelAnimationFrame(animRef.current);
    setProgress(0);
  }, []);

  const loadTrack = useCallback((index, autoPlay = false) => {
    stopCurrent();
    const t = playlist[index];
    const sound = new Howl({
      src: [t.url],
      html5: true,
      volume: volume,
      onend: () => {
        setCurrentIndex(i => (i + 1) % playlist.length);
      },
      onplay: () => {
        setIsPlaying(true);
        const tick = () => {
          if (sound.playing()) {
            const dur = sound.duration();
            const seek = sound.seek();
            setProgress(dur > 0 ? (seek / dur) * 100 : 0);
            animRef.current = requestAnimationFrame(tick);
          }
        };
        tick();
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
    });
    soundRef.current = sound;
    if (autoPlay) sound.play();
  }, [stopCurrent, volume]);

  useEffect(() => {
    loadTrack(currentIndex, isPlaying);
    return () => stopCurrent();
  }, [currentIndex]);

  useEffect(() => {
    if (soundRef.current) soundRef.current.volume(muted ? 0 : volume);
  }, [volume, muted]);

  const togglePlay = () => {
    if (!soundRef.current) { loadTrack(currentIndex, true); return; }
    if (soundRef.current.playing()) soundRef.current.pause();
    else soundRef.current.play();
  };

  const prev = () => setCurrentIndex(i => (i - 1 + playlist.length) % playlist.length);
  const next = () => setCurrentIndex(i => (i + 1) % playlist.length);

  const seek = (e) => {
    if (!soundRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    soundRef.current.seek(soundRef.current.duration() * ratio);
    setProgress(ratio * 100);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8,
    }}>
      {/* Playlist drawer */}
      {showPlaylist && expanded && (
        <div style={{
          width: 280,
          background: 'rgba(5, 8, 22, 0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-glass)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>PLAYLIST</span>
            <button onClick={() => setShowPlaylist(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {playlist.map((t, i) => (
              <div
                key={t.id}
                onClick={() => { setCurrentIndex(i); setIsPlaying(true); }}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: i === currentIndex ? 'rgba(0, 245, 255, 0.08)' : 'transparent',
                  borderLeft: i === currentIndex ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (i !== currentIndex) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (i !== currentIndex) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: 16, textAlign: 'center' }}>
                  {i === currentIndex && isPlaying ? '♪' : i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.85rem', color: i === currentIndex ? 'var(--accent-cyan)' : 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.artist}</p>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Player card */}
      <div style={{
        background: 'rgba(5, 8, 22, 0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 245, 255, 0.15)',
        borderRadius: 14,
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(0, 245, 255, 0.05)',
        overflow: 'hidden',
        width: expanded ? 280 : 56,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {expanded ? (
          /* Expanded player */
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: isPlaying ? 'spin-slow 4s linear infinite' : 'none',
                }}>
                  <Music size={13} style={{ color: '#fff' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{track.title}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>{track.artist}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setShowPlaylist(p => !p)} style={{ background: 'none', border: 'none', color: showPlaylist ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 4 }}>
                  <List size={14} />
                </button>
                <button onClick={() => setExpanded(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 4 }}>
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div
              onClick={seek}
              style={{
                height: 4, borderRadius: 2,
                background: 'rgba(255,255,255,0.08)',
                cursor: 'pointer',
                marginBottom: 10,
                position: 'relative',
              }}
            >
              <div style={{ height: '100%', width: `${progress}%`, borderRadius: 2, background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-violet))', transition: 'width 0.1s' }} />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={prev} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}>
                <SkipBack size={16} />
              </button>
              <button
                onClick={togglePlay}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(0, 245, 255, 0.3)',
                }}
              >
                {isPlaying ? <Pause size={15} style={{ color: '#fff' }} /> : <Play size={15} style={{ color: '#fff', marginLeft: 2 }} />}
              </button>
              <button onClick={next} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}>
                <SkipForward size={16} />
              </button>

              {/* Volume */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button onClick={() => setMuted(m => !m)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}>
                  {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>
                <input
                  type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
                  onChange={e => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                  style={{ width: 50, accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Mini icon */
          <button
            onClick={() => setExpanded(true)}
            style={{
              width: 56, height: 56,
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: isPlaying ? 'spin-slow 4s linear infinite' : 'none',
              boxShadow: isPlaying ? '0 0 15px rgba(0, 245, 255, 0.5)' : 'none',
            }}>
              <Music size={16} style={{ color: '#fff' }} />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
