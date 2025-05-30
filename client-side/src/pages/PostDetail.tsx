import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";

const mockPosts = [
  {
    id: "1",
    title: "Getting Started with Modern Web Development",
    content: `Web development has evolved significantly over the past few years. From simple HTML pages to complex single-page applications, the landscape continues to change rapidly. In this comprehensive guide, we'll explore the latest trends, tools, and best practices that every developer should know in 2024.

    The modern web development ecosystem is vast and can be overwhelming for newcomers. However, understanding the core principles and staying updated with the latest technologies is essential for success in this field.

    ## Key Technologies to Focus On

    ### Frontend Development
    React, Vue.js, and Angular remain the dominant frameworks for building user interfaces. Each has its strengths:
    - React: Component-based architecture with a large ecosystem
    - Vue.js: Progressive framework with gentle learning curve
    - Angular: Full-featured framework for enterprise applications

    ### Backend Development
    Node.js, Python (Django/Flask), and modern frameworks like Next.js are reshaping how we build server-side applications.

    ### Styling and UI
    Tailwind CSS has revolutionized how we approach styling, moving away from traditional CSS methodologies toward utility-first approaches.

    ## Best Practices for 2024

    1. **Performance Optimization**: Focus on Core Web Vitals and user experience metrics
    2. **Accessibility**: Ensure your applications are usable by everyone
    3. **Security**: Implement proper authentication and data protection
    4. **Testing**: Write comprehensive tests for reliability
    5. **Deployment**: Use modern CI/CD pipelines for efficient releases

    The future of web development looks promising with technologies like WebAssembly, Progressive Web Apps, and AI-assisted development tools becoming more mainstream.`,
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
    content: `Artificial Intelligence is no longer a concept of the future—it's here and transforming industries at an unprecedented pace. From healthcare to finance, AI is revolutionizing how we work, live, and interact with technology.

    The rapid advancement of AI technologies has created both exciting opportunities and important challenges that we must address as a society.

    ## Current AI Landscape

    ### Machine Learning and Deep Learning
    These technologies form the backbone of modern AI systems, enabling machines to learn from data and make intelligent decisions.

    ### Natural Language Processing
    Recent breakthroughs in NLP have led to more sophisticated chatbots, translation services, and content generation tools.

    ### Computer Vision
    AI can now interpret and analyze visual information with remarkable accuracy, opening new possibilities in healthcare, autonomous vehicles, and security.

    ## Industry Applications

    **Healthcare**: AI assists in diagnosis, drug discovery, and personalized treatment plans.
    **Finance**: Fraud detection, algorithmic trading, and risk assessment.
    **Transportation**: Autonomous vehicles and traffic optimization.
    **Education**: Personalized learning and intelligent tutoring systems.

    ## Ethical Considerations

    As AI becomes more prevalent, we must address:
    - Privacy and data protection
    - Algorithmic bias and fairness
    - Job displacement and economic impact
    - Transparency and explainability

    The future will likely see even more integration of AI into our daily lives, making it crucial to develop these technologies responsibly.`,
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
];

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the post by ID
  const post = mockPosts.find((p) => p.id === id);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-light-green">
      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-light-color hover:text-text-color hover:bg-main-color/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-text-color mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author Info & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full border-2 border-main-color"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-light-color" />
                  <span className="font-semibold text-text-color">
                    {post.author.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-light-color text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-light-color text-light-color hover:bg-main-color hover:text-white hover:border-main-color"
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    post.isLiked ? "fill-current" : ""
                  }`}
                />
                {post.likes}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-light-color text-light-color hover:bg-main-color hover:text-white hover:border-main-color"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {post.comments}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-light-color text-light-color hover:bg-main-color hover:text-white hover:border-main-color"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-main-color/10">
            <div className="text-text-color leading-relaxed space-y-6">
              {post.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("##")) {
                  return (
                    <h2
                      key={index}
                      className="text-2xl font-bold text-text-color mt-8 mb-4 border-b-2 border-main-color/20 pb-2"
                    >
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("###")) {
                  return (
                    <h3
                      key={index}
                      className="text-xl font-semibold text-text-color mt-6 mb-3"
                    >
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                if (paragraph.includes("**") && paragraph.includes(":")) {
                  return (
                    <p key={index} className="text-base">
                      {paragraph.split("**").map((part, partIndex) => {
                        if (partIndex % 2 === 1) {
                          return (
                            <strong
                              key={partIndex}
                              className="font-semibold text-text-color"
                            >
                              {part}
                            </strong>
                          );
                        }
                        return part;
                      })}
                    </p>
                  );
                }
                if (paragraph.trim().startsWith("-")) {
                  const items = paragraph
                    .split("\n")
                    .filter((line) => line.trim().startsWith("-"));
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-2">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-base">
                          {item.replace("- ", "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.trim().match(/^\d+\./)) {
                  const items = paragraph
                    .split("\n")
                    .filter((line) => line.trim().match(/^\d+\./));
                  return (
                    <ol key={index} className="list-decimal pl-6 space-y-2">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-base">
                          {item
                            .replace(/^\d+\.\s*/, "")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={index} className="text-base leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 pt-8 border-t border-main-color/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button className="bg-main-color hover:bg-sec-color text-white">
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    post.isLiked ? "fill-current" : ""
                  }`}
                />
                {post.isLiked ? "Liked" : "Like"} ({post.likes})
              </Button>
              <Button
                variant="outline"
                className="border-main-color text-main-color hover:bg-main-color hover:text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Comment
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-light-color hover:text-text-color"
            >
              ← Back to all posts
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
