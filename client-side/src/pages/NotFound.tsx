import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-green via-white to-main-color/10 flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-main-color/20 animate-bounce-subtle select-none">
            404
          </h1>
          <div className="relative -mt-8">
            <div className="absolute inset-0 bg-main-color  bg-clip-text text-transparent">
              <span className="text-6xl md:text-8xl font-playfair font-bold animate-float">
                Oops!
              </span>
            </div>
            <span className="text-6xl md:text-8xl font-playfair font-bold text-main-color animate-float">
              Oops!
            </span>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-text-color mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-light-color max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off into the
            digital wilderness. Don't worry, even the best explorers sometimes
            take a wrong turn!
          </p>
          {location.pathname !== "/" && (
            <p className="text-sm text-light-color/80 mt-2 italic">
              Path attempted:{" "}
              <code className="bg-main-color/10 px-2 py-1 rounded">
                {location.pathname}
              </code>
            </p>
          )}
        </div>

        {/* Floating Elements */}
        <div className="relative mb-12">
          <div
            className="absolute -top-4 left-1/4 animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <BookOpen className="h-8 w-8 text-main-color/30" />
          </div>
          <div
            className="absolute -top-8 right-1/4 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <Search className="h-6 w-6 text-flag-color/40" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
          <Link to="/">
            <Button
              size="lg"
              className="bg-main-color text-white hover:bg-sec-color px-8 py-3 text-lg font-semibold transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Back to Home
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="border-main-color text-main-color hover:bg-main-color hover:text-white px-8 py-3 text-lg transition-all duration-300 group"
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>

        <div className="mt-16 flex justify-center space-x-4">
          <div
            className="w-2 h-2 bg-main-color rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-flag-color rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-sec-color rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
