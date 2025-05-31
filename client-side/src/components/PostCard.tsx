import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, User, Calendar, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

export interface Post {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  currentUserId: string;
  onDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  currentUserId,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike(post.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(post.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Link to={`/post/${post.id}`} className="block group cursor-pointer">
        <article className="bg-white rounded-xl shadow-sm border border-main-color/10 overflow-hidden hover:shadow-lg hover:border-main-color/30 transition-all duration-300 h-full flex flex-col">
          {post.coverImage && (
            <div className="aspect-video overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full border-2 border-main-color/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-light-color" />
                  <p className="text-sm font-medium text-text-color truncate">
                    {post.author.name}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-light-color" />
                  <p className="text-xs text-light-color">
                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-text-color mb-3 line-clamp-2 group-hover:text-main-color transition-colors">
              {post.title}
            </h2>

            <p className="text-light-color text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
              {post.content.length > 150
                ? post.content.substring(0, 150) + "..."
                : post.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-light-green">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`p-0 h-auto hover:bg-transparent group/like cursor-pointer ${
                    post.isLiked
                      ? "text-red-500"
                      : "text-light-color hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 mr-1 transition-colors cursor-pointer ${
                      post.isLiked
                        ? "fill-current"
                        : "group-hover/like:fill-current"
                    }`}
                  />
                  <span className="text-xs">{post.likes}</span>
                </Button>

                <div className="flex items-center text-light-color">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="text-xs">{post.comments}</span>
                </div>

              
                {post.author.id === currentUserId && onDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="text-red-500 hover:text-red-800 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <span className="text-xs text-main-color font-medium group-hover:text-sec-color transition-colors">
                Read more →
              </span>
            </div>
          </div>
        </article>
      </Link>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onOpenChange={() => setShowDeleteConfirm(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCard;
