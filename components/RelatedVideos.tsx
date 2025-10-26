
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { MOCK_VIDEOS } from '../constants';
import { getRelatedVideoIdeas } from '../services/geminiService';
import Spinner from './Spinner';

interface RelatedVideosProps {
  currentVideo: Video;
}

const RelatedVideoCard: React.FC<{ video: Video }> = ({ video }) => (
    <Link to={`/video/${video.id}`} className="flex space-x-3 group">
        <img src={video.thumbnailUrl} alt={video.title} className="w-40 h-24 object-cover rounded-lg" />
        <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                {video.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{video.uploader.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{`${(video.views / 1000).toFixed(1)}k views`}</p>
        </div>
    </Link>
);

const RelatedVideos: React.FC<RelatedVideosProps> = ({ currentVideo }) => {
    const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            setIsLoading(true);
            const ideas = await getRelatedVideoIdeas(currentVideo.title, currentVideo.description);
            
            // This is a simple simulation: find mock videos whose titles are similar to the AI-generated ideas.
            const related = MOCK_VIDEOS.filter(video => 
                video.id !== currentVideo.id &&
                (ideas.some((idea: string) => video.title.toLowerCase().includes(idea.toLowerCase().substring(0, 10))) ||
                video.tags.some(tag => currentVideo.tags.includes(tag)))
            ).slice(0, 5); // Limit to 5 related videos

            setRelatedVideos(related.length ? related : MOCK_VIDEOS.filter(v => v.id !== currentVideo.id).slice(0, 5));
            setIsLoading(false);
        };

        fetchRelated();
    }, [currentVideo]);

    return (
        <div className="w-full lg:w-96 flex-shrink-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Videos</h3>
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Spinner />
                </div>
            ) : (
                <div className="space-y-4">
                    {relatedVideos.map(video => <RelatedVideoCard key={video.id} video={video} />)}
                </div>
            )}
        </div>
    );
};

export default RelatedVideos;
