const RANKINGS_KEY = 'devt_snake_rankings';

const defaultRankings = [
  { name: 'DevMaster', score: 980, date: '2026-03-07' },
  { name: 'SnakeGod', score: 850, date: '2026-03-06' },
  { name: 'Pixel', score: 720, date: '2026-03-05' },
  { name: 'CodeWizard', score: 660, date: '2026-03-04' },
  { name: 'Trieu', score: 540, date: '2026-03-03' },
  { name: 'Gamer99', score: 400, date: '2026-03-02' },
  { name: 'NightOwl', score: 360, date: '2026-03-01' },
  { name: 'ByteRunner', score: 280, date: '2026-02-28' },
];

export function getRankings() {
  try {
    const stored = localStorage.getItem(RANKINGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { }
  return defaultRankings;
}

export function saveScore(name, score) {
  const rankings = getRankings();
  const newEntry = {
    name: name.trim() || 'Anonymous',
    score,
    date: new Date().toISOString().split('T')[0],
  };
  const updated = [...rankings, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
  localStorage.setItem(RANKINGS_KEY, JSON.stringify(updated));
  return updated;
}
