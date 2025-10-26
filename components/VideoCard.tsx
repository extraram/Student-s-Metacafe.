
import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <Link to={`/video/${video.id}`} className="flex flex-col group">
      <div className="relative">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-auto object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="flex items-start mt-3">
        <img src={video.uploader.avatar} alt={video.uploader.name} className="w-9 h-9 rounded-full mr-3" />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400">
            {video.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{video.uploader.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {`${(video.views / 1000).toFixed(1)}k views`} &bull; {video.uploadedAt}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
