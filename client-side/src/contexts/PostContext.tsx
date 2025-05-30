import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// types/Post.ts

export type User = {
  _id: string;
  username: string;
  email: string;
};

export type Comment = {
  _id: string;
  user: string;
  content: string;
  createdAt: string;
};

export type Post = {
  _id: string;
  title: string;
  content: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  likes: User[];
  comments: Comment[];
  isLiked?: boolean;
  image?: string;
};

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  fetchPosts: () => void;
  likePost: (postId: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const fetchPosts = async () => {
    try {
      setIsRefreshing(true);
      const res = await api.get("/posts");
      setPosts(res.data.data || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load posts");
      if (err.name === "401") {
        toast.error("Session expired. Please login again.");
        logout();
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const likePost = async (postId: string) => {
    try {
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked
                  ? post.likes.filter(
                      (user) => user._id !== (post.user?._id ?? "")
                    )
                  : [...post.likes, post.user],
              }
            : post
        )
      );
      await api.post(`/posts/${postId}/like`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update like status");
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{ posts, isLoading, isRefreshing, error, fetchPosts, likePost }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePosts must be used within PostProvider");
  return context;
};
