
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MOCK_VIDEOS } from '../../constants';
import { Video } from '../../types';
import { ThumbsUpIcon } from '../icons/ThumbsUpIcon';
import { ThumbsDownIcon } from '../icons/ThumbsDownIcon';
import CommentSection from '../CommentSection';
import RelatedVideos from '../RelatedVideos';
import Modal from '../Modal';
import Spinner from '../Spinner';
import { generateSummaryAndKeywords, moderateContent } from '../../services/geminiService';

const VideoPlayer: React.FC<{ video: Video }> = ({ video }) => {
    const [likes, setLikes] = useState(video.likes);
    const [dislikes, setDislikes] = useState(video.dislikes);

    return (
        <div className="flex-grow">
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                <video key={video.id} controls className="w-full h-full" poster={video.thumbnailUrl}>
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="py-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{video.title}</h1>
                <div className="flex items-center justify-between mt-2 text-gray-500 dark:text-gray-400">
                    <p>{video.views.toLocaleString()} views &bull; {video.uploadedAt}</p>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setLikes(l => l + 1)} className="flex items-center space-x-2 hover:text-blue-500 dark:hover:text-blue-400">
                            <ThumbsUpIcon className="w-5 h-5" />
                            <span>{likes.toLocaleString()}</span>
                        </button>
                        <button onClick={() => setDislikes(d => d + 1)} className="flex items-center space-x-2 hover:text-red-500 dark:hover:text-red-400">
                            <ThumbsDownIcon className="w-5 h-5" />
                             <span>{dislikes.toLocaleString()}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [video, setVideo] = useState<Video | undefined>(undefined);
    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
    const [isModerationModalOpen, setModerationModalOpen] = useState(false);
    const [aiContent, setAiContent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const foundVideo = MOCK_VIDEOS.find(v => v.id === id);
        setVideo(foundVideo);
    }, [id]);

    if (!video) {
        // In a real app, you might show a loading state or a 404 page
        return <Navigate to="/" />;
    }

    const handleGenerateSummary = async () => {
        setSummaryModalOpen(true);
        setIsLoading(true);
        const result = await generateSummaryAndKeywords(video.description);
        setAiContent(result);
        setIsLoading(false);
    };

    const handleModerateContent = async () => {
        setModerationModalOpen(true);
        setIsLoading(true);
        const result = await moderateContent(video.title, video.description);
        setAiContent(result);
        setIsLoading(false);
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:space-x-8">
                <div className="w-full">
                    <VideoPlayer video={video} />
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
                         <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center">
                                 <img src={video.uploader.avatar} alt={video.uploader.name} className="w-12 h-12 rounded-full mr-4" />
                                 <div>
                                     <p className="font-bold text-gray-900 dark:text-white">{video.uploader.name}</p>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-2">
                                <button onClick={handleGenerateSummary} className="px-4 py-2 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition">AI Summary</button>
                                <button onClick={handleModerateContent} className="px-4 py-2 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition">AI Moderation</button>
                            </div>
                         </div>
                         <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{video.description}</p>
                    </div>
                    <CommentSection />
                </div>
                <RelatedVideos currentVideo={video} />
            </div>

            <Modal title="AI Generated Summary & Keywords" isOpen={isSummaryModalOpen} onClose={() => setSummaryModalOpen(false)}>
                {isLoading ? <Spinner /> : (
                    <div>
                        <h4 className="font-semibold text-lg dark:text-white mb-2">Summary</h4>
                        <p className="mb-4">{aiContent?.summary}</p>
                        <h4 className="font-semibold text-lg dark:text-white mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                            {aiContent?.keywords?.map((kw: string) => (
                                <span key={kw} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded-md">{kw}</span>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            <Modal title="AI Content Moderation" isOpen={isModerationModalOpen} onClose={() => setModerationModalOpen(false)}>
                {isLoading ? <Spinner /> : (
                    <div>
                        <h4 className="font-semibold text-lg dark:text-white mb-2">Classification</h4>
                        <p className={`px-3 py-1 inline-block rounded-full text-white text-sm ${aiContent?.classification === 'Educational' ? 'bg-green-500' : aiContent?.classification === 'Inappropriate' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                            {aiContent?.classification}
                        </p>
                        <h4 className="font-semibold text-lg dark:text-white mt-4 mb-2">Reason</h4>
                        <p>{aiContent?.reason}</p>
                    </div>
                )}
            </Modal>
        </main>
    );
};

export default VideoPage;
