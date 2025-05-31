import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

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
  deletePost: (postId: string) => void;
  addPost: (newPost: Post) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const getToken = () => localStorage.getItem("token");

  const fetchPosts = async () => {
    try {
      setIsRefreshing(true);
      const res = await api.get("/posts", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const postsData = res.data.data;

      const updatedPosts = postsData.map((post: Post) => {
        const isLiked = post.likes.some(
          (likeUser) => likeUser._id === user?.id
        );
        return { ...post, isLiked };
      });

      setPosts(updatedPosts || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to load posts";
      setError(errorMsg);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const likePost = async (postId: string) => {
    if (!user) {
      toast.error("You need to be logged in to like posts.");
      return;
    }

    try {
      // Optimistic UI update
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked
                  ? post.likes.filter((likeUser) => likeUser._id !== user.id)
                  : [
                      ...post.likes,
                      {
                        _id: user.id,
                        username: user.username,
                        email: user.email,
                      },
                    ],
              }
            : post
        )
      );

      await api.post(
        `/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update like status"
      );
      fetchPosts();
    }
  };

  const deletePost = async (postId: string) => {
    try {
      // Optimistic UI update
      setPosts((prev) => prev.filter((post) => post._id !== postId));

      await api.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      toast.success("Post deleted successfully");
    } catch (err: any) {
      fetchPosts();

      const errorMessage =
        err.response?.data?.message || "Failed to delete post";
      toast.error(errorMessage);

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        logout();
      }
    }
  };

  const addPost = (newPost: Post) => {
    setPosts((prevPosts) => {
      const exists = prevPosts.some((post) => post._id === newPost._id);
      if (!exists) {
        return [
          {
            ...newPost,
            createdAt: newPost.createdAt || new Date().toISOString(),
            updatedAt: newPost.updatedAt || new Date().toISOString(),
            deleted: newPost.deleted || false,
            likes: newPost.likes || [],
            comments: newPost.comments || [],
            isLiked: newPost.isLiked || false,
          },
          ...prevPosts,
        ];
      }
      return prevPosts;
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        isLoading,
        isRefreshing,
        error,
        fetchPosts,
        likePost,
        deletePost,
        addPost,
      }}
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
