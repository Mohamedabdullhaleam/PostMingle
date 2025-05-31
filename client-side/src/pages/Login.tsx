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
  Users,
  Sparkles,
  ArrowRight,
  ShieldOff,
} from "lucide-react";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      await login(values.email, values.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error: any) {
      const msg = error.message?.toLowerCase() || "";

      if (msg.includes("credentials")) {
        toast.error("Invalid credentials. Please try again.", {
          icon: <ShieldOff className="text-red-500 w-5 h-5" />,
          action: {
            label: "Reset Password",
            onClick: () => navigate("/reset-password"),
          },
        });
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-main-color via-sec-color to-text-color flex relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-flag-color/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-32 w-96 h-96 bg-light-green/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-main-color/30 rounded-full blur-3xl"></div>
      </div>

      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 text-white p-12 flex-col justify-center relative z-10">
        <div className="max-w-lg">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-flag-color rounded-xl flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold">PostMingle</h1>
            </div>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-flag-color bg-clip-text text-transparent">
              Welcome Back!
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Continue your journey of sharing stories, connecting with readers,
              and building your digital presence in our vibrant community.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-flag-color/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-flag-color" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Rich Content Creation</h3>
                <p className="text-sm text-white/80">
                  Create beautiful posts with images and rich formatting
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-flag-color/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-flag-color" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Vibrant Community</h3>
                <p className="text-sm text-white/80">
                  Connect with fellow writers and passionate readers
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-flag-color/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-flag-color" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Easy Publishing</h3>
                <p className="text-sm text-white/80">
                  Share your thoughts effortlessly with our intuitive editor
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-main-color to-sec-color rounded-2xl mb-4 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-text-color mb-2">
                Sign In
              </h2>
              <p className="text-light-color">
                Welcome back! Please sign in to continue your journey
              </p>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-text-color font-medium"
                    >
                      Email Address
                    </Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      className={`h-12 border-2 ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-light-color/20 focus:border-main-color"
                      } rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300`}
                      placeholder="Enter your email address"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-text-color font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`h-12 border-2 ${
                          errors.password && touched.password
                            ? "border-red-500"
                            : "border-light-color/20 focus:border-main-color"
                        } rounded-xl pr-12 bg-white/80 backdrop-blur-sm transition-all duration-300`}
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent rounded-xl cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-light-color" />
                        ) : (
                          <Eye className="w-5 h-5 text-light-color" />
                        )}
                      </Button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sec-color hover:text-btn-color text-sm font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-btn-color to-sec-color hover:from-sec-color hover:to-btn-color text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group cursor-pointer"
                    disabled={isLoading || isSubmitting}
                  >
                    {isLoading || isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>Sign In</>
                    )}
                  </Button>

                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-light-color/30"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-light-color font-medium">
                          Don't have an account?
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/register"
                      className="w-full h-12 border-2 border-main-color text-main-color hover:bg-main-color hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center group hover:shadow-lg"
                    >
                      Create Account
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
