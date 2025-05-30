import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import PostCard, { type Post } from "../components/PostCard";
import FloatingAddButton from "../components/FloatingAddButton";
import { AuthProvider } from "../contexts/AuthContext";
import { Loader2, Search } from "lucide-react";
import { Input } from "../components/ui/input";

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const mockPosts: Post[] = [
    {
      id: "1",
      title: "Getting Started with Modern Web Development",
      content:
        "Web development has evolved significantly over the past few years. From simple HTML pages to complex single-page applications, the landscape continues to change rapidly. In this comprehensive guide, we'll explore the latest trends, tools, and best practices that every developer should know in 2024.",
      coverImage:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
      author: {
        id: "2",
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      createdAt: new Date("2024-01-15"),
      likes: 42,
      comments: 12,
      isLiked: false,
    },
    {
      id: "2",
      title: "The Future of Artificial Intelligence",
      content:
        "Artificial Intelligence is no longer a concept of the future—it's here and transforming industries at an unprecedented pace. From healthcare to finance, AI is revolutionizing how we work, live, and interact with technology.",
      coverImage:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      author: {
        id: "3",
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      },
      createdAt: new Date("2024-01-14"),
      likes: 89,
      comments: 23,
      isLiked: true,
    },
    {
      id: "3",
      title: "Building Sustainable Apps",
      content:
        "In today's world, sustainability isn't just about the environment—it's about building software that lasts, performs well, and doesn't waste resources. Learn how to create applications that are both environmentally and economically sustainable.",
      coverImage:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop",
      author: {
        id: "4",
        name: "Emma Davis",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
      createdAt: new Date("2024-01-13"),
      likes: 67,
      comments: 18,
      isLiked: false,
    },
    {
      id: "4",
      title: "Design Systems That Scale",
      content:
        "Creating a design system is more than just making things look pretty. It's about establishing a foundation that can grow with your product and team. Here's how to build design systems that actually work.",
      author: {
        id: "5",
        name: "Alex Rodriguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      },
      createdAt: new Date("2024-01-12"),
      likes: 34,
      comments: 8,
      isLiked: false,
    },
  ];

  useEffect(() => {
    console.log("Loading posts...");
    // Simulate loading
    const timer = setTimeout(() => {
      console.log("Setting posts:", mockPosts);
      setPosts(mockPosts);
      setIsLoading(false);
      console.log("Posts loaded successfully");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("Current posts state:", posts);
    console.log("Is loading:", isLoading);
  }, [posts, isLoading]);

  const handleLike = (postId: string) => {
    console.log("Liking post:", postId);
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Filtered posts:", filteredPosts);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-light-green">
        <Header />

        {/* Hero Section */}
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-main-color">Latest Posts</h2>
            {searchQuery && (
              <p className="text-light-color">
                {filteredPosts.length} result
                {filteredPosts.length !== 1 ? "s" : ""} for "{searchQuery}"
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-main-color" />
              <span className="ml-2 text-light-color">Loading posts...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-light-color text-lg">
                {searchQuery
                  ? "No posts found matching your search."
                  : "No posts available yet."}
              </p>
              {!searchQuery && (
                <p className="text-light-color mt-2">
                  Be the first to share something amazing!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                console.log("Rendering post:", post.title);
                return (
                  <PostCard key={post.id} post={post} onLike={handleLike} />
                );
              })}
            </div>
          )}
        </main>

        <FloatingAddButton />
      </div>
    </AuthProvider>
  );
};

export default Index;
