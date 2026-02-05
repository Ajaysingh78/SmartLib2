import React from "react";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Heart,
} from "lucide-react";

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  IES Library
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Admin Portal
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering education through efficient library management.
              Streamlining access to knowledge for the IES University community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/admin/dashboard"
                  className="text-sm hover:text-indigo-400 transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/admin/books"
                  className="text-sm hover:text-indigo-400 transition-colors"
                >
                  Book Management
                </a>
              </li>
              <li>
                <a
                  href="/admin/users"
                  className="text-sm hover:text-indigo-400 transition-colors"
                >
                  Member Directory
                </a>
              </li>
              <li>
                <a
                  href="/admin/reports"
                  className="text-sm hover:text-indigo-400 transition-colors"
                >
                  Analytics & Reports
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/help"
                  className="text-sm hover:text-indigo-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-sm hover:text-indigo-400 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/status"
                  className="text-sm hover:text-indigo-400 transition-colors"
                >
                  System Status
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm hover:text-indigo-400 transition-colors"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <span className="text-sm">
                  IES Campus, Knowledge Park
                  <br />
                  Bhopal, MP 462001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <a
                  href="mailto:library@ies.edu"
                  className="text-sm hover:text-indigo-400 transition-colors"
                >
                  library@ies.edu
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-sm hover:text-indigo-400 transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} IES University Library. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
