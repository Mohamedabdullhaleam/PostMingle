import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  const { register, login, logout, isLoading, user, token } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-light-green sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-main-color">
            PostMingle
          </Link>

          {/* Center Nav Links */}
          {/* <nav className="hidden md:flex items-center space-x-6">
            {["/"].map((path, index) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  `font-semibold ${
                    isActive
                      ? "text-main-color underline underline-offset-4"
                      : "text-text-color hover:text-main-color"
                  }`
                }
              >
                {["Home"][index]}
              </NavLink>
            ))}
          </nav> */}

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-light-green"
                  >
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=male"
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="hidden md:block text-text-color font-medium">
                      {user.username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white text-text-color shadow-lg rounded-md"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 w-full"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="bg-btn-color hover:bg-sec-color text-white">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden transition-transform duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 rotate-180" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-light-green">
          <nav className="p-4  space-y-2">
            {["/"].map((path, index) => (
              <NavLink
                key={path}
                to={path}
                end
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block font-semibold ${
                    isActive ? "text-main-color" : "text-text-color"
                  }`
                }
              >
                {["Home"][index]}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
