import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import MusicPlayer from './components/music/MusicPlayer.jsx';

import HomePage from './pages/HomePage.jsx';
import MusicPage from './pages/MusicPage.jsx';
import GamesPage from './pages/GamesPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import ToolsPage from './pages/ToolsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<PostDetailPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
      {/* Floating music player persists across all routes */}
      <MusicPlayer />
    </BrowserRouter>
  );
}
