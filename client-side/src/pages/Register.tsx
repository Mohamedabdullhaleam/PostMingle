import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Loader2,
  Eye,
  EyeOff,
  BookOpen,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-green via-white to-sec-color/20 flex">
      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sec-color rounded-full mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-text-color mb-2">
              Join PostMingle
            </h2>
            <p className="text-light-color">
              Start your blogging journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-text-color font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="h-12 border-2 border-light-color/30 focus:border-sec-color rounded-lg"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-color font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-12 border-2 border-light-color/30 focus:border-sec-color rounded-lg"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-color font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="h-12 border-2 border-light-color/30 focus:border-sec-color rounded-lg pr-12"
                  placeholder="Create a password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-light-color" />
                  ) : (
                    <Eye className="w-5 h-5 text-light-color" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-text-color font-medium"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="h-12 border-2 border-light-color/30 focus:border-sec-color rounded-lg pr-12"
                  placeholder="Confirm your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-light-color" />
                  ) : (
                    <Eye className="w-5 h-5 text-light-color" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-sec-color hover:bg-btn-color text-white font-semibold rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-light-color/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-light-color">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Link
                to="/login"
                className=" w-full h-12 border-2 border-sec-color text-sec-color hover:bg-sec-color hover:text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sec-color to-main-color text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">Start Your</h1>
            <h2 className="text-6xl font-bold text-flag-color mb-6">
              Story Today
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of writers sharing their thoughts, experiences, and
              expertise with the world.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <Zap className="w-8 h-8 text-flag-color" />
              <div>
                <h3 className="font-semibold">Quick Setup</h3>
                <p className="text-sm text-white/80">
                  Get started in under 2 minutes
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <Shield className="w-8 h-8 text-flag-color" />
              <div>
                <h3 className="font-semibold">Secure Platform</h3>
                <p className="text-sm text-white/80">
                  Your data is safe with us
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <BookOpen className="w-8 h-8 text-flag-color" />
              <div>
                <h3 className="font-semibold">Rich Editor</h3>
                <p className="text-sm text-white/80">
                  Beautiful posts with media support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
