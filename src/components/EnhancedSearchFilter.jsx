import React, { useState } from 'react';
import { Search, Filter, X, RotateCcw, BookOpen, TrendingUp, CheckCircle } from 'lucide-react';

const EnhancedSearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  setFilters, 
  stats, 
  onReset 
}) => {
  const [showFilters, setShowFilters] = useState(true);

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
      
      {/* Search Bar Section */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="relative">
          <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-xl shadow-lg border-2 border-gray-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 ml-3 sm:ml-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by title, author, ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-2 py-3 sm:py-4 text-sm sm:text-base text-gray-700 placeholder-gray-400 outline-none min-w-0"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setFilters({ ...filters })}
              className="hidden sm:flex px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg m-1 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg text-sm lg:text-base"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-gray-200 hover:border-indigo-300 text-sm sm:text-base"
        >
          <Filter className="h-4 w-4 text-indigo-600" />
          <span className="font-semibold text-gray-700">
            {showFilters ? 'Hide' : 'Show'} Filters
          </span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="p-4 sm:p-6 border-t-2 border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Branch Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                Branch / Department
              </label>
              <select
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer font-medium text-gray-700"
              >
                <option value="all">All Branches</option>
                <option value="cs">💻 Computer Science</option>
                <option value="mech">⚙️ Mechanical Engineering</option>
                <option value="civil">🏗️ Civil Engineering</option>
                <option value="ece">📡 Electronics & Communication</option>
                <option value="biotech">🧬 Biotechnology</option>
                <option value="general">📚 General</option>
              </select>
            </div>

            {/* Year Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                Academic Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all cursor-pointer font-medium text-gray-700"
              >
                <option value="all">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="reference">Reference Books</option>
              </select>
            </div>

            {/* Genre/Subject Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                Subject / Genre
              </label>
              <select
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all cursor-pointer font-medium text-gray-700"
              >
                <option value="all">All Subjects</option>
                <option value="programming">💻 Programming</option>
                <option value="mathematics">🔢 Mathematics</option>
                <option value="physics">⚛️ Physics</option>
                <option value="engineering">🔧 Engineering</option>
                <option value="fiction">📖 Fiction</option>
                <option value="non-fiction">📚 Non-Fiction</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                <div className="w-1 h-3 sm:h-4 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
                Availability Status
              </label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 outline-none transition-all cursor-pointer font-medium text-gray-700"
              >
                <option value="all">All Books</option>
                <option value="available">✅ Available Now</option>
                <option value="unavailable">❌ Currently Issued</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="mt-3 sm:mt-4 flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold rounded-lg transition-all text-sm sm:text-base"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* Stats Section - FIXED RESPONSIVE */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          
          {/* Total Books */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border-2 border-gray-100 hover:border-indigo-300 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 group-hover:scale-110 transition-transform" />
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Books</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.total.toLocaleString()}</p>
          </div>

          {/* Available Books */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border-2 border-gray-100 hover:border-green-300 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 group-hover:scale-110 transition-transform" />
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Available</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.available.toLocaleString()}</p>
          </div>

          {/* Showing Results */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border-2 border-gray-100 hover:border-purple-300 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 group-hover:scale-110 transition-transform" />
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Showing</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.showing.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchFilter;