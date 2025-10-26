
import React, { useState, useMemo } from 'react';
import VideoCard from '../VideoCard';
import { MOCK_VIDEOS } from '../../constants';

interface HomePageProps {
  searchQuery: string;
}

const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
  const filteredVideos = useMemo(() => {
    if (!searchQuery) {
      return MOCK_VIDEOS;
    }
    return MOCK_VIDEOS.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {filteredVideos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </main>
  );
};

export default HomePage;
