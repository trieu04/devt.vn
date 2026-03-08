const POSTS_KEY = 'devt_posts';

const defaultPosts = [
  {
    id: 1,
    title: 'Building a Cyberpunk Landing Page with React & Tailwind',
    excerpt: 'How I designed and built devt.vn — a personal landing page with a dark neon aesthetic, music player, and mini games.',
    content: `# Building a Cyberpunk Landing Page

When I decided to build my personal site, I wanted something that felt alive — not just a static portfolio.

## The Tech Stack

- **Vite + React** for the fastest dev experience
- **Tailwind CSS v4** for utility-first styling
- **Howler.js** for the music player
- **Canvas API** for the Snake game

## Design Philosophy

The dark cyberpunk aesthetic was inspired by classic sci-fi interfaces. Every interaction should feel like you're operating a futuristic terminal.

## The Music Player

Using Howler.js made audio handling surprisingly simple. The floating player persists across page navigations, so your music never stops.

## Conclusion

Building this site was as much fun as using it. Every element was crafted to feel premium and alive.`,
    date: '2026-03-08',
    tags: ['React', 'Design', 'Vite'],
    author: 'Trieu',
    readTime: '5 min read',
    image: null,
  },
  {
    id: 2,
    title: 'Why I Love the Terminal More Than Any GUI',
    excerpt: 'A developer\'s perspective on why text interfaces are faster, more powerful, and more satisfying than graphical tools.',
    content: `# Why I Love the Terminal

There's something deeply satisfying about a command that does exactly what you want in milliseconds.

## Speed

No mouse, no clicks, no waiting for UI to render. Pure throughput.

## Composability

Pipe commands together, script everything, automate the boring stuff.

## Conclusion

The terminal isn't old — it's timeless.`,
    date: '2026-03-05',
    tags: ['Linux', 'Dev Tools', 'Productivity'],
    author: 'Trieu',
    readTime: '3 min read',
    image: null,
  },
  {
    id: 3,
    title: 'Snake Game: From Canvas to High Score',
    excerpt: 'How I implemented a classic Snake game using pure HTML Canvas and added a leaderboard with localStorage.',
    content: `# Snake Game with Canvas

The Canvas API is underrated. Here's how I built Snake from scratch.

## Game Loop

Using \`requestAnimationFrame\` for smooth, consistent rendering.

## Collision Detection

Simple grid-based collision — check if head equals any body segment.

## Leaderboard

localStorage is perfect for client-side scoring. No backend needed.`,
    date: '2026-03-01',
    tags: ['Game Dev', 'Canvas', 'JavaScript'],
    author: 'Trieu',
    readTime: '7 min read',
    image: null,
  },
];

export function getPosts() {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { }
  return defaultPosts;
}

export function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function addPost(post) {
  const posts = getPosts();
  const newPost = {
    ...post,
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    author: 'Trieu',
    readTime: `${Math.ceil(post.content.split(' ').length / 200)} min read`,
  };
  const updated = [newPost, ...posts];
  savePosts(updated);
  return updated;
}

export function getPostById(id) {
  return getPosts().find(p => p.id === Number(id) || p.id === id);
}
