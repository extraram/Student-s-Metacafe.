
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './components/pages/HomePage';
import VideoPage from './components/pages/VideoPage';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
          <Header onSearch={setSearchQuery} />
          <Routes>
            <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
            <Route path="/video/:id" element={<VideoPage />} />
          </Routes>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
