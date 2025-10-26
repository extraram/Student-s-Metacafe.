
export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  replies: Comment[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  tags: string[];
  uploader: {
    name: string;
    avatar: string;
  };
  views: number;
  likes: number;
  dislikes: number;
  uploadedAt: string;
}
