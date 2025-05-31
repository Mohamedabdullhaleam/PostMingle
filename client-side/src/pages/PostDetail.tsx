import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Calendar,
  User,
  Send,
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Author {
  _id: string;
  username: string;
  email: string;
}

interface Comment {
  _id: string;
  content: string;
  user: Author;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  user: Author;
  likes: Author[];
  comments: Comment[];
  createdAt: string;
  isLiked?: boolean;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Fetch post and comments
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/posts/${id}`);

        if (response.data.success) {
          const postData = response.data.data;

          // Check if current user liked the post
          const isLiked = user
            ? postData.likes.some(
                (likeUser: Author) => likeUser._id === user.id
              )
            : false;

          setPost({
            ...postData,
            isLiked,
          });
        } else {
          toast.error(response.data.message || "Failed to load post");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load post");
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error("You need to be logged in to like posts");
      return;
    }

    try {
      setIsLiking(true);
      // Optimistic UI update
      if (post) {
        const wasLiked = post.isLiked;
        const newLikes = wasLiked
          ? post.likes.filter((likeUser) => likeUser._id !== user.id)
          : [
              ...post.likes,
              {
                _id: user.id,
                username: user.username,
                email: user.email,
              },
            ];

        setPost({
          ...post,
          likes: newLikes,
          isLiked: !wasLiked,
        });
      }

      // Send API request
      await api.post(
        `/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update like");
      // Revert on error
      if (post) {
        setPost({
          ...post,
          likes: post.likes,
          isLiked: post.isLiked,
        });
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      toast.error("You need to be logged in to comment");
      return;
    }

    try {
      setIsCommenting(true);
      const response = await api.post(
        `/posts/${id}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        const updatedComments = response.data.data.comments;
        const newCommentData = updatedComments[updatedComments.length - 1];
        if (post) {
          setPost({
            ...post,
            comments: [newCommentData, ...post.comments],
          });
        }
        setNewComment("");
        toast.success("Comment added successfully");
      } else {
        toast.error(response.data.message || "Failed to add comment");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-green">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-main-color" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-light-green">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-color mb-4">
              Post Not Found
            </h1>
            <p className="text-light-color mb-8">
              The post you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-main-color hover:bg-sec-color"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-green">
      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-light-color hover:text-text-color hover:bg-main-color/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-color mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author Info & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user._id}`}
                alt={post.user.username}
                className="w-12 h-12 rounded-full border-2 border-main-color"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-light-color" />
                  <span className="font-semibold text-text-color">
                    {post.user.username}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-light-color text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`border-light-color text-light-color hover:bg-main-color hover:text-white hover:border-main-color ${
                  post.isLiked
                    ? "bg-red-100 border-red-200 text-red-500 hover:bg-red-100"
                    : ""
                }`}
              >
                {isLiking ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      post.isLiked ? "fill-current" : ""
                    }`}
                  />
                )}
                {post.likes.length}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-light-color text-light-color hover:bg-main-color hover:text-white hover:border-main-color"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {post.comments.length}
              </Button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.image && (
          <div className="mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-main-color/10">
            <div className="text-text-color leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-main-color/20 pt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-main-color" />
            Comments ({post.comments.length})
          </h2>

          {/* Add Comment Form */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                  user?.id || "guest"
                }`}
                alt={user?.username || "You"}
                className="w-10 h-10 rounded-full mt-1"
              />
              <div className="flex-1">
                <form onSubmit={handleAddComment}>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="min-h-[100px]"
                    disabled={isCommenting || !user}
                  />
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isCommenting || !newComment.trim() || !user}
                      className="bg-main-color hover:bg-sec-color"
                    >
                      {isCommenting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Add Comment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.length === 0 ? (
              <div className="text-center py-8 border border-main-color/20 rounded-lg">
                <MessageCircle className="w-12 h-12 mx-auto text-main-color/30 mb-4" />
                <p className="text-light-color">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              post.comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user._id}`}
                    alt={comment.user.username}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 bg-white rounded-lg p-4 border border-main-color/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-text-color">
                          {comment.user.username}
                        </span>
                        <span className="text-light-color text-sm ml-2">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-text-color whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
