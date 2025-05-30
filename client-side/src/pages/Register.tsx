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
  LogIn,
  ShieldOff,
} from "lucide-react";

import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      await register(values.name, values.email, values.password);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      console.log("Register error:", error);

      const msg = error.message?.toLowerCase() || "";

      if (msg.includes("email")) {
        toast.error("Account already exists. Want to login?", {
          icon: <ShieldOff className="text-red-500 w-5 h-5" />,
          action: {
            label: "Login",
            onClick: () => navigate("/login"),
          },
        });
      } else {
        toast.error(error.message || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-green via-white to-sec-color/20 flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
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

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-text-color font-medium">
                    Full Name
                  </Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    className="h-12 border-2 border-light-color/30 focus:border-sec-color rounded-lg"
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Email */}
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
                    className="h-12 border-2 border-light-color/30 focus:border-sec-color rounded-lg"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

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
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-text-color font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="h-12 border-2 border-light-color/30 focus:border-sec-color rounded-lg pr-12"
                      placeholder="Confirm your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-light-color" />
                      ) : (
                        <Eye className="w-5 h-5 text-light-color" />
                      )}
                    </Button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
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

                {/* Sign In Link */}
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
                    className="w-full h-12 border-2 border-sec-color text-sec-color hover:bg-sec-color hover:text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
                  >
                    Sign In
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

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
