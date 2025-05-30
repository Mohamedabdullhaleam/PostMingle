// Import dependencies
import { useState } from "react";
import { usePosts } from "../contexts/PostContext";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import FloatingAddButton from "../components/FloatingAddButton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const { posts, isLoading, likePost } = usePosts();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-light-green">
      <Header />
      {/* Hero Section & Search Bar */}
      <section className="bg-gradient-to-br from-main-color to-sec-color text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to PostMingle
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Share your thoughts, connect with others, and discover amazing
            content from our community of writers.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-color w-5 h-5" />
            <Input
              type="text"
              placeholder="Search posts, authors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-0 text-text-color placeholder:text-light-color"
            />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-t-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-lg text-gray-700">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="text-xl font-medium">No posts found.</p>
            <p className="mt-2 text-gray-500">
              Try a different search term or create a new post!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={{
                  id: post._id,
                  title: post.title,
                  content: post.content,
                  createdAt: new Date(post.createdAt),
                  likes: post.likes.length,
                  comments: post.comments.length,
                  isLiked: !!post.isLiked,
                  author: {
                    id: post.user._id,
                    name: post.user.username,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post._id}`,
                  },
                  coverImage:
                    post.image ||
                    "https://images.unsplash.com/photo-1743404318518-32d963f26501?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                onLike={() => likePost(post._id)}
              />
            ))}
          </div>
        )}
      </main>

      <FloatingAddButton />
    </div>
  );
};

export default Index;
