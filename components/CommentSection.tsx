
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Comment as CommentType } from '../types';

const mockUser = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatar: `https://i.pravatar.cc/150?u=alexdoe`,
};


const Comment: React.FC<{ comment: CommentType }> = ({ comment }) => (
    <div className="flex items-start space-x-4">
      <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-sm text-gray-900 dark:text-white">{comment.user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</p>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.text}</p>
      </div>
    </div>
  );

const CommentSection: React.FC = () => {
    const { user } = useAuth();
    const [comments, setComments] = useState<CommentType[]>([
        {
          id: 'c1',
          user: { name: 'Sarah K.', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?u=sarah' },
          text: 'This was an amazing explanation! Really cleared up my confusion about hooks.',
          timestamp: '2 weeks ago',
          replies: []
        },
        {
          id: 'c2',
          user: { name: 'Mike T.', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?u=mike' },
          text: 'Great video! Could you do one on custom hooks next?',
          timestamp: '1 week ago',
          replies: []
        }
    ]);
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && user) {
            const comment: CommentType = {
                id: `c${comments.length + 1}`,
                user: user,
                text: newComment,
                timestamp: 'just now',
                replies: []
            };
            setComments([comment, ...comments]);
            setNewComment('');
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{comments.length} Comments</h3>
            {user ? (
                <form onSubmit={handleSubmit} className="flex items-start space-x-4 mb-8">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                        />
                        <div className="flex justify-end mt-2">
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed" disabled={!newComment.trim()}>
                                Comment
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Please <button onClick={() => useAuth().signIn()} className="text-blue-500 hover:underline">sign in</button> to comment.
                </p>
            )}

            <div className="space-y-6">
                {comments.map(comment => <Comment key={comment.id} comment={comment} />)}
            </div>
        </div>
    );
};

export default CommentSection;
