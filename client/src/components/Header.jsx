import React, { useState, useEffect } from "react";
import { BookOpen, Menu, X, QrCode, Search, Bell } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg"
          : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-4 group">
            <div
              className={`relative ${
                scrolled ? "text-indigo-600" : "text-white"
              }`}
            >
              <BookOpen className="h-10 w-10 transition-transform group-hover:scale-110 group-hover:rotate-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1
                className={`text-2xl font-bold tracking-tight ${
                  scrolled ? "text-gray-900" : "text-white"
                }`}
              >
                IES University{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                  Library
                </span>
              </h1>
              <p
                className={`text-xs ${
                  scrolled ? "text-gray-600" : "text-white/80"
                }`}
              >
                Digital Catalog System • 50,000+ Books
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Border Bottom */}
      <div
        className={`h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      ></div>
    </header>
  );
};

export default Header;
